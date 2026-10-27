"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DAYS, DAY_SHORT } from "@/lib/admin/config";
import { cn } from "@/lib/utils";
import { useAdminGet, useDebounced, useUrlState } from "../hooks";
import { RequirePermission } from "../session";
import { AIcon, Empty, Field, Notice, PageHead, Pager, abtn, inputCls } from "../ui";
import { isOnLeaveToday } from "./doctorForm";

const QUICK = [
    ["featured", "Homepage"],
    ["onLeave", "On leave today"],
    ["missing:photo", "No photo"],
    ["missing:bmdc", "No BMDC"],
    ["missing:schedule", "No chamber time"],
];

export function DoctorsScreen() {
    return (
        <RequirePermission perm="doctors.manage">
            <Doctors />
        </RequirePermission>
    );
}

function Days({ schedule = [], note }) {
    const days = new Set(schedule.map((s) => s.day));
    if (!days.size) return <span className="text-[0.82rem] text-ink-3">{note?.en ? "By appointment" : "No times yet"}</span>;
    return (
        <span className="flex flex-wrap gap-1" aria-label={`Chambers: ${DAYS.filter((d) => days.has(d)).join(", ")}`}>
            {DAYS.map((d) => (
                <span
                    key={d}
                    className={cn(
                        "w-8 rounded py-0.5 text-center text-[0.68rem] font-semibold",
                        days.has(d) ? "bg-teal-50 text-teal-800" : "text-ink-3/40",
                    )}
                    aria-hidden="true"
                >
                    {DAY_SHORT[d]}
                </span>
            ))}
        </span>
    );
}

