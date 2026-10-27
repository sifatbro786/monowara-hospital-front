"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin/api";
import { COLLECTIONS, GROUPS } from "@/lib/admin/collections";
import { cn } from "@/lib/utils";
import { useAdminGet, useDebounced, useUrlState } from "../hooks";
import { RequirePermission } from "../session";
import { ABtn, AIcon, Empty, Field, Notice, PageHead, abtn, inputCls } from "../ui";

export function CollectionTabs({ current }) {
    const group = COLLECTIONS[current].group;
    if (!group) return null;
    return (
        <nav className="-mx-1 mt-5 flex gap-1 overflow-x-auto px-1" aria-label="Sections">
            {GROUPS[group].keys.map((k) => (
                <Link
                    key={k}
                    href={COLLECTIONS[k].path}
                    aria-current={current === k ? "page" : undefined}
                    className={cn(
                        "flex h-9 shrink-0 items-center rounded-full px-4 text-[0.88rem] transition-colors",
                        current === k ? "bg-ink text-paper" : "text-ink-2 hover:bg-ink/5",
                    )}
                >
                    {COLLECTIONS[k].title}
                </Link>
            ))}
        </nav>
    );
}

export function CollectionList({ name }) {
    const cfg = COLLECTIONS[name];
    return (
        <RequirePermission perm={cfg.perm}>
            <List name={name} cfg={cfg} />
        </RequirePermission>
    );
}

function Tag({ tone, children }) {
    const tones = {
        good: "bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-700/20",
        muted: "ring-1 ring-inset ring-line text-ink-3",
        warn: "bg-paper-2 text-ink-2",
        bad: "bg-emergency-soft text-emergency-ink",
    };
    return (
        <span
            className={cn(
                "inline-flex h-6 items-center rounded-full px-2 text-[0.72rem] font-semibold whitespace-nowrap",
                tones[tone],
            )}
        >
            {children}
        </span>
    );
}

