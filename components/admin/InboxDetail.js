"use client";

import { useEffect, useRef, useState } from "react";
import { adminDownload, adminFetch } from "@/lib/admin/api";
import {
    fmtBytes,
    fmtDateTime,
    fmtDay,
    fmtHHMM,
    fmtPhone,
    telLink,
    waLink,
} from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/Dialog";
import { useAdminGet } from "./hooks";
import { ABtn, AIcon, Facts, Field, Notice, StatusChip, abtn, inputCls } from "./ui";

/** Patient-facing WhatsApp text for a confirmed booking (Bangla; names stay as stored). */
function confirmText(b) {
    const who = b.doctorName ? `${b.doctorName}-এর সাথে ` : "";
    const when = b.date ? `${fmtDay(b.date)} ` : "";
    const time = b.slot ? `(${fmtHHMM(b.slot.from)}–${fmtHHMM(b.slot.to)}) ` : "";
    const serial = b.serial ? ` সিরিয়াল: ${b.serial}।` : "";
    return `মনোয়ারা হসপিটাল: ${who}${when}${time}আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত হয়েছে।${serial}`;
}

function facts(kind, d) {
    const common = [
        ["Received", fmtDateTime(d.createdAt)],
        ["From page", d.source],
        [
            "Handled",
            d.handledAt ? `${d.handledByName ?? "Staff"} · ${fmtDateTime(d.handledAt)}` : null,
        ],
    ];
    if (kind === "bookings")
        return [
            ["Patient", d.name],
            ["Phone", fmtPhone(d.phone)],
            ["Doctor", d.doctorName ?? "Any doctor"],
            ["Department", d.departmentName],
            ["Preferred day", d.date ? fmtDay(d.date) : "Not given"],
            ["Chamber time", d.slot ? `${fmtHHMM(d.slot.from)} – ${fmtHHMM(d.slot.to)}` : null],
            ["Patient note", d.note],
            ...common,
        ];
    if (kind === "messages")
        return [
            ["Name", d.name],
            ["Phone", fmtPhone(d.phone)],
            ["Email", d.email],
            ["Subject", d.subject],
            ...common,
        ];
    return [
        ["Name", d.name],
        ["Phone", fmtPhone(d.phone)],
        ["Email", d.email],
        ["Position", d.jobTitle ?? "General application"],
        ["Cover note", d.note],
        ...common,
    ];
}

export function InboxDetail({ kind, cfg, id, onClose, onSaved }) {
    return (
        <Dialog
            open={!!id}
            onClose={onClose}
            variant="right"
            className="w-[min(34rem,100vw)] bg-paper"
            closeLabel="Close details"
        >
            {id ? <Detail key={id} kind={kind} cfg={cfg} id={id} onSaved={onSaved} /> : null}
        </Dialog>
    );
}

