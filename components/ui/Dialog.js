"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

/**
 * Native <dialog> wrapper: focus trap, Esc, inert background and top-layer for free.
 * variant: "center" (modal card) | "right" (side sheet) | "bottom" (bottom sheet on
 * mobile, floating panel from `sm` up — used by the FloatingDock).
 */
export function Dialog({
    open,
    onClose,
    variant = "center",
    labelledBy,
    className,
    closeLabel = "Close",
    children,
}) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (open && !el.open) el.showModal();
        if (!open && el.open) el.close();
    }, [open]);

    const variants = {
        center:
            "m-auto w-[min(34rem,calc(100vw-1.5rem))] max-h-[calc(100dvh-1.5rem)] rounded-[1.5rem] " +
            "open:animate-[mh-pop_.32s_var(--ease-out-expo)]",
        right:
            "ml-auto mr-0 my-0 h-dvh max-h-dvh w-[min(26rem,100vw)] rounded-none " +
            "open:animate-[mh-slide-in_.38s_var(--ease-out-expo)]",
        bottom:
            "mx-auto mb-0 mt-auto w-full max-h-[85dvh] rounded-t-[1.5rem] sm:mb-24 sm:mr-6 sm:ml-auto sm:w-[24rem] sm:rounded-[1.5rem] " +
            "open:animate-[mh-rise_.34s_var(--ease-out-expo)]",
    };

    return (
        <dialog
            ref={ref}
            aria-labelledby={labelledBy}
            onClose={onClose}
            onClick={(e) => {
                // Backdrop click: the event target is the <dialog> itself.
                if (e.target === e.currentTarget) onClose?.();
            }}
            className={cn(
                "overflow-y-auto overscroll-contain bg-card p-0 text-ink shadow-(--shadow-dialog)",
                variants[variant],
                className,
            )}
        >
            <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full text-ink-2 hover:bg-ink/5 hover:text-ink"
                aria-label={closeLabel}
            >
                <Icon name="close" />
            </button>
            {open ? children : null}
        </dialog>
    );
}
