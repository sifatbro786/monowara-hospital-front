"use client";

import { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils/schedule";
import { cn } from "@/lib/utils";

const TZ = "Asia/Dhaka";
const dayKey = (d) =>
    new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: TZ }).format(d).toLowerCase();
const isoDay = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d); // YYYY-MM-DD

/**
 * "On leave until …" / "Today · 5–8pm" badge. Pages are static, so "today" is only known in
 * the browser: renders nothing on the server and on first client render (no hydration
 * mismatch), then fills in after mount using Dhaka time.
 * leave = { from: "YYYY-MM-DD", until: "YYYY-MM-DD", note? } (admin-managed later).
 */
export function DoctorStatus({ schedule = [], leave, labels, lang, className }) {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const now = new Date();
        const today = isoDay(now);
        let next = null;
        if (leave?.until && (!leave.from || leave.from <= today) && today <= leave.until) {
            const date = new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-GB", {
                day: "numeric",
                month: "short",
                timeZone: TZ,
            }).format(new Date(`${leave.until}T12:00:00+06:00`));
            next = { tone: "leave", text: labels.onLeave.replace("{date}", date) };
        } else {
            const slots = schedule.filter((s) => s.day === dayKey(now));
            if (slots.length)
                next = {
                    tone: "today",
                    text: `${labels.today} · ${slots
                        .map((s) => `${formatTime(s.from, lang)}–${formatTime(s.to, lang)}`)
                        .join(", ")}`,
                };
        }
        // Reading the clock must happen after mount; one extra render is the point.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStatus(next);
    }, [schedule, leave, labels, lang]);

    if (!status) return null;
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[0.72rem] font-semibold",
                status.tone === "leave"
                    ? "bg-emergency-soft text-emergency-ink"
                    : "bg-teal-50 text-teal-800",
                className,
            )}
        >
            <span
                className={cn(
                    "size-1.5 rounded-full",
                    status.tone === "leave" ? "bg-emergency" : "bg-teal-500",
                )}
                aria-hidden
            />
            {status.text}
        </span>
    );
}
