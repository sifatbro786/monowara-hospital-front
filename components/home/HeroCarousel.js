"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import Swiper from "swiper";
import { A11y, Autoplay, EffectFade, Keyboard } from "swiper/modules";
import { useReducedMotion } from "motion/react";
import { Emphasis } from "@/components/ui/Emphasis";
import { digits } from "@/lib/i18n/t";
import { cn } from "@/lib/utils";
import "swiper/css";
import "swiper/css/effect-fade";

const SPEED = 1000; // crossfade
const WRAP = "mx-auto w-full max-w-336 px-4 sm:px-6 lg:px-10"; // = <Container>

/**
 * Full-bleed homepage hero slider (Swiper 14 — client ask 2026-10-25, rev. 3: clean, no nav).
 * - Each slide: background photo (Ken Burns while active) under an ink-teal wash, copy anchored
 *   bottom-left. Crossfade (EffectFade) + rewind (no loop clones → exactly one <h1>).
 * - No visible controls (client): autoplay every `intervalMs` (settings.heroSlider.intervalSec,
 *   admin-editable, default 5 s), swipe on touch, ←/→ keys. Pauses on hover, hidden tab, off-screen.
 * - `actions` (Book / Emergency / WhatsApp) are common: one server-rendered overlay pinned above
 *   the QuickPanel overlap. Its measured height is reserved under every slide's copy
 *   (--hero-actions), so copy never collides with the buttons whatever the slide length.
 * - Copy is visible before Swiper initialises (SSR / LCP); CSS hides non-active copy only after
 *   init (`.mh-hero` rules in globals.css). Reduced motion: no autoplay, no Ken Burns.
 */
export function HeroCarousel({ slides, actions, labels, lang, intervalMs = 5000 }) {
    const count = slides.length;
    const reduce = useReducedMotion();
    const rootRef = useRef(null);
    const actionsRef = useRef(null);
    const swiperElRef = useRef(null);
    const swiperRef = useRef(null);
    const autoplay = count > 1 && !reduce;
    // intervalMs = time from one slide to the next (settings.heroSlider, admin-editable);
    // Swiper's `delay` starts after each fade, so subtract the fade.
    const delay = Math.max(1000, intervalMs - SPEED);

    // Swiper core on our own SSR markup (swiper/react builds the instance during render, which
    // calls `new Date()` → not allowed in a Cache Components prerender).
    useEffect(() => {
        const swiper = new Swiper(swiperElRef.current, {
            modules: [A11y, Autoplay, EffectFade, Keyboard],
            effect: "fade",
            fadeEffect: { crossFade: true },
            speed: SPEED,
            rewind: true,
            autoplay: { delay, disableOnInteraction: false, pauseOnMouseEnter: true },
            keyboard: { enabled: true, onlyInViewport: true },
            a11y: {
                containerRoleDescriptionMessage: "carousel",
                containerMessage: labels.region,
                itemRoleDescriptionMessage: "slide",
                slideLabelMessage: "{{index}} / {{slidesLength}}",
            },
        });
        swiperRef.current = swiper;
        return () => {
            swiper.destroy(true, true);
            swiperRef.current = null;
        };
    }, [labels.region, delay]);

    // reserve the actions overlay height under the copy
    useEffect(() => {
        const root = rootRef.current;
        const el = actionsRef.current;
        if (!root || !el) return;
        const ro = new ResizeObserver(([e]) =>
            root.style.setProperty(
                "--hero-actions",
                `${Math.ceil(e.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight)}px`,
            ),
        );
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // reduced motion stops autoplay; off-screen pauses it
    useEffect(() => {
        const s = swiperRef.current;
        if (!s?.autoplay) return;
        if (!autoplay) {
            s.autoplay.stop();
            return;
        }
        // Swiper's start()/resume() re-arm the timer even when already running → guard both
        if (!s.autoplay.running) s.autoplay.start();
        const io = new IntersectionObserver(([e]) => {
            if (!e.isIntersecting) s.autoplay.pause();
            else if (s.autoplay.paused) s.autoplay.resume();
        });
        io.observe(rootRef.current);
        return () => io.disconnect();
    }, [autoplay]);

    const pad = (n) => digits(String(n).padStart(2, "0"), lang);

    return (
        <div
            ref={rootRef}
            className="mh-hero relative [--hero-actions:10rem] [--hero-qp:12rem] sm:[--hero-actions:8rem] sm:[--hero-qp:13rem] lg:[--hero-qp:14rem]"
        >
            <div ref={swiperElRef} className="swiper">
                <div className="swiper-wrapper">
                    {slides.map((s, i) => {
                        const Title = i === 0 ? "h1" : "p";
                        return (
                            <div
                                key={s.id}
                                className="swiper-slide relative isolate overflow-hidden bg-teal-950"
                            >
                                {/* background photo */}
                                <div className="mh-hero-bg absolute inset-0 -z-20">
                                    <Image
                                        src={s.image.src}
                                        alt={s.image.alt}
                                        fill
                                        loading={i === 0 ? "eager" : "lazy"}
                                        fetchPriority={i === 0 ? "high" : "low"}
                                        quality={75}
                                        sizes="100vw"
                                        className="object-cover"
                                        style={{ objectPosition: s.image.position || "center" }}
                                    />
                                </div>
                                {/* ink-teal wash: dense behind the copy (bottom / left), clear on the right */}
                                <span
                                    aria-hidden
                                    className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(4_30_33/0.97)_0%,rgb(4_30_33/0.8)_40%,rgb(4_30_33/0.3)_75%,rgb(4_30_33/0.45)_100%)] lg:bg-[linear-gradient(100deg,rgb(4_30_33/0.92)_0%,rgb(5_40_43/0.78)_36%,rgb(6_60_64/0.3)_64%,rgb(6_60_64/0.06)_100%)]"
                                />
                                <span
                                    aria-hidden
                                    className="absolute inset-x-0 bottom-0 -z-10 h-3/5 bg-linear-to-t from-[rgb(4_30_33/0.92)] via-[rgb(4_30_33/0.55)] to-transparent"
                                />

                                <div
                                    className={cn(
                                        WRAP,
                                        "flex min-h-[max(42rem,calc(100svh-7.5rem))] flex-col justify-end pt-24 pb-[calc(var(--hero-actions)+var(--hero-qp)+1.75rem)] lg:min-h-[max(46rem,calc(100svh-7.5rem))]",
                                    )}
                                >
                                    <div className="mh-hero-copy max-w-3xl text-white">
                                        <p className="flex items-center gap-3 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-teal-100/90 [&:lang(bn)]:text-sm [&:lang(bn)]:normal-case [&:lang(bn)]:tracking-normal">
                                            <span className="tabular-nums text-white">
                                                {pad(i + 1)}
                                            </span>
                                            <span
                                                aria-hidden
                                                className="h-px w-10 bg-teal-200/60"
                                            />
                                            {s.eyebrow}
                                        </p>
                                        <Title className="mt-6 max-w-[16ch] text-display text-white [&:lang(bn)]:leading-[1.22] [&_em]:text-teal-200">
                                            <Emphasis text={s.title} />
                                        </Title>
                                        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
                                            {s.subtitle}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* common actions, pinned above the QuickPanel overlap */}
            <div className="pointer-events-none absolute inset-x-0 bottom-(--hero-qp) z-10">
                <div ref={actionsRef} className={WRAP}>
                    <div className="pointer-events-auto">{actions}</div>
                </div>
            </div>
        </div>
    );
}
