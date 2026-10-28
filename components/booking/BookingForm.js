"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { whatsappLink, cn } from "@/lib/utils";
import { FORMS_LIVE, submitForm, currentSource } from "@/lib/forms";
import { FormNotice } from "@/components/forms/Fields";

const BD_MOBILE = /^(?:\+?88)?01[3-9]\d{8}$/;
const todayISO = () =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" }).format(new Date());

/**
 * Optional appointment request form (settings.bookingMode = "form" | "both").
 * Live (FORMS_LIVE): POST /api/appointments → Admin → Booking requests + email alert. The API re-checks
 * everything (chamber day, leave, duplicates); its codes are shown in the visitor's language.
 * API unreachable → the same request can go out on WhatsApp instead (one tap).
 * Demo (no API URL): validated hand-off to WhatsApp, as before. `website` is a honeypot.
 * `doctors` = [{ slug, name, dept }] (already localised), `departments` = [{ slug, name }].
 */
const DATE_CODES = new Set(["DATE_PAST", "DATE_TOO_FAR", "NO_CHAMBER", "DOCTOR_ON_LEAVE"]);

export function BookingForm({ doctors, departments, waNumber, labels, common, context = "" }) {
    const f = labels;
    const c = common;
    const preDoctor = doctors.find((d) => d.name === context)?.slug || "";
    const [values, setValues] = useState({
        name: "",
        phone: "",
        department: preDoctor ? doctors.find((d) => d.slug === preDoctor).dept : "",
        doctor: preDoctor,
        date: "",
        note: preDoctor ? "" : context,
        website: "",
    });
    const [errors, setErrors] = useState({});
    const [sent, setSent] = useState(null); // null | "wa" | "live"
    const [busy, setBusy] = useState(false);
    const [notice, setNotice] = useState(null); // form-level message
    const [offline, setOffline] = useState(false);
    // "today" is only known in the browser (never during prerender).
    const [minDate, setMinDate] = useState("");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMinDate(todayISO()), []);

    const set = (k) => (e) => {
        const v = e.target.value;
        setValues((s) => ({ ...s, [k]: v, ...(k === "department" ? { doctor: "" } : {}) }));
        if (errors[k]) setErrors((x) => ({ ...x, [k]: null }));
        setNotice(null);
    };
    const list = values.department ? doctors.filter((d) => d.dept === values.department) : doctors;

    function waText() {
        const doctor = doctors.find((d) => d.slug === values.doctor)?.name;
        const dept = departments.find((d) => d.slug === values.department)?.name;
        const lines = [
            f.waIntro,
            `${f.name}: ${values.name.trim()}`,
            `${f.phone}: ${values.phone.trim()}`,
            dept && `${f.department}: ${dept}`,
            doctor && `${f.doctor}: ${doctor}`,
            values.date && `${f.date}: ${values.date}`,
            values.note.trim() && `${f.note}: ${values.note.trim().slice(0, 300)}`,
        ].filter(Boolean);
        return lines.join("\n");
    }

    async function submit(e) {
        e.preventDefault();
        if (busy) return;
        if (values.website) return; // bot
        const err = {};
        if (values.name.trim().length < 2) err.name = f.errName;
        if (!BD_MOBILE.test(values.phone.replace(/[\s-]/g, ""))) err.phone = f.errPhone;
        if (values.date && minDate && values.date < minDate) err.date = f.errDate;
        setErrors(err);
        setNotice(null);
        if (Object.keys(err).length) return;

        if (!FORMS_LIVE) {
            window.open(whatsappLink(waNumber, waText()), "_blank", "noopener");
            setSent("wa");
            return;
        }
        setBusy(true);
        const r = await submitForm("/appointments", {
            name: values.name,
            phone: values.phone,
            department: values.department,
            doctor: values.doctor,
            date: values.date,
            note: values.note,
            website: values.website,
            source: currentSource(),
        });
        setBusy(false);
        setOffline(false);
        if (r.ok) return setSent("live");
        if (r.kind === "fields") {
            const msg = { name: f.errName, phone: f.errPhone, date: f.errDate };
            setErrors(Object.fromEntries(Object.keys(r.fields).map((k) => [k, msg[k] || c.errGeneric])));
            if (!Object.keys(r.fields).some((k) => k in msg)) setNotice(c.errGeneric);
        } else if (r.kind === "code" && DATE_CODES.has(r.code)) {
            setErrors({ date: r.code === "DATE_PAST" ? f.errDate : c.codes[r.code] });
        } else if (r.kind === "code" && /^UNKNOWN_/.test(r.code)) {
            setNotice(c.errStale);
        } else if (r.kind === "code" && c.codes[r.code]) {
            setNotice(c.codes[r.code]);
        } else if (r.kind === "rate") {
            setNotice(c.errRate);
        } else {
            setNotice(c.errOffline);
            setOffline(true);
        }
    }

    const field =
        "h-12 w-full rounded-xl border border-line bg-paper/60 px-4 text-[0.95rem] text-ink outline-none transition-[border-color,background-color,box-shadow] placeholder:text-ink-3 focus:border-teal-600 focus:ring-3 focus:ring-teal-500/25 focus:bg-card aria-invalid:border-emergency";

    if (sent)
        return (
            <div role="status" className="rounded-3xl border border-line bg-card p-8">
                <h3 className="text-h3">{sent === "live" ? f.liveSentTitle : f.sentTitle}</h3>
                <p className="mt-3 text-ink-2">
                    {sent === "live"
                        ? f.liveSentLead.replace("{phone}", values.phone.trim())
                        : f.sentLead}
                </p>
                <button
                    type="button"
                    onClick={() => {
                        setSent(null);
                        setValues((v) => ({ ...v, date: "", note: "" }));
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
            <Field label={f.name} error={errors.name}>
                <input
                    className={field}
                    value={values.name}
                    onChange={set("name")}
                    autoComplete="name"
                    maxLength={80}
                    required
                    aria-invalid={!!errors.name}
                />
            </Field>
            <Field label={f.phone} error={errors.phone}>
                <input
                    className={field}
                    value={values.phone}
                    onChange={set("phone")}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                    maxLength={16}
                    required
                    aria-invalid={!!errors.phone}
                />
            </Field>
            <Field label={f.department}>
                <select
                    className={cn(field, "appearance-none")}
                    value={values.department}
                    onChange={set("department")}
                >
                    <option value="">{f.anyDepartment}</option>
                    {departments.map((d) => (
                        <option key={d.slug} value={d.slug}>
                            {d.name}
                        </option>
                    ))}
                </select>
            </Field>
            <Field label={f.doctor}>
                <select
                    className={cn(field, "appearance-none")}
                    value={values.doctor}
                    onChange={set("doctor")}
                >
                    <option value="">{f.anyDoctor}</option>
                    {list.map((d) => (
                        <option key={d.slug} value={d.slug}>
                            {d.name}
                        </option>
                    ))}
                </select>
            </Field>
            <Field label={f.date} error={errors.date}>
                <input
                    className={field}
                    type="date"
                    min={minDate || undefined}
                    value={values.date}
                    onChange={set("date")}
                    aria-invalid={!!errors.date}
                />
            </Field>
            <Field label={f.note} className="sm:col-span-2">
                <textarea
                    className={cn(field, "h-28 resize-y py-3")}
                    value={values.note}
                    onChange={set("note")}
                    maxLength={300}
                />
            </Field>
            {/* honeypot — hidden from people, filled by bots */}
            <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
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
            <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
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
                <p className="flex items-center gap-1.5 text-xs text-ink-3">
                    <Icon name="clock" size={13} />
                    {f.note2}
                </p>
            </div>
        </form>
    );
}

/** Reads ?for= so a doctor chosen elsewhere is preselected. */
export function BookingFormFromQuery(props) {
    const params = useSearchParams();
    return <BookingForm {...props} context={(params.get("for") || "").slice(0, 120)} />;
}

function Field({ label, error, className, children }) {
    return (
        <label className={cn("grid gap-1.5", className)}>
            <span className="text-xs font-medium text-ink-2">{label}</span>
            {children}
            {error && <span className="text-xs text-emergency-ink">{error}</span>}
        </label>
    );
}
