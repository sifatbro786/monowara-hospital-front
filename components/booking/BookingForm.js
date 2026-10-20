"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { whatsappLink, cn } from "@/lib/utils";

const BD_MOBILE = /^(?:\+?88)?01[3-9]\d{8}$/;
const todayISO = () =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka" }).format(new Date());

/**
 * Optional appointment request form (settings.bookingMode = "form" | "both").
 * Static phase: on submit it validates, then hands the request to WhatsApp with a filled
 * message (works without a backend). Backend phase (B3): POST /api/v1/appointments with the
 * same fields — the API re-validates (zod) and rate-limits; `website` is a honeypot.
 * `doctors` = [{ slug, name, dept }] (already localised), `departments` = [{ slug, name }].
 */
export function BookingForm({ doctors, departments, waNumber, labels, context = "" }) {
    const f = labels;
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
    const [sent, setSent] = useState(false);
    // "today" is only known in the browser (never during prerender).
    const [minDate, setMinDate] = useState("");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMinDate(todayISO()), []);

    const set = (k) => (e) => {
        const v = e.target.value;
        setValues((s) => ({ ...s, [k]: v, ...(k === "department" ? { doctor: "" } : {}) }));
        if (errors[k]) setErrors((x) => ({ ...x, [k]: null }));
    };
    const list = values.department ? doctors.filter((d) => d.dept === values.department) : doctors;

    function submit(e) {
        e.preventDefault();
        if (values.website) return; // bot
        const err = {};
        if (values.name.trim().length < 2) err.name = f.errName;
        if (!BD_MOBILE.test(values.phone.replace(/[\s-]/g, ""))) err.phone = f.errPhone;
        if (values.date && minDate && values.date < minDate) err.date = f.errDate;
        setErrors(err);
        if (Object.keys(err).length) return;

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
        window.open(whatsappLink(waNumber, lines.join("\n")), "_blank", "noopener");
        setSent(true);
    }

    const field =
        "h-12 w-full rounded-xl border border-line bg-paper/60 px-4 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-teal-600 focus:bg-card aria-invalid:border-emergency";

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
            <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                <button
                    type="submit"
                    className="inline-flex h-12 items-center gap-2 rounded-pill bg-ink px-6 font-medium text-paper hover:bg-teal-900"
                >
                    <WhatsAppMark size={18} className="text-wa" />
                    {f.submit}
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