function List({ name, cfg }) {
    const group = cfg.group ? GROUPS[cfg.group] : null;
    const { get, set } = useUrlState();
    const [search, setSearch] = useState(get("q"));
    const q = useDebounced(search.trim());
    useEffect(() => {
        if (q !== get("q")) set({ q });
    }, [q]); // eslint-disable-line react-hooks/exhaustive-deps -- only the debounced value drives the URL

    const query = useMemo(
        () => ({
            q: get("q") || undefined,
            status: get("status") || undefined,
            ...Object.fromEntries((cfg.filters ?? []).map((f) => [f.key, get(f.key) || undefined])),
            limit: 100,
        }),
        [get, cfg.filters],
    );
    const extra = Object.fromEntries(
        (cfg.filters ?? []).map((f) => [f.key, get(f.key) || undefined]),
    );
    const list = useAdminGet(cfg.api, cfg.noFilters ? undefined : query);
    const raw = list.data ?? list.previous;
    // fixed sets (pages) come back as a plain array
    const data = Array.isArray(raw) ? { items: raw } : raw;
    const filtered = !!(get("q") || get("status") || Object.values(extra).some(Boolean));
    const [orderError, setOrderError] = useState(null);
    const [moving, setMoving] = useState(false);

    async function move(i, d) {
        const items = [...data.items];
        [items[i], items[i + d]] = [items[i + d], items[i]];
        list.mutate((x) => ({ ...x, items }));
        setMoving(true);
        setOrderError(null);
        try {
            await adminFetch(`${cfg.api}/order`, {
                method: "PUT",
                body: { ids: items.map((x) => x._id) },
            });
        } catch (err) {
            setOrderError(err.message);
            list.reload();
        } finally {
            setMoving(false);
        }
    }

    const L = cfg.list;
    return (
        <>
            <PageHead
                eyebrow={group?.eyebrow ?? cfg.eyebrow}
                title={group?.title ?? cfg.title}
                sub={cfg.listHint}
            >
                {cfg.bulkUpload ? (
                    <BulkUpload
                        cfg={cfg}
                        category={get("category")}
                        onDone={list.reload}
                    />
                ) : null}
                {!cfg.noCreate ? (
                    <Link href={`${cfg.path}/new`} className={abtn({ variant: "ink", size: "sm" })}>
                        <AIcon name="plus" /> Add {cfg.noun}
                    </Link>
                ) : null}
            </PageHead>
            <CollectionTabs current={name} />

            {!cfg.noFilters ? (
            <div
                className={cn(
                    "mt-5 grid gap-3",
                    cfg.filters?.length
                        ? "sm:grid-cols-[minmax(0,1fr)_12rem_10rem]"
                        : "sm:grid-cols-[minmax(0,1fr)_10rem]",
                )}
            >
                <Field label="Search" htmlFor="c-q">
                    <div className="relative">
                        <AIcon
                            name="search"
                            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-3"
                        />
                        <input
                            id="c-q"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            maxLength={80}
                            className={cn(inputCls, "pl-9")}
                        />
                    </div>
                </Field>
                {(cfg.filters ?? []).map((f) => (
                    <Field key={f.key} label={f.label} htmlFor={`c-${f.key}`}>
                        <select
                            id={`c-${f.key}`}
                            value={get(f.key)}
                            onChange={(e) => set({ [f.key]: e.target.value })}
                            className={inputCls}
                        >
                            <option value="">All</option>
                            {f.options.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                ))}
                <Field label="On website" htmlFor="c-status">
                    <select
                        id="c-status"
                        value={get("status")}
                        onChange={(e) => set({ status: e.target.value })}
                        className={inputCls}
                    >
                        <option value="">All</option>
                        <option value="active">Shown</option>
                        <option value="hidden">Hidden</option>
                    </select>
                </Field>
            </div>
            ) : null}

            {list.error ? <Notice className="mt-4">{list.error.message}</Notice> : null}
            {orderError ? <Notice className="mt-4">{orderError}</Notice> : null}

            <section
                className={cn(
                    "mt-5 overflow-hidden rounded-xl border border-line bg-card",
                    list.loading && data && "opacity-70",
                )}
                aria-busy={list.loading || moving}
            >
                {data?.items.length ? (
                    <ol>
                        {data.items.map((d, i) => (
                            <li
                                key={d._id}
                                className="flex items-center border-b border-line-soft last:border-0"
                            >
                                <Link
                                    href={`${cfg.path}/${d._id}`}
                                    className={cn(
                                        "grid min-w-0 flex-1 items-center gap-4 px-4 py-3 transition-colors hover:bg-teal-50/60",
                                        L.thumb
                                            ? "grid-cols-[2rem_4.5rem_minmax(0,1fr)] md:grid-cols-[2rem_4.5rem_minmax(0,1fr)_auto]"
                                            : "grid-cols-[2rem_minmax(0,1fr)] md:grid-cols-[2rem_minmax(0,1fr)_auto]",
                                        d.isActive === false && "text-ink-3",
                                    )}
                                >
                                    <span className="text-[0.75rem] text-ink-3 tabular-nums">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    {L.thumb ? (
                                        <span className="aspect-3/2 w-18 overflow-hidden rounded-md bg-paper-2">
                                            {L.thumb(d) ? (
                                                // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                                                <img
                                                    src={L.thumb(d)}
                                                    alt=""
                                                    loading="lazy"
                                                    onError={(e) =>
                                                        (e.currentTarget.style.visibility =
                                                            "hidden")
                                                    }
                                                    className={cn(
                                                        "size-full object-cover",
                                                        d.isActive === false &&
                                                            "opacity-50 grayscale",
                                                    )}
                                                />
                                            ) : null}
                                        </span>
                                    ) : null}
                                    <span className="min-w-0">
                                        <span className="block truncate font-medium text-ink">
                                            {L.title(d) || "Untitled"}
                                        </span>
                                        {L.sub ? (
                                            <span className="block truncate text-[0.84rem] text-ink-3">
                                                {L.sub(d)}
                                            </span>
                                        ) : null}
                                    </span>
                                    <span
                                        className={cn(
                                            "flex flex-wrap gap-1 md:col-start-auto",
                                            L.thumb ? "col-start-3" : "col-start-2",
                                        )}
                                    >
                                        {(L.badges?.(d) ?? [])
                                            .filter(Boolean)
                                            .map(([tone, text]) => (
                                                <Tag key={text} tone={tone}>
                                                    {text}
                                                </Tag>
                                            ))}
                                    </span>
                                </Link>
                                {cfg.orderable && !filtered ? (
                                    <span className="flex shrink-0 pr-2">
                                        <button
                                            type="button"
                                            disabled={i === 0 || moving}
                                            onClick={() => move(i, -1)}
                                            className="grid size-9 place-items-center rounded-lg text-ink-3 hover:bg-ink/5 hover:text-ink disabled:opacity-30"
                                            aria-label={`Move ${L.title(d)} up`}
                                        >
                                            <AIcon name="next" className="-rotate-90" />
                                        </button>
                                        <button
                                            type="button"
                                            disabled={i === data.items.length - 1 || moving}
                                            onClick={() => move(i, 1)}
                                            className="grid size-9 place-items-center rounded-lg text-ink-3 hover:bg-ink/5 hover:text-ink disabled:opacity-30"
                                            aria-label={`Move ${L.title(d)} down`}
                                        >
                                            <AIcon name="next" className="rotate-90" />
                                        </button>
                                    </span>
                                ) : null}
                            </li>
                        ))}
                    </ol>
                ) : data ? (
                    <Empty title={filtered ? `No ${cfg.noun} matches` : `No ${cfg.noun}s yet`}>
                        {filtered ? "Clear the filters, or add one." : `Add the first ${cfg.noun}.`}
                    </Empty>
                ) : (
                    <div className="h-48 animate-pulse bg-paper-2/40" />
                )}
            </section>
            <p className="mt-3 text-[0.8rem] text-ink-3">
                {cfg.listNote ?? (cfg.orderable
                    ? filtered
                        ? "Clear the search and filters to change the order."
                        : "The website shows them in this order — use the arrows to move one."
                    : "The website follows this order — change it with “Sort order” inside each entry.")}
            </p>
        </>
    );
}

/**
 * Several photos at once (gallery): each file → POST /admin/uploads/<folder> → POST <api> { src, category }.
 * Sequential, so one bad file doesn't stop the rest; captions are added afterwards.
 */
function BulkUpload({ cfg, category, onDone }) {
    const input = useRef(null);
    const [state, setState] = useState(null); // { done, total, failed: [] }

    async function run(files) {
        const list = [...files];
        if (!list.length) return;
        const failed = [];
        setState({ done: 0, total: list.length, failed });
        for (const [i, file] of list.entries()) {
            try {
                const fd = new FormData();
                fd.append("file", file);
                const up = await adminFetch(`/admin/uploads/${cfg.bulkUpload.folder}`, { method: "POST", body: fd });
                await adminFetch(cfg.api, {
                    method: "POST",
                    body: { src: up.src, category: category || cfg.bulkUpload.category },
                });
            } catch (err) {
                failed.push(`${file.name}: ${err.message}`);
            }
            setState({ done: i + 1, total: list.length, failed: [...failed] });
        }
        if (input.current) input.current.value = "";
        onDone();
    }

    const busy = state && state.done < state.total;
    return (
        <>
            <input
                ref={input}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                hidden
                onChange={(e) => run(e.target.files)}
            />
            <ABtn size="sm" busy={busy} onClick={() => input.current?.click()}>
                <AIcon name="image" /> {busy ? `Uploading ${state.done + 1}/${state.total}…` : "Upload photos"}
            </ABtn>
            {state && !busy && state.failed.length ? (
                <Notice className="basis-full">
                    {state.failed.length} of {state.total} failed — {state.failed.join(" · ")}
                </Notice>
            ) : null}
        </>
    );
}