function Doctors() {
    const { get, set } = useUrlState();
    const opts = useAdminGet("/admin/doctors/options");
    const [search, setSearch] = useState(get("q"));
    const q = useDebounced(search.trim());
    useEffect(() => {
        if (q !== get("q")) set({ q });
    }, [q]); // eslint-disable-line react-hooks/exhaustive-deps -- only the debounced value drives the URL

    const quick = get("quick");
    const query = useMemo(() => {
        const [k, v] = quick.split(":");
        return {
            q: get("q") || undefined,
            department: get("department") || undefined,
            status: get("status") || undefined,
            ...(k === "featured" && { featured: "true" }),
            ...(k === "onLeave" && { onLeave: "true" }),
            ...(k === "missing" && { missing: v }),
            page: Number(get("page")) || 1,
            limit: 50,
        };
    }, [get, quick]);
    const list = useAdminGet("/admin/doctors", query);
    const data = list.data ?? list.previous;
    const departments = opts.data?.departments ?? [];

    return (
        <>
            <PageHead eyebrow="Hospital" title="Doctors" sub={data ? `${data.total} ${data.total === 1 ? "doctor" : "doctors"}` : " "}>
                <Link href="/admin/doctors/new" className={abtn({ variant: "ink", size: "sm" })}>
                    <AIcon name="plus" /> Add doctor
                </Link>
            </PageHead>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_15rem_10rem]">
                <Field label="Search" htmlFor="d-q">
                    <div className="relative">
                        <AIcon name="search" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-3" />
                        <input
                            id="d-q"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Name, degree, BMDC, specialty…"
                            maxLength={80}
                            className={cn(inputCls, "pl-9")}
                        />
                    </div>
                </Field>
                <Field label="Department" htmlFor="d-dept">
                    <select id="d-dept" value={get("department")} onChange={(e) => set({ department: e.target.value })} className={inputCls}>
                        <option value="">All departments</option>
                        {departments.map((d) => (
                            <option key={d._id} value={d._id}>
                                {d.name.en}
                                {d.isActive === false ? " (hidden)" : ""}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="On website" htmlFor="d-status">
                    <select id="d-status" value={get("status")} onChange={(e) => set({ status: e.target.value })} className={inputCls}>
                        <option value="">All</option>
                        <option value="active">Shown</option>
                        <option value="hidden">Hidden</option>
                    </select>
                </Field>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Quick filters">
                {QUICK.map(([value, label]) => (
                    <button
                        key={value}
                        type="button"
                        aria-pressed={quick === value}
                        onClick={() => set({ quick: quick === value ? null : value })}
                        className={cn(
                            "h-8 rounded-full border px-3 text-[0.82rem] transition-colors",
                            quick === value ? "border-ink bg-ink text-paper" : "border-line text-ink-2 hover:border-ink/40",
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {list.error ? <Notice className="mt-4">{list.error.message}</Notice> : null}

            <section className={cn("mt-5 overflow-hidden rounded-xl border border-line bg-card", list.loading && data && "opacity-70")} aria-busy={list.loading}>
                <div className="hidden grid-cols-[3rem_minmax(0,1.6fr)_minmax(0,1fr)_17rem_7rem] gap-4 border-b border-line bg-paper-2/50 px-4 py-2.5 text-[0.72rem] font-semibold tracking-[0.12em] text-ink-3 uppercase lg:grid">
                    <span aria-hidden="true" />
                    <span>Doctor</span>
                    <span>Department</span>
                    <span>Chamber days</span>
                    <span>Status</span>
                </div>
                {data?.items.length ? (
                    <ul>
                        {data.items.map((d) => {
                            const leave = isOnLeaveToday(d.leave);
                            return (
                                <li key={d._id} className="border-b border-line-soft last:border-0">
                                    <Link
                                        href={`/admin/doctors/${d._id}`}
                                        className={cn(
                                            "grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-x-4 gap-y-2 px-4 py-3 text-[0.9rem] transition-colors hover:bg-teal-50/60",
                                            "lg:grid-cols-[3rem_minmax(0,1.6fr)_minmax(0,1fr)_17rem_7rem]",
                                            d.isActive === false && "text-ink-3",
                                        )}
                                    >
                                        <span className="row-span-2 size-12 overflow-hidden rounded-lg bg-paper-2 lg:row-span-1">
                                            {d.photo ? (
                                                // eslint-disable-next-line @next/next/no-img-element -- admin thumbnails: new uploads aren't known to next/image
                                                <img src={d.photo} alt="" width={48} height={48} loading="lazy" onError={(e) => (e.currentTarget.style.visibility = "hidden")} className={cn("size-full object-cover object-top", d.isActive === false && "opacity-50 grayscale")} />
                                            ) : (
                                                <span className="grid size-full place-items-center text-ink-3">
                                                    <AIcon name="stethoscope" />
                                                </span>
                                            )}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block truncate font-medium text-ink">{d.name.en}</span>
                                            <span className="block truncate text-[0.82rem] text-ink-3">{d.designation?.en || d.degrees || "—"}</span>
                                        </span>
                                        <span className="min-w-0 truncate text-[0.86rem] text-ink-2 max-lg:hidden">{d.department?.name?.en ?? "—"}</span>
                                        <span className="max-lg:col-start-2">
                                            <Days schedule={d.schedule} note={d.scheduleNote} />
                                        </span>
                                        <span className="flex flex-wrap gap-1 max-lg:col-start-2">
                                            {d.isActive === false ? <Tag tone="muted">Hidden</Tag> : null}
                                            {leave ? <Tag tone="bad">On leave</Tag> : null}
                                            {d.isFeatured ? <Tag tone="good">Homepage</Tag> : null}
                                            {d.isActive !== false && !leave && !d.isFeatured ? <span className="text-[0.82rem] text-ink-3">Shown</span> : null}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                ) : data ? (
                    <Empty title="No doctors match">Try another filter, or add a doctor.</Empty>
                ) : (
                    <div className="h-48 animate-pulse bg-paper-2/40" />
                )}
                {data ? <Pager page={data.page} limit={data.limit} total={data.total} onPage={(p) => set({ page: p })} /> : null}
            </section>
        </>
    );
}

function Tag({ tone, children }) {
    const tones = {
        good: "bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-700/20",
        bad: "bg-emergency-soft text-emergency-ink",
        muted: "ring-1 ring-inset ring-line text-ink-3",
    };
    return <span className={cn("inline-flex h-6 items-center rounded-full px-2 text-[0.72rem] font-semibold", tones[tone])}>{children}</span>;
}
