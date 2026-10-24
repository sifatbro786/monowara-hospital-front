"use client";

import { useRef } from "react";
import { Icon } from "@/components/ui/Icon";

/**
 * Horizontal scroll-snap rail with prev/next buttons. Content stays server-rendered.
 * overflow-y-hidden: `overflow-x: auto` silently turns overflow-y into `auto`, so a few px of
 * overflow (card rise animation) made the rail scroll vertically with a hidden scrollbar.
 */
export function Rail({ children, prevLabel = "Previous", nextLabel = "Next", label }) {
    const ref = useRef(null);
    const step = (dir) => {
        const el = ref.current;
        if (!el) return;
        const card = el.querySelector("li");
        const w = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
        el.scrollBy({
            left: dir * w,
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        });
    };
    const btn =
        "grid size-11 place-items-center rounded-full border border-line bg-card text-ink transition-colors hover:border-ink/40 disabled:opacity-40";

    return (
        <div>
            <ul
                ref={ref}
                aria-label={label}
                className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden scroll-px-4 px-4 pb-2 scrollbar-none sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
            >
                {children}
            </ul>
            <div className="mt-6 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label={prevLabel}
                    className={btn}
                >
                    <Icon name="arrow" size={18} className="rotate-180" />
                </button>
                <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label={nextLabel}
                    className={btn}
                >
                    <Icon name="arrow" size={18} />
                </button>
            </div>
        </div>
    );
}
