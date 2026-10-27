"use client";

import Link from "next/link";
import { INBOXES, ROLE_LABELS, actionLabel, areasFor } from "@/lib/admin/config";
import { fmtAgo } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { useBadges } from "./AdminShell";
import { useAdminGet } from "./hooks";
import { useSession } from "./session";
import { AIcon } from "./ui";

function greeting() {
    const h = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", hour: "numeric", hour12: false }).format(new Date()));
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export function Overview() {
    const { user, permissions, can } = useSession();
    const { counts } = useBadges();
    const inboxes = Object.entries(INBOXES).filter(([, c]) => can(c.perm));
    const recent = useAdminGet("/admin/activity", { limit: 8 }, { enabled: can("activity.read") });
    const areas = areasFor(permissions);

    return (
        <>
            <header className="border-b border-line pb-6">
                <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-teal-700 uppercase">{ROLE_LABELS[user.role]}</p>
                <h1 className="mt-1 text-[clamp(1.7rem,1.3rem+1.4vw,2.3rem)] leading-tight font-medium tracking-[-0.02em]">
                    {greeting()}, {user.name.split(" ")[0]}.
                </h1>
            </header>

            {inboxes.length ? (
                <section className="mt-8" aria-labelledby="ov-desk">
                    <h2 id="ov-desk" className="text-[0.72rem] font-semibold tracking-[0.16em] text-ink-3 uppercase">
                        Waiting for the front desk
                    </h2>
                    <ul className="mt-3 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
                        {inboxes.map(([k, c]) => {
                            const n = counts[k];
                            return (
                                <li key={k} className="bg-card">
                                    <Link href={`${c.path}?status=new`} className="group flex h-full flex-col justify-between gap-6 p-5 hover:bg-teal-50/50">
                                        <span className="flex items-center justify-between text-[0.9rem] text-ink-2">
                                            {c.title}
                                            <AIcon name="arrow" className="text-ink-3 transition-transform group-hover:translate-x-0.5" />
                                        </span>
                                        <span>
                                            <span className={cn("block text-[2.6rem] leading-none font-medium tabular-nums", n ? "text-ink" : "text-ink-3/60")}>
                                                {n ?? "–"}
                                            </span>
                                            <span className="mt-1 block text-[0.82rem] text-ink-3">new {n === 1 ? c.noun : `${c.noun}s`}</span>
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            ) : null}

            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
                <section aria-labelledby="ov-access">
                    <h2 id="ov-access" className="text-[0.72rem] font-semibold tracking-[0.16em] text-ink-3 uppercase">
                        What you manage
                    </h2>
                    <ol className="mt-3 border-t border-line">
                        {areas.map((a, i) => (
                            <li key={a.href} className="flex items-baseline gap-4 border-b border-line-soft py-2.5 text-[0.92rem]">
                                <span className="w-6 text-[0.75rem] text-ink-3 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                                {a.ready ? (
                                    <Link href={a.href} className="link-underline">
                                        {a.label}
                                    </Link>
                                ) : (
                                    <span className="text-ink-2">{a.label}</span>
                                )}
                                {!a.ready ? <span className="ml-auto text-[0.75rem] text-ink-3">coming next</span> : null}
                            </li>
                        ))}
                    </ol>
                </section>

                {can("activity.read") ? (
                    <section aria-labelledby="ov-recent">
                        <div className="flex items-baseline justify-between">
                            <h2 id="ov-recent" className="text-[0.72rem] font-semibold tracking-[0.16em] text-ink-3 uppercase">
                                Recent activity
                            </h2>
                            <Link href="/admin/activity" className="text-[0.82rem] text-teal-800 hover:underline">
                                Full log
                            </Link>
                        </div>
                        <ol className="mt-3 border-t border-line">
                            {(recent.data?.items ?? []).map((a) => (
                                <li key={a._id} className="flex gap-4 border-b border-line-soft py-2.5 text-[0.9rem]">
                                    <span className="w-24 shrink-0 text-[0.8rem] text-ink-3">{fmtAgo(a.at)}</span>
                                    <span className="min-w-0">
                                        <span className="font-medium">{a.actor?.name ?? "Someone"}</span>{" "}
                                        <span className="text-ink-2">{actionLabel(a.action).toLowerCase()}</span>
                                        {a.summary ? <span className="text-ink-3"> · {a.summary}</span> : null}
                                    </span>
                                </li>
                            ))}
                            {recent.data && !recent.data.items.length ? <li className="py-3 text-[0.9rem] text-ink-3">Nothing yet.</li> : null}
                        </ol>
                    </section>
                ) : null}
            </div>
        </>
    );
}
