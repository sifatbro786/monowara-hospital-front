"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for the whole page: any element with [data-reveal]
 * ("up" default | "clip") fades in once. Optional style={{"--reveal-delay":"120ms"}}.
 * Mounted once in the root layout; re-scans on route change via MutationObserver.
 * Heavier choreography (if a section ever needs it) lazy-loads GSAP per component.
 */
export function RevealObserver() {
    useEffect(() => {
        if (!("IntersectionObserver" in window)) {
            document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
            return;
        }
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        e.target.classList.add("is-in");
                        io.unobserve(e.target);
                    }
                }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
        );
        const scan = () => document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
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
