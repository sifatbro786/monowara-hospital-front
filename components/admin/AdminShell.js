"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin/api";
import { INBOXES, ROLE_LABELS, navFor } from "@/lib/admin/config";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/Dialog";
import { useSession } from "./session";
import { AIcon } from "./ui";

const BadgeCtx = createContext({ counts: {}, setBadge() {}, refreshBadges() {} });
/** "new" counts for the sidebar — inbox screens push fresh numbers after every load/update. */
export const useBadges = () => useContext(BadgeCtx);

const POLL_MS = 60_000;

function useInboxBadges(can) {
    const [counts, setCounts] = useState({});
    const kinds = useMemo(() => Object.entries(INBOXES).filter(([, c]) => can(c.perm)).map(([k]) => k), [can]);

    const refreshBadges = useCallback(async () => {
        if (document.visibilityState === "hidden") return;
        const pairs = await Promise.all(
            kinds.map(async (k) => {
                try {
                    const d = await adminFetch(INBOXES[k].api, { query: { status: "new", limit: 1 } });
                    return [k, d.counts?.new ?? 0];
                } catch {
                    return [k, undefined];
                }
            }),
        );
        setCounts((c) => ({ ...c, ...Object.fromEntries(pairs.filter(([, n]) => n !== undefined)) }));
    }, [kinds]);

    useEffect(() => {
        if (!kinds.length) return;
        const first = setTimeout(refreshBadges, 0);
        const t = setInterval(refreshBadges, POLL_MS);
        const onFocus = () => refreshBadges();
        window.addEventListener("focus", onFocus);
        return () => {
            clearTimeout(first);
            clearInterval(t);
            window.removeEventListener("focus", onFocus);
        };
    }, [kinds, refreshBadges]);

    const setBadge = useCallback((k, n) => setCounts((c) => (c[k] === n ? c : { ...c, [k]: n })), []);
    return useMemo(() => ({ counts, setBadge, refreshBadges }), [counts, setBadge, refreshBadges]);
}

function NavList({ groups, counts, pathname, onNavigate }) {
    return (
        <nav aria-label="Dashboard" className="space-y-6">
            {groups.map((g, gi) => (
                <div key={g.title ?? gi}>
                    {g.title ? (
                        <p className="mb-1.5 px-3 text-[0.68rem] font-semibold tracking-[0.16em] text-ink-3 uppercase">{g.title}</p>
                    ) : null}
                    <ul className="space-y-0.5">
                        {g.items.map((item) => {
                            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                            const n = item.badge ? counts[item.badge] : 0;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onNavigate}
                                        aria-current={active ? "page" : undefined}
                                        className={cn(
                                            "flex h-10 items-center gap-3 rounded-lg px-3 text-[0.9rem] transition-colors",
                                            active ? "bg-ink text-paper" : "text-ink-2 hover:bg-ink/5 hover:text-ink",
                                        )}
                                    >
                                        <AIcon name={item.icon} className={active ? "text-teal-200" : "text-ink-3"} />
                                        <span className="truncate">{item.label}</span>
                                        {n ? (
                                            <span
                                                className={cn(
                                                    "ml-auto min-w-6 rounded-full px-1.5 text-center text-[0.72rem] leading-5 font-semibold tabular-nums",
                                                    active ? "bg-teal-400 text-ink" : "bg-teal-800 text-white",
                                                )}
                                                aria-label={`${n} new`}
                                            >
                                                {n > 99 ? "99+" : n}
                                            </span>
                                        ) : null}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
}

function UserCard({ onNavigate }) {
    const { user, signOut } = useSession();
    return (
        <div className="border-t border-line pt-4">
            <div className="px-3">
                <p className="truncate text-[0.9rem] font-medium">{user.name}</p>
                <p className="truncate text-[0.78rem] text-ink-3">{ROLE_LABELS[user.role] ?? user.role}</p>
            </div>
            <div className="mt-3 flex gap-1">
                <Link
                    href="/admin/account"
                    onClick={onNavigate}
                    className="flex h-9 flex-1 items-center gap-2 rounded-lg px-3 text-[0.84rem] text-ink-2 hover:bg-ink/5 hover:text-ink"
                >
                    <AIcon name="key" className="text-ink-3" />
                    My account
                </Link>
                <button
                    type="button"
                    onClick={() => signOut()}
                    className="flex h-9 items-center gap-2 rounded-lg px-3 text-[0.84rem] text-ink-2 hover:bg-ink/5 hover:text-ink"
                >
                    <AIcon name="logout" className="text-ink-3" />
                    Sign out
                </button>
            </div>
        </div>
    );
}

function Brand() {
    return (
        <Link href="/admin" className="flex items-center gap-3 px-3">
            <Image src="/logo.png" alt="Monowara Hospital" width={300} height={64} className="h-8 w-auto" loading="eager" />
            <span className="sr-only">Dashboard home</span>
        </Link>
    );
}

export function AdminShell({ children }) {
    const { permissions, can } = useSession();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const groups = useMemo(() => navFor(permissions), [permissions]);
    const badges = useInboxBadges(can);
    const closeMenu = () => setMenuOpen(false);

    return (
        <BadgeCtx.Provider value={badges}>
            <a
                href="#admin-main"
                className="sr-only z-60 rounded-lg bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
                Skip to content
            </a>
            <div className="min-h-dvh lg:grid lg:grid-cols-[15.5rem_minmax(0,1fr)]">
                {/* Desktop sidebar */}
                <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-paper-2/60 px-3 py-5 lg:flex">
                    <Brand />
                    <div className="mt-7 flex-1 overflow-y-auto">
                        <NavList groups={groups} counts={badges.counts} pathname={pathname} />
                    </div>
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener"
                        className="mb-3 flex items-center gap-2 px-3 text-[0.8rem] text-ink-3 hover:text-ink"
                    >
                        View website <AIcon name="external" />
                    </a>
                    <UserCard />
                </aside>

                {/* Mobile top bar */}
                <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-paper/95 px-4 backdrop-blur lg:hidden">
                    <Brand />
                    <button
                        type="button"
                        onClick={() => setMenuOpen(true)}
                        className="relative grid size-10 place-items-center rounded-lg hover:bg-ink/5"
                        aria-label="Open menu"
                    >
                        <AIcon name="menu" className="size-5" />
                        {Object.values(badges.counts).some(Boolean) ? (
                            <span className="absolute top-2 right-2 size-2 rounded-full bg-teal-600" aria-hidden="true" />
                        ) : null}
                    </button>
                </header>
                <Dialog open={menuOpen} onClose={closeMenu} variant="right" closeLabel="Close menu" className="bg-paper">
                    <div className="flex min-h-full flex-col px-3 pt-16 pb-5">
                        <div className="flex-1">
                            <NavList groups={groups} counts={badges.counts} pathname={pathname} onNavigate={closeMenu} />
                        </div>
                        <UserCard onNavigate={closeMenu} />
                    </div>
                </Dialog>

                <main id="admin-main" className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
                    <div className="mx-auto max-w-[76rem]">{children}</div>
                </main>
            </div>
        </BadgeCtx.Provider>
    );
}
