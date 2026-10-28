"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { FORMS_LIVE, submitForm, currentSource } from "@/lib/forms";
import { Field, FormNotice, fieldClass, BD_MOBILE, EMAIL } from "./Fields";

const MAX_MB = 5;
const OK_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/**
 * Job application with CV upload. The CV is validated in the browser (PDF/DOC/DOCX, ≤5 MB).
 * Live (FORMS_LIVE): multipart POST /api/careers/apply → the API checks the file's real type and size,
 * stores it privately (never web-served) → Admin → Applications + email alert.
 * Demo (no API URL) or API unreachable: email fallback with a prefilled subject.
 */
const CV_CODES = { CV_TYPE: "errCvType", FILE_TOO_LARGE: "errCvSize", CV_REQUIRED: "errCv" };

export function ApplyForm({ jobs, jobSlug, email, labels, common }) {
    const f = labels;
    const c = common;
    const [v, setV] = useState({
        name: "",
        phone: "",
        email: "",
        job: jobSlug || "",
        note: "",
        website: "",
    });
    const [file, setFile] = useState(null);
    const [err, setErr] = useState({});
    const [done, setDone] = useState(null); // null | "email" (demo / offline) | "live"
    const [busy, setBusy] = useState(false);
    const [notice, setNotice] = useState(null);
    const set = (k) => (e) => {
        setV((s) => ({ ...s, [k]: e.target.value }));
        if (err[k]) setErr((x) => ({ ...x, [k]: null }));
        setNotice(null);
    };

    function pick(e) {
        const fl = e.target.files?.[0] || null;
        setFile(fl);
        setErr((x) => ({ ...x, cv: null }));
    }

    async function submit(e) {
        e.preventDefault();
        if (busy || v.website) return;
        const x = {};
        if (v.name.trim().length < 2) x.name = f.errName;
        if (!BD_MOBILE.test(v.phone.replace(/[\s-]/g, ""))) x.phone = f.errPhone;
        if (!EMAIL.test(v.email.trim())) x.email = f.errEmail;
        if (!file) x.cv = f.errCv;
        else if (!OK_TYPES.includes(file.type)) x.cv = f.errCvType;
        else if (file.size > MAX_MB * 1024 * 1024) x.cv = f.errCvSize;
        setErr(x);
        setNotice(null);
        if (Object.keys(x).length) return;
        if (!FORMS_LIVE) return setDone("email");

        const body = new FormData();
        for (const k of ["name", "phone", "email", "job", "note", "website"]) body.append(k, v[k]);
        body.append("source", currentSource() || "");
        body.append("cv", file);
        setBusy(true);
        const r = await submitForm("/careers/apply", body, { timeoutMs: 60000 });
        setBusy(false);
        if (r.ok) return setDone("live");
        if (r.kind === "fields") {
            const msg = { name: f.errName, phone: f.errPhone, email: f.errEmail };
            setErr(Object.fromEntries(Object.keys(r.fields).map((k) => [k, msg[k] || c.errGeneric])));
            if (!Object.keys(r.fields).some((k) => k in msg)) setNotice(c.errGeneric);
        } else if (r.kind === "code" && CV_CODES[r.code]) {
            setErr({ cv: f[CV_CODES[r.code]] });
        } else if (r.kind === "code" && /^UNKNOWN_/.test(r.code)) {
            setNotice(c.errStale);
        } else if (r.kind === "rate") {
            setNotice(c.errRate);
        } else if (r.kind === "code") {
            setNotice(c.errGeneric);
        } else {
            setDone("offline");
        }
    }

    const job = jobs.find((j) => j.slug === v.job);
    const subject = `${f.mailSubject}: ${job?.title || ""} — ${v.name.trim()}`;

    if (done === "live")
        return (
            <div role="status" className="rounded-3xl border border-line bg-card p-8">
                <h3 className="text-h3">{f.liveDoneTitle}</h3>
                <p className="mt-3 text-ink-2">{f.liveDoneLead}</p>
            </div>
        );

    if (done)
        return (
            <div role="status" className="rounded-3xl border border-line bg-card p-8">
                <h3 className="text-h3">{f.doneTitle}</h3>
                <p className="mt-3 text-ink-2">
                    {(done === "offline" ? f.offlineLead : f.doneLead).replace("{email}", email)}
                </p>
                <a
                    href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}
                    className="mt-6 inline-flex h-12 items-center gap-2 rounded-pill bg-ink px-6 font-medium text-paper hover:bg-teal-900"
                >
                    <Icon name="mail" size={18} />
                    {f.emailCv}
                </a>
            </div>
        );

    return (
        <form
            noValidate
            onSubmit={submit}
            className="grid gap-4 rounded-3xl border border-line bg-card p-6 sm:grid-cols-2 sm:p-8"
        >
            <Field label={f.name} error={err.name}>
                <input
                    className={fieldClass}
                    value={v.name}
                    onChange={set("name")}
                    autoComplete="name"
                    maxLength={80}
                    aria-invalid={!!err.name}
                />
            </Field>
            <Field label={f.phone} error={err.phone}>
                <input
                    className={fieldClass}
                    value={v.phone}
                    onChange={set("phone")}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                    maxLength={16}
                    aria-invalid={!!err.phone}
                />
            </Field>
            <Field label={f.email} error={err.email}>
                <input
                    className={fieldClass}
                    value={v.email}
                    onChange={set("email")}
                    type="email"
                    autoComplete="email"
                    maxLength={120}
                    aria-invalid={!!err.email}
                />
            </Field>
            <Field label={f.position}>
                <select
                    className={cn(fieldClass, "appearance-none")}
                    value={v.job}
                    onChange={set("job")}
                >
                    {jobs.map((j) => (
                        <option key={j.slug} value={j.slug}>
                            {j.title}
                        </option>
                    ))}
                </select>
            </Field>
            <Field label={f.cv} error={err.cv} hint={f.cvHint} className="sm:col-span-2">
                <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={pick}
                    aria-invalid={!!err.cv}
                    className="block w-full rounded-xl border border-dashed border-line bg-paper/60 p-3 text-sm text-ink-2 file:mr-4 file:rounded-pill file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:text-paper"
                />
            </Field>
            <Field label={f.note} className="sm:col-span-2">
                <textarea
                    className={cn(fieldClass, "h-28 resize-y py-3")}
                    value={v.note}
                    onChange={set("note")}
                    maxLength={600}
                />
            </Field>
            <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={v.website}
                onChange={set("website")}
                className="hidden"
                aria-hidden
            />
            {notice && <FormNotice className="sm:col-span-2">{notice}</FormNotice>}
            <div className="sm:col-span-2">
                <button
                    type="submit"
                    disabled={busy}
                    aria-busy={busy}
                    className="inline-flex h-12 items-center gap-2 rounded-pill bg-ink px-6 font-medium text-paper hover:bg-teal-900 disabled:cursor-wait disabled:opacity-70"
                >
                    {busy ? c.sending : FORMS_LIVE ? f.liveSubmit : f.submit}
                    {!busy && <Icon name="arrow" size={17} />}
                </button>
            </div>
        </form>
    );
}
