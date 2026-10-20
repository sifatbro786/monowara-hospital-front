"use client";

import { useState } from "react";
import { WhatsAppMark } from "@/components/ui/Icon";
import { whatsappLink, cn } from "@/lib/utils";
import { Field, fieldClass, BD_MOBILE, EMAIL } from "./Fields";

/**
 * Contact form. Static phase: validated hand-off to WhatsApp (works with no backend).
 * B3: POST /api/v1/contact (zod + rate limit + Nodemailer to the hospital inbox).
 */
export function ContactForm({ waNumber, labels }) {
    const f = labels;
    const [v, setV] = useState({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
        website: "",
    });
    const [err, setErr] = useState({});
    const [sent, setSent] = useState(false);
    const set = (k) => (e) => {
        setV((s) => ({ ...s, [k]: e.target.value }));
        if (err[k]) setErr((x) => ({ ...x, [k]: null }));
    };

    function submit(e) {
        e.preventDefault();
        if (v.website) return;
        const x = {};
        if (v.name.trim().length < 2) x.name = f.errName;
        if (!BD_MOBILE.test(v.phone.replace(/[\s-]/g, ""))) x.phone = f.errPhone;
        if (v.email && !EMAIL.test(v.email.trim())) x.email = f.errEmail;
        if (v.message.trim().length < 5) x.message = f.errMessage;
        setErr(x);
        if (Object.keys(x).length) return;
        const text = [
            f.waIntro,
            `${f.name}: ${v.name.trim()}`,
            `${f.phone}: ${v.phone.trim()}`,
            v.email.trim() && `${f.email}: ${v.email.trim()}`,
            v.subject.trim() && `${f.subject}: ${v.subject.trim()}`,
            v.message.trim().slice(0, 800),
        ]
            .filter(Boolean)
            .join("\n");
        window.open(whatsappLink(waNumber, text), "_blank", "noopener");
        setSent(true);
    }

    if (sent)
        return (
            <div role="status" className="rounded-3xl border border-line bg-card p-8">
                <h3 className="text-h3">{f.sentTitle}</h3>
                <p className="mt-3 text-ink-2">{f.sentLead}</p>
                <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="link-underline mt-6 text-sm text-teal-700"
                >
                    {f.again}
                </button>
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
            <Field label={f.subject}>
                <input
                    className={fieldClass}
                    value={v.subject}
                    onChange={set("subject")}
                    maxLength={120}
                />
            </Field>
            <Field label={f.message} error={err.message} className="sm:col-span-2">
                <textarea
                    className={cn(fieldClass, "h-36 resize-y py-3")}
                    value={v.message}
                    onChange={set("message")}
                    maxLength={800}
                    aria-invalid={!!err.message}
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
                    <WhatsAppMark size={18} className="text-wa" />
                    {f.submit}
                </button>
            </div>
        </form>
    );
}
