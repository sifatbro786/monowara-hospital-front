"use client";

import { useState } from "react";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { whatsappLink, cn } from "@/lib/utils";
import { FORMS_LIVE, submitForm, currentSource } from "@/lib/forms";
import { Field, FormNotice, fieldClass, BD_MOBILE, EMAIL } from "./Fields";

/**
 * Contact form. Live (FORMS_LIVE): POST /api/contact → Admin → Messages + email alert to the hospital.
 * API unreachable → one-tap WhatsApp with the same text. Demo (no API URL): WhatsApp hand-off.
 */
export function ContactForm({ waNumber, labels, common }) {
    const f = labels;
    const c = common;
    const [v, setV] = useState({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
        website: "",
    });
    const [err, setErr] = useState({});
    const [sent, setSent] = useState(null); // null | "wa" | "live"
    const [busy, setBusy] = useState(false);
    const [notice, setNotice] = useState(null);
    const [offline, setOffline] = useState(false);
    const set = (k) => (e) => {
        setV((s) => ({ ...s, [k]: e.target.value }));
        if (err[k]) setErr((x) => ({ ...x, [k]: null }));
        setNotice(null);
    };

    const waText = () =>
        [
            f.waIntro,
            `${f.name}: ${v.name.trim()}`,
            `${f.phone}: ${v.phone.trim()}`,
            v.email.trim() && `${f.email}: ${v.email.trim()}`,
            v.subject.trim() && `${f.subject}: ${v.subject.trim()}`,
            v.message.trim().slice(0, 800),
        ]
            .filter(Boolean)
            .join("\n");

    async function submit(e) {
        e.preventDefault();
        if (busy || v.website) return;
        const x = {};
        if (v.name.trim().length < 2) x.name = f.errName;
        if (!BD_MOBILE.test(v.phone.replace(/[\s-]/g, ""))) x.phone = f.errPhone;
        if (v.email && !EMAIL.test(v.email.trim())) x.email = f.errEmail;
        if (v.message.trim().length < 5) x.message = f.errMessage;
        setErr(x);
        setNotice(null);
        if (Object.keys(x).length) return;

        if (!FORMS_LIVE) {
            window.open(whatsappLink(waNumber, waText()), "_blank", "noopener");
            setSent("wa");
            return;
        }
        setBusy(true);
        const r = await submitForm("/contact", { ...v, source: currentSource() });
        setBusy(false);
        setOffline(false);
        if (r.ok) return setSent("live");
        if (r.kind === "fields") {
            const msg = { name: f.errName, phone: f.errPhone, email: f.errEmail, message: f.errMessage };
            setErr(Object.fromEntries(Object.keys(r.fields).map((k) => [k, msg[k] || c.errGeneric])));
            if (!Object.keys(r.fields).some((k) => k in msg)) setNotice(c.errGeneric);
        } else if (r.kind === "rate") {
            setNotice(c.errRate);
        } else if (r.kind === "code") {
            setNotice(c.errGeneric);
        } else {
            setNotice(c.errOffline);
            setOffline(true);
        }
    }

    if (sent)
        return (
            <div role="status" className="rounded-3xl border border-line bg-card p-8">
                <h3 className="text-h3">{sent === "live" ? f.liveSentTitle : f.sentTitle}</h3>
                <p className="mt-3 text-ink-2">{sent === "live" ? f.liveSentLead : f.sentLead}</p>
                <button
                    type="button"
                    onClick={() => {
                        setSent(null);
                        setV((s) => ({ ...s, subject: "", message: "" }));
                    }}
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
            {notice && (
                <FormNotice className="sm:col-span-2">
                    {notice}
                    {offline && waNumber && (
                        <a
                            href={whatsappLink(waNumber, waText())}
                            target="_blank"
                            rel="noopener"
                            className="mt-3 inline-flex items-center gap-2 font-medium text-ink underline underline-offset-4"
                        >
                            <WhatsAppMark size={16} className="text-wa" />
                            {f.offlineCta}
                        </a>
                    )}
                </FormNotice>
            )}
            <div className="sm:col-span-2">
                <button
                    type="submit"
                    disabled={busy}
                    aria-busy={busy}
                    className="inline-flex h-12 items-center gap-2 rounded-pill bg-ink px-6 font-medium text-paper hover:bg-teal-900 disabled:cursor-wait disabled:opacity-70"
                >
                    {FORMS_LIVE ? (
                        <>
                            {busy ? c.sending : f.liveSubmit}
                            {!busy && <Icon name="arrow" size={17} />}
                        </>
                    ) : (
                        <>
                            <WhatsAppMark size={18} className="text-wa" />
                            {f.submit}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
