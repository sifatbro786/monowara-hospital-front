"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { Field, fieldClass, BD_MOBILE, EMAIL } from "./Fields";

const MAX_MB = 5;
const OK_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/**
 * Job application with CV upload. The CV is validated in the browser (PDF/DOC/DOCX, ≤5 MB).
 * Static phase has no server to receive files, so submit shows the email fallback with a
 * prefilled subject. B3: multipart POST /api/v1/careers/apply → multer (type + size checks
 * again, files stored outside the web root), Nodemailer alert to HR, rate-limited.
 */
export function ApplyForm({ jobs, jobSlug, email, labels }) {
    const f = labels;
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
    const [done, setDone] = useState(false);
    const set = (k) => (e) => {
        setV((s) => ({ ...s, [k]: e.target.value }));
        if (err[k]) setErr((x) => ({ ...x, [k]: null }));
    };

    function pick(e) {
        const fl = e.target.files?.[0] || null;
        setFile(fl);
        setErr((x) => ({ ...x, cv: null }));
    }

    function submit(e) {
        e.preventDefault();
        if (v.website) return;
        const x = {};
        if (v.name.trim().length < 2) x.name = f.errName;
        if (!BD_MOBILE.test(v.phone.replace(/[\s-]/g, ""))) x.phone = f.errPhone;
        if (!EMAIL.test(v.email.trim())) x.email = f.errEmail;
        if (!file) x.cv = f.errCv;
        else if (!OK_TYPES.includes(file.type)) x.cv = f.errCvType;
        else if (file.size > MAX_MB * 1024 * 1024) x.cv = f.errCvSize;
        setErr(x);
        if (Object.keys(x).length) return;
        setDone(true);
    }

    const job = jobs.find((j) => j.slug === v.job);
    const subject = `${f.mailSubject}: ${job?.title || ""} — ${v.name.trim()}`;

    if (done)
        return (
            <div role="status" className="rounded-3xl border border-line bg-card p-8">
                <h3 className="text-h3">{f.doneTitle}</h3>
                <p className="mt-3 text-ink-2">{f.doneLead.replace("{email}", email)}</p>
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
            <div className="sm:col-span-2">
                <button
                    type="submit"
                    className="inline-flex h-12 items-center gap-2 rounded-pill bg-ink px-6 font-medium text-paper hover:bg-teal-900"
                >
                    {f.submit}
                    <Icon name="arrow" size={17} />
                </button>
            </div>
        </form>
    );
}
