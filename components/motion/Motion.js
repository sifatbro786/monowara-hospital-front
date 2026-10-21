"use client";

import { useRef } from "react";
import {
    LazyMotion,
    MotionConfig,
    m,
    useReducedMotion,
    useScroll,
    useTransform,
} from "motion/react";

/**
 * Homepage motion layer (motion/react = framer-motion). Calm by design — fades, short rises,
 * clip reveals and slow scroll drift. No springs, no count-ups, nothing loops.
 *
 * - LazyMotion + `m.*` keeps the base cost tiny; the DOM feature bundle is split out and
 *   loaded after hydration (`features` is an async import).
 * - MotionConfig reducedMotion="user": with prefers-reduced-motion, transforms are skipped and
 *   only opacity changes. Scroll drift is switched off entirely (useReducedMotion).
 * - Above the fold stays on the CSS `data-enter` entrance (hero LCP at first paint, see
 *   globals.css) — never put an opacity-0 motion element in the first viewport.
 * - Every m.* element must sit inside <MotionRoot> (strict) — otherwise it stays at `initial`.
 */
const loadFeatures = () => import("./features").then((r) => r.default);

export const EASE = [0.16, 1, 0.3, 1]; // = --ease-out-expo
const VIEWPORT = { once: true, amount: 0.15, margin: "0px 0px -8% 0px" };

export function MotionRoot({ children }) {
    return (
        <LazyMotion features={loadFeatures} strict>
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </LazyMotion>
    );
}

// Static lookup (not m[as] at render) — the React Compiler lint treats that as a new component.
const TAGS = {
    div: m.div,
    dl: m.dl,
    ul: m.ul,
    li: m.li,
    p: m.p,
    figure: m.figure,
    section: m.section,
};

/** Fade + short rise when scrolled into view. */
export function FadeUp({ as = "div", delay = 0, y = 18, duration = 0.9, children, ...rest }) {
    const Tag = TAGS[as] ?? TAGS.div;
    return (
        <Tag
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration, delay, ease: EASE }}
            {...rest}
        >
            {children}
        </Tag>
    );
}

/** Parent that staggers its <StaggerItem> children in. */
export function Stagger({ as = "div", gap = 0.07, delay = 0, children, ...rest }) {
    const Tag = TAGS[as] ?? TAGS.div;
    return (
        <Tag
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={{ show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
            {...rest}
        >
            {children}
        </Tag>
    );
}

const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

export function StaggerItem({ as = "div", children, ...rest }) {
    const Tag = TAGS[as] ?? TAGS.div;
    return (
        <Tag variants={item} {...rest}>
            {children}
        </Tag>
    );
}

/** Hairline rule that draws from the left (section headers). */
export function DrawRule({ className, delay = 0.1 }) {
    return (
        <m.span
            aria-hidden
            className={className}
            style={{ originX: 0 }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.2, delay, ease: EASE }}
        />
    );
}

/**
 * Photo reveal: the frame unclips from the bottom while the image settles from a slight zoom.
 * Wrap a `fill` next/image; the wrapper is absolutely positioned to its container.
 */
export function PhotoReveal({ className, children }) {
    return (
        <m.div
            className={className}
            initial={{ clipPath: "inset(12% 0% 0% 0%)", opacity: 0.4 }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.3, ease: EASE }}
        >
            <m.div
                className="absolute inset-0"
                initial={{ scale: 1.08 }}
                whileInView={{ scale: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 1.8, ease: EASE }}
            >
                {children}
            </m.div>
        </m.div>
    );
}

/**
 * Scroll-linked vertical drift (parallax). `range` is [startPx, endPx] across `offset`.
 * Default offset = while the element crosses the viewport. Off with reduced motion.
 */
export function Drift({
    range = [-30, 30],
    offset = ["start end", "end start"],
    className,
    children,
}) {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll({ target: ref, offset });
    const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : range);
    return (
        <m.div ref={ref} className={className} style={{ y }}>
            {children}
        </m.div>
    );
}
