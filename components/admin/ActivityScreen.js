"use client";

import { useMemo, useState } from "react";
import { ACTIVITY_GROUPS, ROLE_LABELS, actionLabel, isAlertAction } from "@/lib/admin/config";
import { dayEnd, dayStart, fmtDateTime } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { useAdminGet, useUrlState } from "./hooks";
import { RequirePermission } from "./session";
import { ABtn, AIcon, Empty, Field, Notice, PageHead, Pager, inputCls } from "./ui";

export function ActivityScreen() {
    return (
        <RequirePermission perm="activity.read">
            <Activity />
        </RequirePermission>
    );
}

const show = (v) =>
    v === null || v === undefined || v === ""
        ? "—"
        : typeof v === "object"
          ? JSON.stringify(v)
          : String(v);

function Changes({ changes }) {
    return (
        <table className="mt-2 w-full text-[0.82rem]">
            <thead className="text-left text-ink-3">
                <tr>
                    <th className="py-1 pr-3 font-medium">Field</th>
                    <th className="py-1 pr-3 font-medium">Before</th>
                    <th className="py-1 font-medium">After</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(changes).map(([field, pair]) => {
                    const [before, after] = Array.isArray(pair) ? pair : [undefined, pair];
                    return (
                        <tr key={field} className="border-t border-line-soft align-top">
                            <td className="py-1.5 pr-3 font-mono text-ink-2">{field}</td>
                            <td className="py-1.5 pr-3 wrap-break-word text-ink-3 line-through decoration-ink-3/40">
                                {show(before)}
                            </td>
                            <td className="py-1.5 wrap-break-word">{show(after)}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}

function Activity() {
    const { get, set } = useUrlState();
    const query = useMemo(
        () => ({
            action: get("action") || undefined,
            actor: get("actor") || undefined,
            from: dayStart(get("from")),
            to: dayEnd(get("to")),
            page: Number(get("page")) || 1,
            limit: 50,
        }),
        [get],
    );
    const list = useAdminGet("/admin/activity", query);
    const users = useAdminGet("/admin/users", { limit: 100 });
    const data = list.data ?? list.previous;
    const [openRow, setOpenRow] = useState(null);
    const filtered = !!(get("action") || get("actor") || get("from") || get("to"));

    return (
        <>
            <PageHead
                eyebrow="Administration"
                title="Activity log"
                sub="Who did what, and when. Times are Dhaka time. Entries can't be edited or deleted."
            >
                <ABtn variant="ghost" size="sm" onClick={list.reload} aria-label="Refresh">
                    <AIcon name="refresh" className={list.loading ? "animate-spin" : ""} />
                </ABtn>
            </PageHead>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[13rem_13rem_10rem_10rem_auto] lg:items-end">
                <Field label="Type" htmlFor="a-action">
                    <select
                        id="a-action"
                        value={get("action")}
                        onChange={(e) => set({ action: e.target.value })}
                        className={inputCls}
                    >
                        {ACTIVITY_GROUPS.map((g) => (
                            <option key={g.value} value={g.value}>
                                {g.label}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="Person" htmlFor="a-actor">
                    <select
                        id="a-actor"
                        value={get("actor")}
                        onChange={(e) => set({ actor: e.target.value })}
                        className={inputCls}
                    >
                        <option value="">Everyone</option>
                        {(users.data?.items ?? []).map((u) => (
                            <option key={u._id} value={u._id}>
                                {u.name}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="From" htmlFor="a-from">
                    <input
                        id="a-from"
                        type="date"
                        value={get("from")}
                        onChange={(e) => set({ from: e.target.value })}
                        className={inputCls}
                    />
                </Field>
                <Field label="To" htmlFor="a-to">
                    <input
                        id="a-to"
                        type="date"
                        value={get("to")}
                        onChange={(e) => set({ to: e.target.value })}
                        className={inputCls}
                    />
                </Field>
                {filtered ? (
                    <ABtn
                        variant="ghost"
                        onClick={() => set({ action: null, actor: null, from: null, to: null })}
                    >
                        Clear
                    </ABtn>
                ) : null}
            </div>

            {list.error ? <Notice className="mt-4">{list.error.message}</Notice> : null}

            <section
                className={cn(
                    "mt-5 overflow-hidden rounded-xl border border-line bg-card",
                    list.loading && data && "opacity-70",
                )}
                aria-busy={list.loading}
            >
                {data?.items.length ? (
                    <ol>
                        {data.items.map((a) => {
                            const hasChanges = a.changes && Object.keys(a.changes).length > 0;
                            const expanded = openRow === a._id;
                            return (
                                <li
                                    key={a._id}
                                    className="border-b border-line-soft px-4 py-3 last:border-0"
                                >
                                    <div className="grid gap-x-4 gap-y-1 text-[0.9rem] md:grid-cols-[10.5rem_minmax(0,13rem)_minmax(0,1fr)_auto] md:items-baseline">
                                        <time
                                            dateTime={a.at}
                                            className="text-[0.82rem] text-ink-3 tabular-nums"
                                        >
                                            {fmtDateTime(a.at)}
                                        </time>
                                        <span className="min-w-0 truncate">
                                            {a.actor?.name ?? (
                                                <span className="text-ink-3">
                                                    Unknown (not signed in)
                                                </span>
                                            )}
                                            {a.actor?.role ? (
                                                <span className="ml-1.5 text-[0.78rem] text-ink-3">
                                                    {ROLE_LABELS[a.actor.role] ?? a.actor.role}
                                                </span>
                                            ) : null}
                                        </span>
                                        <span className="min-w-0">
                                            <span
                                                className={cn(
                                                    "font-medium",
                                                    isAlertAction(a.action) && "text-emergency-ink",
                                                )}
                                            >
                                                {actionLabel(a.action)}
                                            </span>
                                            {a.summary ? (
                                                <span className="text-ink-2"> · {a.summary}</span>
                                            ) : null}
                                        </span>
                                        <span className="flex items-center gap-3 text-[0.78rem] text-ink-3">
                                            {a.ip ? (
                                                <span
                                                    className="tabular-nums"
                                                    title={a.userAgent ?? undefined}
                                                >
                                                    {a.ip}
                                                </span>
                                            ) : null}
                                            {hasChanges ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setOpenRow(expanded ? null : a._id)
                                                    }
                                                    aria-expanded={expanded}
                                                    className="text-teal-800 underline-offset-2 hover:underline"
                                                >
                                                    {expanded ? "Hide changes" : "Changes"}
                                                </button>
                                            ) : null}
                                        </span>
                                    </div>
                                    {expanded && hasChanges ? (
                                        <Changes changes={a.changes} />
                                    ) : null}
                                </li>
                            );
                        })}
                    </ol>
                ) : data ? (
                    <Empty title="No activity matches" />
                ) : (
                    <div className="h-40 animate-pulse bg-paper-2/40" />
                )}
                {data ? (
                    <Pager
                        page={data.page}
                        limit={data.limit}
                        total={data.total}
                        onPage={(p) => set({ page: p })}
                    />
                ) : null}
            </section>
        </>
    );
}
