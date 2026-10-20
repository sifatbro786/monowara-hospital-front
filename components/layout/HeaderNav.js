"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/** Sticky header wrapper: hairline + soft shadow once the page scrolls. */
export function HeaderShell({ children }) {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <header
            className={cn(
                "sticky top-0 z-40 border-b bg-paper/92 backdrop-blur-md transition-[border-color,box-shadow] duration-300 supports-[not(backdrop-filter:blur(1px))]:bg-paper",
                scrolled
                    ? "border-line shadow-[0_8px_24px_-18px_rgb(12_42_45/0.35)]"
                    : "border-transparent",
            )}
        >
            {children}
        </header>
    );
}

/** Desktop navigation (lg+): hover-intent + click + keyboard; Esc / outside click closes. */
export function HeaderNav({ items }) {
    const [open, setOpen] = useState(null);
    const navRef = useRef(null);
    const timer = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && setOpen(null);
        const onDown = (e) => !navRef.current?.contains(e.target) && setOpen(null);
        document.addEventListener("keydown", onKey);
        document.addEventListener("pointerdown", onDown);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("pointerdown", onDown);
        };
    }, [open]);

    const enter = (key) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setOpen(key), 90);
    };
    const leave = () => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setOpen(null), 160);
    };
    const close = () => setOpen(null);

    return (
        <nav ref={navRef} aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
                {items.map((item) => {
                    const hasPanel = item.menu || item.mega;
                    const isOpen = open === item.key;
                    if (!hasPanel) {
                        return (
                            <li key={item.key}>
                                <Link
                                    href={item.href}
                                    className="block rounded-pill px-3 py-2 text-[0.92rem] text-ink hover:bg-ink/5"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        );
                    }
                    return (
                        <li
                            key={item.key}
                            className={item.mega ? "static" : "relative"}
                            onPointerEnter={(e) => e.pointerType === "mouse" && enter(item.key)}
                            onPointerLeave={(e) => e.pointerType === "mouse" && leave()}
                        >
                            <button
                                type="button"
                                aria-expanded={isOpen}
                                aria-controls={`nav-${item.key}`}
                                onClick={() => setOpen(isOpen ? null : item.key)}
                                className={cn(
                                    "flex items-center gap-1 rounded-pill px-3 py-2 text-[0.92rem] text-ink hover:bg-ink/5",
                                    isOpen && "bg-ink/5",
                                )}
                            >
                                {item.label}
                                <Icon
                                    name="chevron"
                                    size={15}
                                    className={cn(
                                        "transition-transform duration-200",
                                        isOpen && "rotate-180",
                                    )}
                                />
                            </button>

                            {item.mega ? (
                                <MegaPanel
                                    id={`nav-${item.key}`}
                                    item={item}
                                    open={isOpen}
                                    onNavigate={close}
                                />
                            ) : (
                                <div
                                    id={`nav-${item.key}`}
                                    hidden={!isOpen}
                                    className="absolute left-0 top-full z-50 pt-3"
                                >
                                    <ul className="w-72 overflow-hidden rounded-2xl border border-line bg-card py-2 shadow-(--shadow-lift) animate-[mh-pop_.25s_var(--ease-out-expo)]">
                                        {item.menu.map((m) => (
                                            <li key={m.href}>
                                                <Link
                                                    href={m.href}
                                                    onClick={close}
                                                    className={cn(
                                                        "flex items-center justify-between px-4 py-2.5 text-[0.92rem] hover:bg-paper",
                                                        m.tone === "emergency"
                                                            ? "text-emergency-ink"
                                                            : "text-ink",
                                                    )}
                                                >
                                                    {m.label}
                                                    {m.tone === "emergency" && (
                                                        <span className="size-1.5 rounded-full bg-emergency" />
                                                    )}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

function MegaPanel({ id, item, open, onNavigate }) {
    const [specialties, facilities] = item.mega.columns;
    const featured = specialties.items.filter((i) => i.featured);
    const rest = specialties.items.filter((i) => !i.featured);

    return (
        <div id={id} hidden={!open} className="absolute inset-x-0 top-full z-50 pt-px">
            <div className="border-y border-line bg-card shadow-[0_30px_60px_-30px_rgb(12_42_45/0.35)] animate-[mh-pop_.28s_var(--ease-out-expo)]">
                <div className="mx-auto grid max-w-336 grid-cols-12 gap-10 px-10 py-10">
                    <div className="col-span-4 border-r border-line-soft pr-10">
                        <p className="eyebrow">{specialties.title}</p>
                        <ul className="mt-4 space-y-1">
                            {featured.map((d) => (
                                <li key={d.href}>
                                    <Link
                                        href={d.href}
                                        onClick={onNavigate}
                                        className="group flex items-baseline justify-between gap-4 py-1.5 font-display text-[1.35rem] leading-snug text-ink hover:text-teal-700"
                                    >
                                        {d.label}
                                        <Icon
                                            name="arrow"
                                            size={16}
                                            className="shrink-0 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <Link
                            href={item.mega.all.href}
                            onClick={onNavigate}
                            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-teal-700 link-underline"
                        >
                            {item.mega.all.label}
                            <Icon name="arrow" size={15} />
                        </Link>
                    </div>
                    <ul className="col-span-5 grid grid-cols-2 content-start gap-x-8">
                        {rest.map((d) => (
                            <li key={d.href}>
                                <Link
                                    href={d.href}
                                    onClick={onNavigate}
                                    className="block border-b border-line-soft py-2 text-[0.92rem] text-ink-2 hover:text-ink"
                                >
                                    {d.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="col-span-3">
                        <p className="eyebrow">{facilities.title}</p>
                        <ul className="mt-3">
                            {facilities.items.map((f) => (
                                <li key={f.href}>
                                    <Link
                                        href={f.href}
                                        onClick={onNavigate}
                                        className="flex items-center justify-between gap-3 py-2 text-[0.92rem] text-ink-2 hover:text-ink"
                                    >
                                        {f.label}
                                        {f.badge && (
                                            <span className="rounded-pill bg-teal-50 px-2 py-0.5 text-[0.7rem] font-semibold text-teal-800">
                                                {f.badge}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
