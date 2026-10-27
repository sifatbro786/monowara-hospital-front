"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Two small, dependency-free chart forms for the overview (single series each → one hue, no legend;
 * the title names the series). Thin bars with a 2px gap and 4px rounded tops anchored to the
 * baseline, recessive grid, hover tooltip on a full-height hit column, and a visually-hidden table
 * so the numbers are never chart-only.
 */

const dayFmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "short" });
const dayLong = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", weekday: "short", day: "numeric", month: "short" });
const asDate = (ymd) => new Date(`${ymd}T12:00:00+06:00`);

/** Smallest "nice" ceiling ≥ max (1, 2, 5 × 10ⁿ) so the top gridline reads cleanly. */
function niceMax(max) {
    if (max <= 4) return Math.max(1, max);
    const p = 10 ** Math.floor(Math.log10(max));
    for (const m of [1, 2, 2.5, 5, 10]) if (m * p >= max) return m * p;
    return 10 * p;
}

/** Daily counts → vertical bars. data = [{ day: "YYYY-MM-DD", count }], oldest first. */
export function DailyBars({ data, noun = "item", height = 168, className }) {
    const [hover, setHover] = useState(null);
    const tableId = useId();
    const W = 600;
    const H = height;
    const top = 14;
    const bottom = 22;
    const n = data.length;
    const max = niceMax(Math.max(0, ...data.map((d) => d.count)));
    const slot = W / n;
    const gap = 2;
    const bw = Math.max(2, slot - gap);
    const y = (v) => top + (H - top - bottom) * (1 - v / max);
    const base = H - bottom;
    const ticks = [0, Math.floor((n - 1) / 2), n - 1];
    const plural = (c) => `${c} ${c === 1 ? noun : `${noun}s`}`;

    return (
        <figure className={cn("relative", className)}>
            <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-describedby={tableId} preserveAspectRatio="none">
                {/* recessive grid: baseline + top value */}
                <line x1="0" x2={W} y1={base} y2={base} stroke="var(--color-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <line x1="0" x2={W} y1={y(max)} y2={y(max)} stroke="var(--color-line-soft)" strokeWidth="1" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
                {data.map((d, i) => {
                    const x = i * slot + gap / 2;
                    const h = base - y(d.count);
                    const r = Math.min(4, bw / 2, h);
                    return (
                        <g key={d.day}>
                            {d.count > 0 ? (
                                <path
                                    d={`M${x},${base} V${base - h + r} Q${x},${base - h} ${x + r},${base - h} H${x + bw - r} Q${x + bw},${base - h} ${x + bw},${base - h + r} V${base} Z`}
                                    fill={hover === i ? "var(--color-teal-900)" : "var(--color-teal-700)"}
                                />
                            ) : null}
                            {/* hit column bigger than the mark */}
                            <rect
                                x={i * slot}
                                y={0}
                                width={slot}
                                height={H}
                                fill="transparent"
                                onPointerEnter={() => setHover(i)}
                                onPointerLeave={() => setHover((h) => (h === i ? null : h))}
                            />
                        </g>
                    );
                })}
            </svg>
            {/* axis labels in HTML (crisp text, no SVG scaling) */}
            <span className="pointer-events-none absolute top-0 right-0 text-[0.7rem] text-ink-3 tabular-nums">{max}</span>
            <div className="mt-1 flex justify-between text-[0.72rem] text-ink-3" aria-hidden="true">
                {ticks.map((i) => (
                    <span key={i}>{data[i] ? dayFmt.format(asDate(data[i].day)) : ""}</span>
                ))}
            </div>
            {hover !== null && data[hover] ? (
                <div
                    className={cn(
                        "pointer-events-none absolute -top-2 z-10 -translate-y-full rounded-lg bg-ink px-2.5 py-1.5 text-[0.78rem] whitespace-nowrap text-paper shadow-(--shadow-lift)",
                        // keep the tooltip inside the card near the edges
                        hover < n * 0.2 ? "translate-x-[-12px]" : hover > n * 0.8 ? "-translate-x-[calc(100%-12px)]" : "-translate-x-1/2",
                    )}
                    style={{ left: `${((hover + 0.5) / n) * 100}%` }}
                    role="status"
                >
                    <span className="text-teal-200">{dayLong.format(asDate(data[hover].day))}</span> · {plural(data[hover].count)}
                </div>
            ) : null}
            <table id={tableId} className="sr-only">
                <caption>Daily count</caption>
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((d) => (
                        <tr key={d.day}>
                            <td>{d.day}</td>
                            <td>{d.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </figure>
    );
}

/** Ranked horizontal bars with direct labels. rows = [{ key, label, value, href? }] */
export function HBars({ rows, empty = "Nothing yet.", className }) {
    const max = Math.max(1, ...rows.map((r) => r.value));
    if (!rows.length || rows.every((r) => !r.value)) return <p className={cn("text-[0.88rem] text-ink-3", className)}>{empty}</p>;
    return (
        <ul className={cn("space-y-2.5", className)}>
            {rows.map((r) => {
                const inner = (
                    <>
                        <span className="flex items-baseline justify-between gap-3 text-[0.86rem]">
                            <span className="min-w-0 truncate text-ink-2">{r.label}</span>
                            <span className="font-medium text-ink tabular-nums">{r.value}</span>
                        </span>
                        <span className="mt-1 block h-1.5 rounded-full bg-paper-2" aria-hidden="true">
                            <span className="block h-full rounded-full bg-teal-700" style={{ width: `${(r.value / max) * 100}%`, minWidth: r.value ? 4 : 0 }} />
                        </span>
                    </>
                );
                return <li key={r.key}>{r.href ? <Link href={r.href} className="block rounded hover:bg-teal-50/50">{inner}</Link> : inner}</li>;
            })}
        </ul>
    );
}
