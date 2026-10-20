"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Gallery with category filter + lightbox (native <dialog>: focus trap, Esc, inert page).
 * Arrow keys / buttons move between photos of the current filter. Items are already
 * localised by the server: [{ _id, src, category, caption }].
 */
export function GalleryGrid({ items, categories, labels }) {
    const [filter, setFilter] = useState("all");
    const [index, setIndex] = useState(-1);
    const ref = useRef(null);
    const shown = filter === "all" ? items : items.filter((x) => x.category === filter);
    const current = shown[index];

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (index >= 0 && !el.open) el.showModal();
        if (index < 0 && el.open) el.close();
    }, [index]);

    const step = (d) => setIndex((i) => (i + d + shown.length) % shown.length);
    const onKey = (e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
    };

    const chip = (key, label) => (
        <li key={key}>
            <button
                type="button"
                aria-pressed={filter === key}
                onClick={() => setFilter(key)}
                className={cn(
                    "inline-flex h-10 items-center rounded-pill border px-4 text-sm",
                    filter === key
                        ? "border-ink bg-ink text-paper"
                        : "border-line bg-card text-ink-2 hover:border-teal-600/50",
                )}
            >
                {label}
            </button>
        </li>
    );

    return (
        <>
            <ul className="flex flex-wrap gap-2">
                {chip("all", labels.all)}
                {Object.entries(categories).map(([k, v]) => chip(k, v))}
            </ul>
            <ul className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
                {shown.map((x, i) => (
                    <li key={x._id} className="mb-4 break-inside-avoid">
                        <button
                            type="button"
                            onClick={() => setIndex(i)}
                            className="group block w-full overflow-hidden rounded-3xl bg-teal-100 text-left"
                        >
                            <Image
                                src={x.src}
                                alt={x.caption}
                                width={800}
                                height={600}
                                sizes="(min-width: 1024px) 26rem, (min-width: 640px) 45vw, 92vw"
                                className="h-auto w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]"
                            />
                        </button>
                        <p className="mt-2 px-1 text-sm text-ink-2">{x.caption}</p>
                    </li>
                ))}
            </ul>

            <dialog
                ref={ref}
                onClose={() => setIndex(-1)}
                onKeyDown={onKey}
                onClick={(e) => e.target === e.currentTarget && setIndex(-1)}
                aria-label={current?.caption}
                className="m-auto h-dvh max-h-dvh w-screen max-w-none bg-transparent p-0 backdrop:bg-ink/90"
            >
                {current && (
                    <div className="flex h-full flex-col items-center justify-center gap-4 p-4 sm:p-10">
                        <div className="relative h-[75dvh] w-full max-w-5xl">
                            <Image
                                src={current.src}
                                alt={current.caption}
                                fill
                                sizes="100vw"
                                className="object-contain"
                            />
                        </div>
                        <p className="text-center text-paper">{current.caption}</p>
                        <div className="flex items-center gap-3">
                            <LightboxButton label={labels.prev} onClick={() => step(-1)} flip />
                            <LightboxButton label={labels.next} onClick={() => step(1)} />
                            <button
                                type="button"
                                onClick={() => setIndex(-1)}
                                className="ml-4 inline-flex h-11 items-center gap-2 rounded-pill bg-paper px-5 text-sm font-medium text-ink"
                            >
                                <Icon name="close" size={16} />
                                {labels.close}
                            </button>
                        </div>
                    </div>
                )}
            </dialog>
        </>
    );
}

function LightboxButton({ label, onClick, flip }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="grid size-11 place-items-center rounded-full border border-paper/30 text-paper hover:bg-paper/10"
        >
            <Icon name="arrow" size={18} className={flip ? "rotate-180" : undefined} />
        </button>
    );
}
