"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { adminDownload } from "@/lib/admin/api";
import { INBOXES } from "@/lib/admin/config";
import { dayEnd, dayStart, fmtAgo, fmtDateTime, fmtDay, fmtHHMM, fmtPhone } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { useBadges } from "./AdminShell";
import { InboxDetail } from "./InboxDetail";
import { useAdminGet, useDebounced, useUrlState } from "./hooks";
import { RequirePermission } from "./session";
import { ABtn, AIcon, Empty, Field, Notice, PageHead, Pager, StatusChip, inputCls } from "./ui";

const LIMIT = 25;

/** Row layout per inbox: grid template (md+) + cells. Phones get a stacked card. */
const ROWS = {
    bookings: {
        cols: "md:grid-cols-[7.5rem_minmax(0,1.1fr)_minmax(0,1.3fr)_9.5rem_3.5rem_7rem]",
        head: ["Received", "Patient", "Doctor / department", "Preferred day", "Serial", "Status"],
        cells: (r) => [
            <Ago key="a" d={r.createdAt} />,
            <Who key="w" name={r.name} sub={fmtPhone(r.phone)} />,
            <Two key="d" a={r.doctorName ?? "Any doctor"} b={r.departmentName} />,
            <Two key="t" a={r.date ? fmtDay(r.date) : "Not given"} b={r.slot ? `${fmtHHMM(r.slot.from)}–${fmtHHMM(r.slot.to)}` : null} />,
            <span key="s" className="tabular-nums text-ink-2">{r.serial ?? "—"}</span>,
        ],
    },
    messages: {
        cols: "md:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,2fr)_7rem]",
        head: ["Received", "From", "Message", "Status"],
        cells: (r) => [
            <Ago key="a" d={r.createdAt} />,
            <Who key="w" name={r.name} sub={fmtPhone(r.phone)} />,
            <Two key="m" a={r.subject || "No subject"} b={r.message} clamp />,
        ],
    },
    applications: {
        cols: "md:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,1.3fr)_7rem]",
        head: ["Received", "Applicant", "Position", "Status"],
        cells: (r) => [
            <Ago key="a" d={r.createdAt} />,
            <Who key="w" name={r.name} sub={fmtPhone(r.phone)} />,
            <Two key="j" a={r.jobTitle ?? "General application"} b={r.cv?.originalName} />,
        ],
    },
};

function Ago({ d }) {
    return (
        <time dateTime={d} title={fmtDateTime(d)} className="text-[0.84rem] text-ink-3">
            {fmtAgo(d)}
        </time>
    );
}
function Who({ name, sub }) {
    return (
        <span className="block min-w-0">
            <span className="block truncate font-medium text-ink">{name}</span>
            <span className="block truncate text-[0.82rem] text-ink-3 tabular-nums">{sub}</span>
        </span>
    );
}
function Two({ a, b, clamp }) {
    return (
        <span className="block min-w-0">
            <span className="block truncate text-ink">{a}</span>
            {b ? <span className={cn("block text-[0.82rem] text-ink-3", clamp ? "line-clamp-1" : "truncate")}>{b}</span> : null}
        </span>
    );
}

export function InboxScreen({ kind }) {
    const cfg = INBOXES[kind];
    return (
        <RequirePermission perm={cfg.perm}>
            <Inbox kind={kind} cfg={cfg} />
        </RequirePermission>
    );
}

