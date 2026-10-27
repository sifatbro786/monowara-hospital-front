"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useAdminGet, useDebounced, useUrlState } from "../hooks";
import { RequirePermission } from "../session";
import { AIcon, Empty, Field, Notice, PageHead, abtn, inputCls } from "../ui";
import { KINDS } from "./kinds";

/** Departments | Facilities | Diagnostics — one screen, three tabs (each its own URL). */
export function ServicesTabs({ current }) {
    return (
        <nav className="-mx-1 mt-5 flex gap-1 overflow-x-auto px-1" aria-label="Sections">
            {Object.entries(KINDS).map(([k, c]) => (
                <Link
                    key={k}
                    href={c.path}
                    aria-current={current === k ? "page" : undefined}
                    className={cn(
                        "flex h-9 shrink-0 items-center rounded-full px-4 text-[0.88rem] transition-colors",
                        current === k ? "bg-ink text-paper" : "text-ink-2 hover:bg-ink/5",
                    )}
                >
                    {c.title}
                </Link>
            ))}
        </nav>
    );
}

export function ServicesScreen({ kind }) {
    return (
        <RequirePermission perm="departments.manage">
            <List kind={kind} />
        </RequirePermission>
    );
}

function List({ kind }) {
    const cfg = KINDS[kind];
    const { get, set } = useUrlState();
    const [search, setSearch] = useState(get("q"));
    const q = useDebounced(search.trim());
    useEffect(() => {
        if (q !== get("q")) set({ q });
    }, [q]); // eslint-disable-line react-hooks/exhaustive-deps -- only the debounced value drives the URL

    const query = useMemo(() => ({ q: get("q") || undefined, status: get("status") || undefined, limit: 100 }), [get]);
    const list = useAdminGet(cfg.api, query);
    const data = list.data ?? list.previous;

    return (
        <>
            <PageHead eyebrow="Hospital" title="Departments & services" sub={cfg.listHint}>
                <Link href={`${cfg.path}/new`} className={abtn({ variant: "ink", size: "sm" })}>
                    <AIcon name="plus" /> Add {cfg.noun}
                </Link>
            </PageHead>
            <ServicesTabs current={kind} />

            <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem]">
                <Field label="Search" htmlFor="s-q">
                    <div className="relative">
                        <AIcon name="search" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-3" />
                        <input id="s-q" type="search" value={search} onChange={(e) => setSearch(e.target.value)} maxLength={80} placeholder="Name, summary…" className={cn(inputCls, "pl-9")} />
                    </div>
                </Field>
                <Field label="On website" htmlFor="s-status">
                    <select id="s-status" value={get("status")} onChange={(e) => set({ status: e.target.value })} className={inputCls}>
                        <option value="">All</option>
                        <option value="active">Shown</option>
                        <option value="hidden">Hidden</option>
                    </select>
                </Field>
            </div>

            {list.error ? <Notice className="mt-4">{list.error.message}</Notice> : null}

            <section className={cn("mt-5 overflow-hidden rounded-xl border border-line bg-card", list.loading && data && "opacity-70")} aria-busy={list.loading}>
                {data?.items.length ? (
                    <ol>
                        {data.items.map((d, i) => (
                            <li key={d._id} className="border-b border-line-soft last:border-0">
                                <Link
                                    href={`${cfg.path}/${d._id}`}
                                    className={cn(
                                        "grid grid-cols-[2rem_4.5rem_minmax(0,1fr)] items-center gap-4 px-4 py-3 transition-colors hover:bg-teal-50/60 md:grid-cols-[2rem_4.5rem_minmax(0,1fr)_auto]",
                                        d.isActive === false && "text-ink-3",
                                    )}
                                >
                                    <span className="text-[0.75rem] text-ink-3 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                                    <span className="aspect-[3/2] w-18 overflow-hidden rounded-md bg-paper-2">
                                        {d.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                                            <img src={d.image} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.visibility = "hidden")} className={cn("size-full object-cover", d.isActive === false && "opacity-50 grayscale")} />
                                        ) : null}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate font-medium text-ink">{d.name.en}</span>
                                        <span className="block truncate text-[0.84rem] text-ink-3">{d.summary?.en || "No summary yet"}</span>
                                    </span>
                                    <span className="col-start-3 flex flex-wrap gap-1 md:col-start-auto">
                                        {d.isActive === false ? <Tag tone="muted">Hidden</Tag> : null}
                                        {d.isFeatured ? <Tag tone="good">Featured</Tag> : null}
                                        {d.is24x7 ? <Tag tone="good">24/7</Tag> : null}
                                        {!d.summary?.bn || !d.description?.bn ? <Tag tone="warn">Bangla missing</Tag> : null}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ol>
                ) : data ? (
                    <Empty title={`No ${cfg.noun} matches`}>Clear the search, or add one.</Empty>
                ) : (
                    <div className="h-48 animate-pulse bg-paper-2/40" />
                )}
            </section>
            <p className="mt-3 text-[0.8rem] text-ink-3">Order on the website follows this list — change it with “Sort order” inside each entry.</p>
        </>
    );
}

function Tag({ tone, children }) {
    const tones = {
        good: "bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-700/20",
        muted: "ring-1 ring-inset ring-line text-ink-3",
        warn: "bg-paper-2 text-ink-2",
    };
    return <span className={cn("inline-flex h-6 items-center rounded-full px-2 text-[0.72rem] font-semibold whitespace-nowrap", tones[tone])}>{children}</span>;
}
