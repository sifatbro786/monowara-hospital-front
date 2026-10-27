"use client";

import Link from "next/link";
import { INBOXES, ROLE_LABELS, actionLabel, areasFor } from "@/lib/admin/config";
import { fmtAgo } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { useBadges } from "./AdminShell";
import { useAdminGet } from "./hooks";
import { useSession } from "./session";
import { AIcon } from "./ui";
import { DailyBars, HBars } from "./charts";

function greeting() {
    const h = Number(
        new Intl.DateTimeFormat("en-GB", {
            timeZone: "Asia/Dhaka",
            hour: "numeric",
            hour12: false,
        }).format(new Date()),
    );
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export function Overview() {
    const { user, permissions, can } = useSession();
    const { counts } = useBadges();
    const inboxes = Object.entries(INBOXES).filter(([, c]) => can(c.perm));
    const recent = useAdminGet("/admin/activity", { limit: 8 }, { enabled: can("activity.read") });
    const areas = areasFor(permissions);
    const stats = useAdminGet("/admin/stats/overview", { days: 30 }).data;

    return (
        <>
            <header className="border-b border-line pb-6">
                <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-teal-700 uppercase">
                    {ROLE_LABELS[user.role]}
                </p>
                <h1 className="mt-1 text-[clamp(1.7rem,1.3rem+1.4vw,2.3rem)] leading-tight font-medium tracking-[-0.02em]">
                    {greeting()}, {user.name.split(" ")[0]}.
                </h1>
            </header>

            {inboxes.length ? (
                <section className="mt-8" aria-labelledby="ov-desk">
                    <h2
                        id="ov-desk"
                        className="text-[0.72rem] font-semibold tracking-[0.16em] text-ink-3 uppercase"
                    >
                        Waiting for the front desk
                    </h2>
                    <ul className="mt-3 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
                        {inboxes.map(([k, c]) => {
                            const n = counts[k];
                            return (
                                <li key={k} className="bg-card">
                                    <Link
                                        href={`${c.path}?status=new`}
                                        className="group flex h-full flex-col justify-between gap-6 p-5 hover:bg-teal-50/50"
                                    >
                                        <span className="flex items-center justify-between text-[0.9rem] text-ink-2">
                                            {c.title}
                                            <AIcon
                                                name="arrow"
                                                className="text-ink-3 transition-transform group-hover:translate-x-0.5"
                                            />
                                        </span>
                                        <span>
                                            <span
                                                className={cn(
                                                    "block text-[2.6rem] leading-none font-medium tabular-nums",
                                                    n ? "text-ink" : "text-ink-3/60",
                                                )}
                                            >
                                                {n ?? "–"}
                                            </span>
                                            <span className="mt-1 block text-[0.82rem] text-ink-3">
                                                new {n === 1 ? c.noun : `${c.noun}s`}
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ) : null}

            {stats?.bookings ? <BookingsInsight b={stats.bookings} days={stats.days} /> : null}
            {stats?.messages || stats?.applications ? (
                <InboxInsight m={stats.messages} a={stats.applications} days={stats.days} />
            ) : null}
            {stats?.doctors ? <DoctorHealth d={stats.doctors} /> : null}
            {stats?.taps ? <TapsInsight t={stats.taps} days={stats.days} /> : null}

            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
                <section aria-labelledby="ov-access">
                    <h2
                        id="ov-access"
                        className="text-[0.72rem] font-semibold tracking-[0.16em] text-ink-3 uppercase"
                    >
                        What you manage
                    </h2>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                        {areas.map((a) => (
                            <li key={a.href}>
                                {a.ready ? (
                                    <Link
                                        href={a.href}
                                        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-teal-700/30 bg-card px-3 text-[0.84rem] text-teal-900 hover:border-teal-700"
                                    >
                                        <AIcon name={a.icon} className="text-teal-700" /> {a.label}
                                    </Link>
                                ) : (
                                    <span
                                        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-dashed border-line px-3 text-[0.84rem] text-ink-3"
                                        title="Coming in a later update"
                                    >
                                        <AIcon name={a.icon} /> {a.label}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-3 text-[0.78rem] text-ink-3">
                        Dashed = arriving in a later update.
                    </p>
                </section>

                {can("activity.read") ? (
                    <section aria-labelledby="ov-recent">
                        <div className="flex items-baseline justify-between">
                            <h2
                                id="ov-recent"
                                className="text-[0.72rem] font-semibold tracking-[0.16em] text-ink-3 uppercase"
                            >
                                Recent activity
                            </h2>
                            <Link
                                href="/admin/activity"
                                className="text-[0.82rem] text-teal-800 hover:underline"
                            >
                                Full log
                            </Link>
                        </div>
                        <ol className="mt-3 border-t border-line">
                            {(recent.data?.items ?? []).map((a) => (
                                <li
                                    key={a._id}
                                    className="flex gap-4 border-b border-line-soft py-2.5 text-[0.9rem]"
                                >
                                    <span className="w-24 shrink-0 text-[0.8rem] text-ink-3">
                                        {fmtAgo(a.at)}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="font-medium">
                                            {a.actor?.name ?? "Someone"}
                                        </span>{" "}
                                        <span className="text-ink-2">
                                            {actionLabel(a.action).toLowerCase()}
                                        </span>
                                        {a.summary ? (
                                            <span className="text-ink-3"> · {a.summary}</span>
                                        ) : null}
                                    </span>
                                </li>
                            ))}
                            {recent.data && !recent.data.items.length ? (
                                <li className="py-3 text-[0.9rem] text-ink-3">Nothing yet.</li>
                            ) : null}
                        </ol>
                    </section>
                ) : null}
            </div>
        </>
    );
}

const STATUS_LABELS = {
    new: "New",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
    no_show: "No-show",
    reviewed: "Reviewed",
    shortlisted: "Shortlisted",
    rejected: "Rejected",
    hired: "Hired",
};

function SectionTitle({ id, children, aside }) {
    return (
        <div className="flex items-baseline justify-between gap-4">
            <h2
                id={id}
                className="text-[0.72rem] font-semibold tracking-[0.16em] text-ink-3 uppercase"
            >
                {children}
            </h2>
            {aside}
        </div>
    );
}

function BookingsInsight({ b, days }) {
    const busiest = b.daily.reduce((m, d) => (d.count > m.count ? d : m), { count: 0 });
    return (
        <section className="mt-10" aria-labelledby="ov-bk">
            <SectionTitle
                id="ov-bk"
                aside={
                    <Link
                        href={INBOXES.bookings.path}
                        className="text-[0.82rem] text-teal-800 hover:underline"
                    >
                        All bookings
                    </Link>
                }
            >
                Online booking requests · last {days} days
            </SectionTitle>
            <div className="mt-3 grid gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
                <div className="bg-card p-5">
                    <p className="flex items-baseline gap-3">
                        <span className="text-[2.1rem] leading-none font-medium tabular-nums">
                            {b.total}
                        </span>
                        <span className="text-[0.86rem] text-ink-3">
                            requests{busiest.count ? ` · busiest day ${busiest.count}` : ""}
                        </span>
                    </p>
                    <DailyBars data={b.daily} noun="request" className="mt-6" />
                </div>
                <div className="grid gap-px bg-line">
                    <div className="bg-card p-5">
                        <h3 className="mb-3 text-[0.86rem] font-medium">By status</h3>
                        <HBars
                            rows={Object.entries(b.byStatus).map(([k, v]) => ({
                                key: k,
                                label: STATUS_LABELS[k] ?? k,
                                value: v,
                                href: `${INBOXES.bookings.path}?status=${k}`,
                            }))}
                            empty="No requests in this period."
                        />
                    </div>
                    <div className="bg-card p-5">
                        <h3 className="mb-3 text-[0.86rem] font-medium">Most requested doctors</h3>
                        <HBars
                            rows={b.topDoctors.map((d) => ({
                                key: d.doctor,
                                label: d.name ?? "—",
                                value: d.count,
                            }))}
                            empty="No doctor-specific requests yet."
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function InboxInsight({ m, a, days }) {
    return (
        <section
            className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]"
            aria-label="Messages and applications"
        >
            {m ? (
                <div className="bg-card p-5">
                    <SectionTitle>Contact messages · last {days} days</SectionTitle>
                    <p className="mt-3 flex items-baseline gap-3">
                        <span className="text-[1.6rem] leading-none font-medium tabular-nums">
                            {m.total}
                        </span>
                        <span className="text-[0.86rem] text-ink-3">messages</span>
                    </p>
                    <DailyBars data={m.daily} noun="message" height={110} className="mt-5" />
                </div>
            ) : null}
            {a ? (
                <div className="bg-card p-5">
                    <SectionTitle>Job applications · {days} days</SectionTitle>
                    <HBars
                        className="mt-4"
                        rows={Object.entries(a.byStatus).map(([k, v]) => ({
                            key: k,
                            label: STATUS_LABELS[k] ?? k,
                            value: v,
                            href: `${INBOXES.applications.path}?status=${k}`,
                        }))}
                        empty="No applications in this period."
                    />
                </div>
            ) : null}
        </section>
    );
}

/** WhatsApp / call button taps from the site's beacon (no personal data — desk, number, section). */
function TapsInsight({ t, days }) {
    const rows = (list) => list.map((r) => ({ key: r.key, label: r.label, value: r.count }));
    return (
        <section className="mt-10" aria-labelledby="ov-taps">
            <SectionTitle id="ov-taps">WhatsApp & call taps · last {days} days</SectionTitle>
            <div className="mt-3 grid gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
                <div className="bg-card p-5">
                    <p className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                        <span className="flex items-baseline gap-2">
                            <span className="text-[2.1rem] leading-none font-medium tabular-nums">
                                {t.total}
                            </span>
                            <span className="text-[0.86rem] text-ink-3">taps</span>
                        </span>
                        <span className="text-[0.86rem] text-ink-2">
                            <AIcon name="whatsapp" className="mr-1 inline text-teal-700" />
                            {t.whatsapp} WhatsApp
                        </span>
                        <span className="text-[0.86rem] text-ink-2">
                            <AIcon name="phone" className="mr-1 inline text-teal-700" />
                            {t.calls} calls
                        </span>
                    </p>
                    <DailyBars data={t.daily} noun="tap" className="mt-6" />
                    <p className="mt-3 text-[0.78rem] text-ink-3">
                        Counted when a visitor taps a WhatsApp or phone button on the website — the
                        chat or call itself isn&apos;t tracked.
                    </p>
                </div>
                <div className="grid gap-px bg-line">
                    <div className="bg-card p-5">
                        <h3 className="mb-3 text-[0.86rem] font-medium">WhatsApp desks</h3>
                        <HBars rows={rows(t.byDesk)} empty="No WhatsApp taps yet." />
                    </div>
                    <div className="bg-card p-5">
                        <h3 className="mb-3 text-[0.86rem] font-medium">Numbers called</h3>
                        <HBars rows={rows(t.byNumber)} empty="No call taps yet." />
                    </div>
                    <div className="bg-card p-5">
                        <h3 className="mb-3 text-[0.86rem] font-medium">Where on the page</h3>
                        <HBars rows={rows(t.bySection)} empty="—" />
                    </div>
                </div>
            </div>
        </section>
    );
}

function DoctorHealth({ d }) {
    const tiles = [
        ["Shown on website", d.active, "/admin/doctors?status=active", false],
        ["Hidden", d.hidden, "/admin/doctors?status=hidden", false],
        ["On leave today", d.onLeave, "/admin/doctors?quick=onLeave", false],
        ["No photo", d.noPhoto, "/admin/doctors?quick=missing%3Aphoto", true],
        ["No BMDC number", d.noBmdc, "/admin/doctors?quick=missing%3Abmdc", true],
        ["No chamber time", d.noSchedule, "/admin/doctors?quick=missing%3Aschedule", true],
    ];
    return (
        <section className="mt-8" aria-labelledby="ov-doc">
            <SectionTitle
                id="ov-doc"
                aside={
                    <Link
                        href="/admin/doctors"
                        className="text-[0.82rem] text-teal-800 hover:underline"
                    >
                        Doctors
                    </Link>
                }
            >
                Doctor directory
            </SectionTitle>
            <ul className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
                {tiles.map(([label, n, href, todo]) => (
                    <li key={label} className="bg-card">
                        <Link href={href} className="block h-full p-4 hover:bg-teal-50/50">
                            <span
                                className={cn(
                                    "block text-[1.6rem] leading-none font-medium tabular-nums",
                                    todo && n ? "text-emergency-ink" : !n && "text-ink-3/60",
                                )}
                            >
                                {n}
                            </span>
                            <span className="mt-1.5 block text-[0.8rem] text-ink-3">{label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            {d.noBmdc ? (
                <p className="mt-2 text-[0.8rem] text-ink-3">
                    The proposal promises BMDC numbers on every profile — red tiles are the to-do
                    list.
                </p>
            ) : null}
        </section>
    );
}