function Detail({ kind, cfg, id, onSaved }) {
    const { data, error, loading, mutate } = useAdminGet(`${cfg.api}/${id}`);
    const [form, setForm] = useState(null); // { status, staffNote, serial } once loaded
    const [busy, setBusy] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saved, setSaved] = useState(false);
    const [cvBusy, setCvBusy] = useState(false);
    const autoRead = useRef(false);

    const doc = data;
    const base = doc
        ? { status: doc.status, staffNote: doc.staffNote ?? "", serial: doc.serial ?? "" }
        : null;
    const f = form ?? base;

    async function patch(body) {
        const updated = await adminFetch(`${cfg.api}/${id}`, { method: "PATCH", body });
        mutate(() => updated);
        setForm(null);
        onSaved(updated);
        return updated;
    }

    // Opening a new message marks it read (one PATCH, guarded against StrictMode's double effect).
    useEffect(() => {
        if (kind !== "messages" || !doc || doc.status !== "new" || autoRead.current) return;
        autoRead.current = true;
        patch({ status: "read" }).catch(() => {});
    }, [kind, doc]); // eslint-disable-line react-hooks/exhaustive-deps -- fire once per opened message

    if (error) {
        return (
            <div className="p-6 pt-16">
                <Notice>
                    {error.status === 404 ? `This ${cfg.noun} no longer exists.` : error.message}
                </Notice>
            </div>
        );
    }
    if (!doc || !f) {
        return (
            <div className="space-y-3 p-6 pt-16" aria-busy={loading}>
                {Array.from({ length: 6 }, (_, i) => (
                    <div
                        key={i}
                        className="h-4 animate-pulse rounded bg-paper-2"
                        style={{ width: `${80 - i * 8}%` }}
                    />
                ))}
            </div>
        );
    }

    const changed = {};
    if (f.status !== doc.status) changed.status = f.status;
    if ((f.staffNote.trim() || null) !== (doc.staffNote ?? null))
        changed.staffNote = f.staffNote.trim() || null;
    if (kind === "bookings") {
        const s = f.serial === "" ? null : Number(f.serial);
        if (s !== (doc.serial ?? null)) changed.serial = s;
    }
    const serialBad =
        kind === "bookings" &&
        f.serial !== "" &&
        !(Number.isInteger(Number(f.serial)) && Number(f.serial) >= 1 && Number(f.serial) <= 999);
    const dirty = Object.keys(changed).length > 0;

    async function save(e) {
        e.preventDefault();
        if (!dirty || serialBad) return;
        setBusy(true);
        setSaveError(null);
        try {
            await patch(changed);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            setSaveError(err.message);
        } finally {
            setBusy(false);
        }
    }

    async function downloadCv() {
        setCvBusy(true);
        try {
            await adminDownload(`${cfg.api}/${id}/cv`, { filename: doc.cv?.originalName || "cv" });
        } catch (err) {
            setSaveError(err.message);
        } finally {
            setCvBusy(false);
        }
    }

    return (
        <div className="flex min-h-full flex-col">
            <header className="border-b border-line px-6 pt-6 pb-5">
                <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-teal-700 uppercase">
                    {cfg.noun}
                </p>
                <h2 className="mt-1 pr-10 text-[1.35rem] leading-snug font-medium">{doc.name}</h2>
                <div className="mt-2 flex items-center gap-2">
                    <StatusChip status={doc.status} label={cfg.statusLabels[doc.status]} />
                    {doc.serial ? (
                        <span className="text-[0.82rem] text-ink-3">Serial {doc.serial}</span>
                    ) : null}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <a href={telLink(doc.phone)} className={abtn({ size: "sm" })}>
                        <AIcon name="phone" /> Call
                    </a>
                    <a
                        href={waLink(
                            doc.phone,
                            kind === "bookings" && doc.status === "confirmed"
                                ? confirmText(doc)
                                : undefined,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={abtn({ size: "sm" })}
                        title={
                            kind === "bookings" && doc.status === "confirmed"
                                ? "Opens WhatsApp with a confirmation message"
                                : undefined
                        }
                    >
                        <AIcon name="whatsapp" className="text-wa" /> WhatsApp
                    </a>
                    {doc.email ? (
                        <a href={`mailto:${doc.email}`} className={abtn({ size: "sm" })}>
                            <AIcon name="mail" /> Email
                        </a>
                    ) : null}
                    {kind === "applications" && doc.cv?.file ? (
                        <ABtn size="sm" variant="ink" onClick={downloadCv} busy={cvBusy}>
                            {!cvBusy ? <AIcon name="download" /> : null}
                            CV {doc.cv.size ? `· ${fmtBytes(doc.cv.size)}` : ""}
                        </ABtn>
                    ) : null}
                </div>
            </header>

            <div className="flex-1 space-y-6 px-6 py-5">
                {kind === "messages" ? (
                    <blockquote className="rounded-lg border border-line-soft bg-card px-4 py-3.5 text-[0.95rem] leading-relaxed whitespace-pre-line">
                        {doc.message}
                    </blockquote>
                ) : null}
                <Facts rows={facts(kind, doc)} />

                <form
                    onSubmit={save}
                    className="space-y-4 rounded-xl border border-line bg-card p-4"
                >
                    <fieldset>
                        <legend className="mb-2 text-[0.8rem] font-semibold text-ink-2">
                            Status
                        </legend>
                        <div className="flex flex-wrap gap-1.5">
                            {cfg.statuses.map((s) => (
                                <label
                                    key={s}
                                    className={cn(
                                        "cursor-pointer rounded-full border px-3 py-1.5 text-[0.84rem] transition-colors has-focus-visible:outline-2 has-focus-visible:outline-teal-600",
                                        f.status === s
                                            ? "border-ink bg-ink text-paper"
                                            : "border-line text-ink-2 hover:border-ink/40",
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="status"
                                        value={s}
                                        checked={f.status === s}
                                        onChange={() => setForm({ ...f, status: s })}
                                        className="sr-only"
                                    />
                                    {cfg.statusLabels[s]}
                                </label>
                            ))}
                        </div>
                    </fieldset>
                    {kind === "bookings" ? (
                        <Field
                            label="Serial number"
                            htmlFor="d-serial"
                            hint="Given by the OPD desk when confirming (1–999)."
                            error={serialBad ? "Use a whole number from 1 to 999." : null}
                        >
                            <input
                                id="d-serial"
                                type="number"
                                inputMode="numeric"
                                min={1}
                                max={999}
                                value={f.serial}
                                onChange={(e) => setForm({ ...f, serial: e.target.value })}
                                className={cn(inputCls, "w-28")}
                                aria-invalid={serialBad || undefined}
                            />
                        </Field>
                    ) : null}
                    <Field
                        label="Staff note"
                        htmlFor="d-note"
                        hint="Only staff see this. Example: “Called, patient will come at 6 pm.”"
                    >
                        <textarea
                            id="d-note"
                            rows={3}
                            maxLength={1000}
                            value={f.staffNote}
                            onChange={(e) => setForm({ ...f, staffNote: e.target.value })}
                            className={inputCls}
                        />
                    </Field>
                    {saveError ? <Notice>{saveError}</Notice> : null}
                    <div className="flex items-center gap-3">
                        <ABtn
                            type="submit"
                            variant="ink"
                            busy={busy}
                            disabled={!dirty || serialBad}
                        >
                            Save
                        </ABtn>
                        {dirty ? (
                            <ABtn variant="ghost" onClick={() => setForm(null)}>
                                Undo changes
                            </ABtn>
                        ) : saved ? (
                            <span className="text-[0.85rem] text-teal-700" role="status">
                                Saved
                            </span>
                        ) : null}
                    </div>
                </form>
            </div>
        </div>
    );
}
