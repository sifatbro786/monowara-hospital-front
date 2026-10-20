"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Click-to-load YouTube: only a thumbnail until the visitor presses play, so the
 * homepage never pays for YouTube's ~1MB player up front. Uses youtube-nocookie.
 */
export function LiteYouTube({ id, title, playLabel = "Play video", size = "lg", className }) {
    const [on, setOn] = useState(false);
    return (
        <div
            className={cn(
                "relative aspect-video overflow-hidden rounded-card bg-ink",
                className,
            )}
        >
            {on ? (
                <iframe
                    src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 size-full border-0"
                />
            ) : (
                <button
                    type="button"
                    onClick={() => setOn(true)}
                    className="group absolute inset-0 size-full"
                    aria-label={`${playLabel}: ${title}`}
                >
                    <Image
                        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                        alt=""
                        fill
                        sizes={
                            size === "lg"
                                ? "(min-width: 1024px) 46rem, 100vw"
                                : "(min-width: 1024px) 24rem, 100vw"
                        }
                        className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                    />
                    <span className="absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-transparent" />
                    <span
                        className={cn(
                            "absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-teal-800 shadow-lg transition-transform group-hover:scale-105",
                            size === "lg" ? "size-16" : "size-12",
                        )}
                    >
                        <Icon
                            name="play"
                            size={size === "lg" ? 24 : 18}
                            className="translate-x-0.5"
                        />
                    </span>
                </button>
            )}
        </div>
    );
}
