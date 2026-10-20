"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for the whole page: any element with [data-reveal]
 * ("up" default | "clip") fades in once. Optional style={{"--reveal-delay":"120ms"}}.
 * Mounted once in the root layout; re-scans on route change via MutationObserver.
 *
 * Reveals run through the Web Animations API (fill: "forwards") instead of toggling a
 * class: the layout's effect can fire before streamed page segments hydrate, and any
 * class/attribute written onto server HTML before React owns it is a hydration mismatch
 * (and React may later reset it, hiding the element again). Animations never touch the DOM.
 * The hidden start state lives in globals.css (html.js [data-reveal]).
 */
export function RevealObserver() {
    useEffect(() => {
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return; // CSS shows everything
        const root = getComputedStyle(document.documentElement);
        const expo = root.getPropertyValue("--ease-out-expo").trim() || "ease-out";
        const calm = root.getPropertyValue("--ease-calm").trim() || "ease-out";
        const done = new WeakSet();

        const reveal = (el) => {
            done.add(el);
            const delay = parseFloat(getComputedStyle(el).getPropertyValue("--reveal-delay")) || 0;
            if (el.dataset.reveal === "clip") {
                el.firstElementChild?.animate(
                    [
                        { clipPath: "inset(0 0 100% 0)", transform: "translateY(0.25em)" },
                        { clipPath: "inset(0 0 -0.2em 0)", transform: "none" },
                    ],
                    { duration: 1000, delay, easing: expo, fill: "forwards" },
                );
                return;
            }
            el.animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: 700,
                delay,
                easing: calm,
                fill: "forwards",
            });
            el.animate([{ transform: "translateY(14px)" }, { transform: "none" }], {
                duration: 800,
                delay,
                easing: expo,
                fill: "forwards",
            });
        };

        if (!("IntersectionObserver" in window)) {
            document.querySelectorAll("[data-reveal]").forEach(reveal);
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        io.unobserve(e.target);
                        reveal(e.target);
                    }
                }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
        );
        const scan = () =>
            document.querySelectorAll("[data-reveal]").forEach((el) => {
                if (!done.has(el)) io.observe(el); // observe() on an observed node is a no-op
            });
        scan();
        const mo = new MutationObserver(scan);
        mo.observe(document.body, { childList: true, subtree: true });
        return () => {
            io.disconnect();
            mo.disconnect();
        };
    }, []);
    return null;
}