function Inbox({ kind, cfg }) {
    const router = useRouter();
    const params = useParams();
    const { get, set, params: sp } = useUrlState();
    const { setBadge, refreshBadges } = useBadges();
    const row = ROWS[kind];

    const status = get("status");
    const page = Number(get("page")) || 1;
    const from = get("from");
    const to = get("to");
    const date = get("date"); // bookings: preferred day
    const openId = params?.id || get("open");

    const [search, setSearch] = useState(get("q"));
    const q = useDebounced(search.trim());
    useEffect(() => {
        if (q !== get("q")) set({ q });
    }, [q]); // eslint-disable-line react-hooks/exhaustive-deps -- only the debounced value drives the URL

    const query = useMemo(
        () => ({
            status: status || undefined,
            q: get("q") || undefined,
            from: dayStart(from),
            to: dayEnd(to),
            ...(kind === "bookings" && date ? { date } : {}),
            page,
            limit: LIMIT,
        }),
        [status, get, from, to, date, page, kind],
    );
    const list = useAdminGet(cfg.api, query);
    const data = list.data ?? list.previous;

    useEffect(() => {
        if (list.data?.counts) setBadge(kind, list.data.counts.new ?? 0);
    }, [list.data, kind, setBadge]);

    const counts = data?.counts ?? {};
    const all = Object.values(counts).reduce((a, b) => a + b, 0);
    const filtered = !!(get("q") || from || to || date);
    const [exporting, setExporting] = useState(false);
    const [exportError, setExportError] = useState(null);

    function open(id) {
        if (params?.id) router.replace(`${cfg.path}/${id}`);
        else set({ open: id, page: page > 1 ? page : undefined });
    }
    function close() {
        if (params?.id) {
            const qs = new URLSearchParams(sp).toString();
            router.replace(qs ? `${cfg.path}?${qs}` : cfg.path, { scroll: false });
        } else set({ open: null, page: page > 1 ? page : undefined });
    }
    function onSaved(doc) {
        list.mutate((d) => (d ? { ...d, items: d.items.map((it) => (it._id === doc._id ? doc : it)) } : d));
        list.reload(); // tab counts
        refreshBadges();
    }

    async function exportXlsx() {
        setExporting(true);
        setExportError(null);
        try {
            const { page: _p, limit: _l, ...filters } = query;
            await adminDownload(`${cfg.api}/export.xlsx`, { query: filters, filename: `${kind}.xlsx` });
        } catch (err) {
            setExportError(err.message);
        } finally {
            setExporting(false);
        }
    }

    return (
        <>
            <PageHead eyebrow="Front desk" title={cfg.title} sub={data ? `${all} total · ${counts.new ?? 0} new` : " "}>
                <ABtn variant="ghost" size="sm" onClick={list.reload} aria-label="Refresh">
                    <AIcon name="refresh" className={list.loading ? "animate-spin" : ""} />
                </ABtn>
                <ABtn variant="outline" size="sm" onClick={exportXlsx} busy={exporting}>
                    {!exporting ? <AIcon name="download" /> : null}
                    Export Excel
                </ABtn>
            </PageHead>

            {/* Status tabs */}
            <div className="-mx-1 mt-5 flex gap-1 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Status">
                {[["", "All", all], ...cfg.statuses.map((s) => [s, cfg.statusLabels[s], counts[s]])].map(([value, label, n]) => {
                    const active = status === value;
                    return (
                        <button
                            key={value || "all"}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => set({ status: value })}
                            className={cn(
                                "flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-[0.85rem] transition-colors",
                                active ? "bg-ink text-paper" : "text-ink-2 hover:bg-ink/5",
                            )}
                        >
                            {label}
                            {n !== undefined ? (
                                <span className={cn("tabular-nums text-[0.78rem]", active ? "text-teal-200" : "text-ink-3")}>{n}</span>
                            ) : null}
                        </button>
                    );
                })}
            </div>

            {/* Filters */}
            <div
                className={cn(
                    "mt-4 grid gap-3 sm:grid-cols-2 lg:items-end",
                    kind === "bookings" ? "lg:grid-cols-[minmax(0,1fr)_10rem_10rem_10rem_auto]" : "lg:grid-cols-[minmax(0,1fr)_10rem_10rem_auto]",
                )}
            >
                <Field label="Search" htmlFor="inbox-q">
                    <div className="relative">
                        <AIcon name="search" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-3" />
                        <input
                            id="inbox-q"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={cfg.searchHint}
                            maxLength={80}
                            className={cn(inputCls, "pl-9")}
                        />
                    </div>
                </Field>
                {kind === "bookings" ? (
                    <Field label="Preferred day" htmlFor="inbox-date">
                        <input id="inbox-date" type="date" value={date} onChange={(e) => set({ date: e.target.value })} className={inputCls} />
                    </Field>
                ) : null}
                <Field label="Received from" htmlFor="inbox-from">
                    <input id="inbox-from" type="date" value={from} max={to || undefined} onChange={(e) => set({ from: e.target.value })} className={inputCls} />
                </Field>
                <Field label="Received to" htmlFor="inbox-to">
                    <input id="inbox-to" type="date" value={to} min={from || undefined} onChange={(e) => set({ to: e.target.value })} className={inputCls} />
                </Field>
                {filtered ? (
                    <ABtn
                        variant="ghost"
                        onClick={() => {
                            setSearch("");
                            set({ q: null, from: null, to: null, date: null });
                        }}
                    >
                        Clear filters
                    </ABtn>
                ) : null}
            </div>

            {exportError ? <Notice className="mt-4">{exportError}</Notice> : null}
            {list.error ? (
                <Notice className="mt-4">
                    {list.error.message}{" "}
                    <button type="button" className="underline" onClick={list.reload}>
                        Retry
                    </button>
                </Notice>
            ) : null}

            {/* List */}
            <section className={cn("mt-5 overflow-hidden rounded-xl border border-line bg-card", list.loading && data && "opacity-70")} aria-busy={list.loading}>
                <div className={cn("hidden gap-4 border-b border-line bg-paper-2/50 px-4 py-2.5 text-[0.72rem] font-semibold tracking-[0.12em] text-ink-3 uppercase md:grid", row.cols)}>
                    {row.head.map((h) => (
                        <span key={h}>{h}</span>
                    ))}
                </div>
                {!data && list.loading ? (
                    <ul aria-hidden="true">
                        {Array.from({ length: 6 }, (_, i) => (
                            <li key={i} className="border-b border-line-soft px-4 py-4 last:border-0">
                                <div className="h-4 w-2/3 animate-pulse rounded bg-paper-2" />
                            </li>
                        ))}
                    </ul>
                ) : data?.items.length ? (
                    <ul>
                        {data.items.map((r) => (
                            <li key={r._id} className="border-b border-line-soft last:border-0">
                                <button
                                    type="button"
                                    onClick={() => open(r._id)}
                                    className={cn(
                                        "grid w-full gap-x-4 gap-y-1 px-4 py-3 text-left text-[0.9rem] transition-colors hover:bg-teal-50/60 md:items-center",
                                        "grid-cols-[minmax(0,1fr)_auto]",
                                        row.cols,
                                        openId === r._id && "bg-teal-50",
                                        r.status === "new" && "md:font-[450]",
                                    )}
                                >
                                    {row.cells(r).map((cell, i) => (
                                        <span key={i} className={cn("min-w-0", i === 0 ? "order-3 col-span-2 md:order-none md:col-span-1" : i === 1 ? "order-1 md:order-none" : "order-4 col-span-2 md:order-none md:col-span-1")}>
                                            {cell}
                                        </span>
                                    ))}
                                    <span className="order-2 justify-self-end md:order-none md:justify-self-start">
                                        <StatusChip status={r.status} label={cfg.statusLabels[r.status]} />
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : data ? (
                    <Empty title={filtered || status ? "Nothing matches these filters" : `No ${cfg.noun}s yet`}>
                        {filtered || status ? "Try another status tab or clear the filters." : cfg.empty}
                    </Empty>
                ) : null}
                {data ? <Pager page={data.page} limit={data.limit} total={data.total} onPage={(p) => set({ page: p })} /> : null}
            </section>

            <InboxDetail kind={kind} cfg={cfg} id={openId || null} onClose={close} onSaved={onSaved} />
        </>
    );
}
