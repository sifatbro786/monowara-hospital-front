"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin/api";
import { fmtDateTime } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { useAdminGet } from "../hooks";
import { RequirePermission } from "../session";
import { ABtn, AIcon, Field, FormSection, LText, Notice, PageHead, Toggle, inputCls } from "../ui";

const L = (v) => ({ en: v?.en ?? "", bn: v?.bn ?? "" });
const tL = (v) => ({ en: v.en.trim(), bn: v.bn.trim() });
const s = (v) => (v ?? "").trim() || null;

function toForm(d) {
    return {
        siteName: L(d.siteName),
        legalName: L(d.legalName),
        hotline: d.hotline ?? "",
        emergency: d.emergency ?? "",
        ambulance: d.ambulance ?? "",
        landline: d.landline ?? "",
        phones: (d.phones ?? []).map((p) => ({ label: L(p.label), number: p.number ?? "", isActive: p.isActive !== false })),
        whatsappNumbers: (d.whatsappNumbers ?? []).map((w) => ({ _id: w._id, label: L(w.label), number: w.number ?? "", isPrimary: !!w.isPrimary, isActive: w.isActive !== false })),
        bookingMode: d.bookingMode ?? "numbers",
        intervalSec: d.heroSlider?.intervalSec ?? 5,
        email: d.email ?? "",
        address: L(d.address),
        hoursEmergency: L(d.hours?.emergency),
        hoursOpd: L(d.hours?.opd),
        dghsLicence: d.dghsLicence ?? "",
        yearsServing: d.yearsServing ?? "",
        facebook: d.socials?.facebook ?? "",
        instagram: d.socials?.instagram ?? "",
        youtube: d.socials?.youtube ?? "",
        linkedin: d.socials?.linkedin ?? "",
        mapEmbed: d.map?.embed ?? "",
        mapDirections: d.map?.directions ?? "",
    };
}

function toPayload(f) {
    return {
        siteName: tL(f.siteName),
        legalName: tL(f.legalName),
        hotline: s(f.hotline),
        emergency: s(f.emergency),
        ambulance: s(f.ambulance),
        landline: s(f.landline),
        phones: f.phones.map((p) => ({ label: tL(p.label), number: s(p.number), isActive: p.isActive })),
        whatsappNumbers: f.whatsappNumbers.map((w) => ({ ...(w._id && { _id: w._id }), label: tL(w.label), number: s(w.number), isPrimary: w.isPrimary, isActive: w.isActive })),
        bookingMode: f.bookingMode,
        heroSlider: { intervalSec: Number(f.intervalSec) },
        email: s(f.email),
        address: tL(f.address),
        hours: { emergency: tL(f.hoursEmergency), opd: tL(f.hoursOpd) },
        dghsLicence: s(f.dghsLicence),
        yearsServing: f.yearsServing === "" ? null : Number(f.yearsServing),
        socials: { facebook: s(f.facebook), instagram: s(f.instagram), youtube: s(f.youtube), linkedin: s(f.linkedin) },
        map: { embed: s(f.mapEmbed), directions: s(f.mapDirections) },
    };
}

const BOOKING = [
    ["numbers", "Phone & WhatsApp only", "Every “Appointment” button shows the hotline and WhatsApp desks. No online form. (Current site behaviour.)"],
    ["form", "Online request form only", "Patients fill a short form; requests land in Front desk → Bookings and an email alert goes out."],
    ["both", "Both", "Numbers first, with the form underneath for people who prefer to write."],
];

export function SettingsScreen() {
    return (
        <RequirePermission perm="settings.manage">
            <Loader />
        </RequirePermission>
    );
}

function Loader() {
    const doc = useAdminGet("/admin/settings");
    if (doc.error) return <Notice className="mt-6">{doc.error.message}</Notice>;
    if (!doc.data) return <div className="h-96 animate-pulse rounded-xl bg-paper-2/50" aria-busy="true" />;
    return <Editor key={doc.data.updatedAt} original={doc.data} onSaved={(d) => doc.mutate(() => ({ ...d, _justSaved: true }))} />;
}

function PhoneInput({ id, label, value, onChange, hint, error }) {
    return (
        <Field label={label} htmlFor={id} hint={hint} error={error}>
            <input id={id} type="tel" value={value} onChange={(e) => onChange(e.target.value)} maxLength={20} placeholder="01XXX-XXXXXX" className={inputCls} />
        </Field>
    );
}

function Editor({ original, onSaved }) {
    const [f, setF] = useState(() => toForm(original));
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const set = (patch) => setF((x) => ({ ...x, ...patch }));

    const payload = useMemo(() => toPayload(f), [f]);
    const base = useMemo(() => toPayload(toForm(original)), [original]);
    const changed = Object.keys(payload).filter((k) => JSON.stringify(payload[k]) !== JSON.stringify(base[k]));
    const dirty = changed.length > 0;

    const activeWa = f.whatsappNumbers.filter((w) => w.isActive);
    const waProblem = activeWa.length && activeWa.filter((w) => w.isPrimary).length !== 1 ? "Choose exactly one primary desk (it opens first from the floating WhatsApp button)." : null;

    const dirtyRef = useRef(dirty);
    useEffect(() => {
        dirtyRef.current = dirty;
    }, [dirty]);
    useEffect(() => {
        const h = (e) => {
            if (dirtyRef.current) e.preventDefault();
        };
        window.addEventListener("beforeunload", h);
        return () => window.removeEventListener("beforeunload", h);
    }, []);

    async function save(e) {
        e.preventDefault();
        if (!dirty || busy || waProblem) return;
        setBusy(true);
        setError(null);
        setErrors({});
        try {
            const updated = await adminFetch("/admin/settings", { method: "PATCH", body: Object.fromEntries(changed.map((k) => [k, payload[k]])) });
            dirtyRef.current = false;
            onSaved(updated);
        } catch (err) {
            setErrors(err.fieldErrors);
            setError(err.code === "VALIDATION" ? "Some fields need attention — see the highlighted ones below." : err.message);
            setBusy(false);
        }
    }

    const wa = f.whatsappNumbers;
    const setWa = (i, patch) => set({ whatsappNumbers: wa.map((w, k) => (k === i ? { ...w, ...patch } : patch.isPrimary ? { ...w, isPrimary: false } : w)) });
    const moveWa = (i, d) => {
        const next = [...wa];
        [next[i], next[i + d]] = [next[i + d], next[i]];
        set({ whatsappNumbers: next });
    };
    const ph = f.phones;
    const setPh = (i, patch) => set({ phones: ph.map((p, k) => (k === i ? { ...p, ...patch } : p)) });

    return (
        <form onSubmit={save} noValidate className="pb-28">
            <PageHead eyebrow="Administration" title="Settings" sub={`Numbers, WhatsApp desks, booking and hospital details used across the whole website. Last saved ${fmtDateTime(original.updatedAt)}.`}>
                <Link href="/admin/notice" className="inline-flex items-center gap-1 text-[0.86rem] text-teal-800 hover:underline">
                    Notice bar <AIcon name="arrow" />
                </Link>
            </PageHead>
            {error ? <Notice className="mt-6">{error}</Notice> : null}

            <div className="mt-8 space-y-9">
                <FormSection n={1} title="Phone numbers" sub="Shown in the top bar, footer, Emergency page and every call button.">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <PhoneInput id="st-hotline" label="Hotline" value={f.hotline} onChange={(hotline) => set({ hotline })} error={errors.hotline} hint="The main number on every page." />
                        <PhoneInput id="st-emergency" label="Emergency" value={f.emergency} onChange={(emergency) => set({ emergency })} error={errors.emergency} />
                        <PhoneInput id="st-ambulance" label="Ambulance" value={f.ambulance} onChange={(ambulance) => set({ ambulance })} error={errors.ambulance} />
                        <PhoneInput id="st-landline" label="Landline (optional)" value={f.landline} onChange={(landline) => set({ landline })} error={errors.landline} />
                    </div>
                    <fieldset>
                        <legend className="mb-1.5 text-[0.8rem] font-semibold text-ink-2">Other desk numbers</legend>
                        <ol className="space-y-2">
                            {ph.map((p, i) => (
                                <li key={i} className="grid items-center gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_11rem_auto_auto]">
                                    <input value={p.label.en} onChange={(e) => setPh(i, { label: { ...p.label, en: e.target.value } })} placeholder="Front desk" aria-label={`Desk ${i + 1} label (English)`} className={inputCls} maxLength={60} />
                                    <input lang="bn" value={p.label.bn} onChange={(e) => setPh(i, { label: { ...p.label, bn: e.target.value } })} placeholder="ফ্রন্ট ডেস্ক" aria-label={`Desk ${i + 1} label (Bangla)`} className={inputCls} maxLength={60} />
                                    <input type="tel" value={p.number} onChange={(e) => setPh(i, { number: e.target.value })} aria-label={`Desk ${i + 1} number`} aria-invalid={errors[`phones.${i}.number`] ? true : undefined} className={inputCls} maxLength={20} />
                                    <label className="flex items-center gap-2 text-[0.84rem]">
                                        <input type="checkbox" checked={p.isActive} onChange={(e) => setPh(i, { isActive: e.target.checked })} className="size-4 accent-teal-700" /> Shown
                                    </label>
                                    <button type="button" onClick={() => set({ phones: ph.filter((_, k) => k !== i) })} className="grid size-9 place-items-center rounded-lg text-ink-3 hover:bg-ink/5" aria-label={`Remove desk ${i + 1}`}>
                                        <AIcon name="close" />
                                    </button>
                                </li>
                            ))}
                        </ol>
                        <button type="button" onClick={() => set({ phones: [...ph, { label: { en: "", bn: "" }, number: "", isActive: true }] })} className="mt-2 inline-flex h-8 items-center gap-1 text-[0.84rem] text-teal-800 hover:underline">
                            <AIcon name="plus" /> Add number
                        </button>
                    </fieldset>
                </FormSection>

                <FormSection n={2} title="WhatsApp desks" sub="The floating WhatsApp button and the Appointment page list these, in this order. The primary desk opens first.">
                    <ol className="space-y-3">
                        {wa.map((w, i) => (
                            <li key={w._id ?? `new-${i}`} className={cn("rounded-xl border p-3", w.isPrimary ? "border-teal-700 bg-teal-50/50" : "border-line bg-card")}>
                                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_11rem]">
                                    <input value={w.label.en} onChange={(e) => setWa(i, { label: { ...w.label, en: e.target.value } })} placeholder="Appointments & serial" aria-label={`WhatsApp desk ${i + 1} label (English)`} aria-invalid={errors[`whatsappNumbers.${i}.label.en`] ? true : undefined} className={inputCls} maxLength={60} />
                                    <input lang="bn" value={w.label.bn} onChange={(e) => setWa(i, { label: { ...w.label, bn: e.target.value } })} placeholder="অ্যাপয়েন্টমেন্ট ও সিরিয়াল" aria-label={`WhatsApp desk ${i + 1} label (Bangla)`} className={inputCls} maxLength={60} />
                                    <input type="tel" value={w.number} onChange={(e) => setWa(i, { number: e.target.value })} aria-label={`WhatsApp desk ${i + 1} number`} aria-invalid={errors[`whatsappNumbers.${i}.number`] ? true : undefined} className={inputCls} maxLength={20} />
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.84rem]">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="wa-primary" checked={w.isPrimary} onChange={() => setWa(i, { isPrimary: true, isActive: true })} className="size-4 accent-teal-700" /> Primary
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="checkbox" checked={w.isActive} onChange={(e) => setWa(i, { isActive: e.target.checked, ...(!e.target.checked && { isPrimary: false }) })} className="size-4 accent-teal-700" /> Shown
                                    </label>
                                    {w.number ? <span className="text-ink-3 tabular-nums">wa.me/880{w.number.replace(/\D/g, "").replace(/^0/, "")}</span> : null}
                                    <span className="ml-auto flex">
                                        <button type="button" disabled={i === 0} onClick={() => moveWa(i, -1)} className="grid size-8 place-items-center rounded-lg text-ink-3 hover:bg-ink/5 disabled:opacity-30" aria-label={`Move desk ${i + 1} up`}>
                                            <AIcon name="next" className="-rotate-90" />
                                        </button>
                                        <button type="button" disabled={i === wa.length - 1} onClick={() => moveWa(i, 1)} className="grid size-8 place-items-center rounded-lg text-ink-3 hover:bg-ink/5 disabled:opacity-30" aria-label={`Move desk ${i + 1} down`}>
                                            <AIcon name="next" className="rotate-90" />
                                        </button>
                                        <button type="button" onClick={() => set({ whatsappNumbers: wa.filter((_, k) => k !== i) })} className="grid size-8 place-items-center rounded-lg text-ink-3 hover:bg-ink/5" aria-label={`Remove desk ${i + 1}`}>
                                            <AIcon name="close" />
                                        </button>
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ol>
                    {waProblem || errors.whatsappNumbers ? <p className="text-[0.84rem] text-emergency-ink">{waProblem || errors.whatsappNumbers}</p> : null}
                    <button type="button" onClick={() => set({ whatsappNumbers: [...wa, { label: { en: "", bn: "" }, number: "", isPrimary: !wa.some((w) => w.isActive), isActive: true }] })} className="inline-flex h-8 items-center gap-1 text-[0.84rem] text-teal-800 hover:underline">
                        <AIcon name="plus" /> Add WhatsApp desk
                    </button>
                </FormSection>

                <FormSection n={3} title="Appointments" sub="What happens when a patient taps “Appointment” anywhere on the site.">
                    <div className="grid gap-2">
                        {BOOKING.map(([value, label, sub]) => (
                            <label key={value} className={cn("flex cursor-pointer gap-3 rounded-xl border p-3.5 transition-colors", f.bookingMode === value ? "border-teal-700 bg-teal-50" : "border-line hover:border-ink/30")}>
                                <input type="radio" name="booking" value={value} checked={f.bookingMode === value} onChange={() => set({ bookingMode: value })} className="mt-1 accent-teal-700" />
                                <span>
                                    <span className="block font-medium">{label}</span>
                                    <span className="block text-[0.84rem] text-ink-3">{sub}</span>
                                </span>
                            </label>
                        ))}
                    </div>
                </FormSection>

                <FormSection n={4} title="Hospital details" sub="Footer, Contact page, Google's hospital listing (structured data).">
                    <LText id="st-name" label="Short name" value={f.siteName} onChange={(siteName) => set({ siteName })} maxLength={80} errors={errors} prefix="siteName" />
                    <LText id="st-legal" label="Legal name" value={f.legalName} onChange={(legalName) => set({ legalName })} maxLength={120} errors={errors} prefix="legalName" />
                    <LText id="st-addr" label="Address" value={f.address} onChange={(address) => set({ address })} maxLength={200} errors={errors} prefix="address" />
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Field label="Email" htmlFor="st-email" error={errors.email}>
                            <input id="st-email" type="email" value={f.email} onChange={(e) => set({ email: e.target.value })} className={inputCls} maxLength={120} />
                        </Field>
                        <Field label="DGHS licence no." htmlFor="st-dghs" error={errors.dghsLicence} hint="Shown in the footer (proposal requirement).">
                            <input id="st-dghs" value={f.dghsLicence} onChange={(e) => set({ dghsLicence: e.target.value })} className={inputCls} maxLength={60} />
                        </Field>
                        <Field label="Years serving" htmlFor="st-years" error={errors.yearsServing}>
                            <input id="st-years" type="number" min={0} max={200} value={f.yearsServing} onChange={(e) => set({ yearsServing: e.target.value })} className={cn(inputCls, "w-28")} />
                        </Field>
                    </div>
                    <LText id="st-hem" label="Emergency hours" value={f.hoursEmergency} onChange={(hoursEmergency) => set({ hoursEmergency })} maxLength={120} errors={errors} prefix="hours.emergency" />
                    <LText id="st-hopd" label="OPD / chamber hours" value={f.hoursOpd} onChange={(hoursOpd) => set({ hoursOpd })} maxLength={120} errors={errors} prefix="hours.opd" />
                </FormSection>

                <FormSection n={5} title="Homepage slider" sub="Seconds each hero slide stays before the next one.">
                    <div className="flex items-center gap-4">
                        <input type="range" min={2} max={15} value={f.intervalSec} onChange={(e) => set({ intervalSec: e.target.value })} aria-label="Seconds per slide" className="w-64 accent-teal-700" />
                        <span className="w-16 text-[0.95rem] font-medium tabular-nums">{f.intervalSec} s</span>
                        <Link href="/admin/hero" className="text-[0.84rem] text-teal-800 hover:underline">
                            Edit slides
                        </Link>
                    </div>
                </FormSection>

                <FormSection n={6} title="Social & map" sub="Full https links. Empty = icon hidden.">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {[
                            ["facebook", "Facebook page"],
                            ["instagram", "Instagram"],
                            ["youtube", "YouTube channel"],
                            ["linkedin", "LinkedIn"],
                        ].map(([k, l]) => (
                            <Field key={k} label={l} htmlFor={`st-${k}`} error={errors[`socials.${k}`]}>
                                <input id={`st-${k}`} type="url" value={f[k]} onChange={(e) => set({ [k]: e.target.value })} placeholder="https://" className={inputCls} spellCheck={false} />
                            </Field>
                        ))}
                    </div>
                    <Field label="Google Maps embed link" htmlFor="st-map" error={errors["map.embed"]} hint="Google Maps → Share → Embed a map → copy only the src=“…” link.">
                        <input id="st-map" type="url" value={f.mapEmbed} onChange={(e) => set({ mapEmbed: e.target.value })} className={inputCls} spellCheck={false} />
                    </Field>
                    <Field label="Directions link" htmlFor="st-dir" error={errors["map.directions"]}>
                        <input id="st-dir" type="url" value={f.mapDirections} onChange={(e) => set({ mapDirections: e.target.value })} className={inputCls} spellCheck={false} />
                    </Field>
                </FormSection>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur lg:left-62">
                <div className="mx-auto flex max-w-304 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
                    <p className="text-[0.85rem] text-ink-3" role="status">
                        {waProblem ? "Pick a primary WhatsApp desk to save." : dirty ? `${changed.length} unsaved ${changed.length === 1 ? "section" : "sections"}` : original._justSaved ? "Saved." : "No changes."}
                    </p>
                    <div className="flex gap-2">
                        {dirty ? (
                            <ABtn variant="ghost" onClick={() => setF(toForm(original))}>
                                Discard
                            </ABtn>
                        ) : null}
                        <ABtn type="submit" variant="ink" busy={busy} disabled={!dirty || !!waProblem}>
                            Save changes
                        </ABtn>
                    </div>
                </div>
            </div>
        </form>
    );
}

/** Notice bar — graphics_design (+ super admin). Separate screen because it's a different role. */
export function NoticeScreen() {
    return (
        <RequirePermission perm="notice.manage">
            <NoticeLoader />
        </RequirePermission>
    );
}

function NoticeLoader() {
    const doc = useAdminGet("/admin/settings");
    if (doc.error) return <Notice className="mt-6">{doc.error.message}</Notice>;
    if (!doc.data) return <div className="h-64 animate-pulse rounded-xl bg-paper-2/50" aria-busy="true" />;
    return <NoticeEditor key={doc.data.updatedAt} original={doc.data.noticeBar ?? {}} justSaved={!!doc.data._justSaved} onSaved={(d) => doc.mutate(() => ({ ...d, _justSaved: true }))} />;
}

function NoticeEditor({ original, onSaved, justSaved }) {
    const [isActive, setActive] = useState(!!original.isActive);
    const [text, setText] = useState(L(original.text));
    const [href, setHref] = useState(original.href ?? "");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const body = { isActive, text: tL(text), href: href.trim() || null };
    const dirty = JSON.stringify(body) !== JSON.stringify({ isActive: !!original.isActive, text: tL(L(original.text)), href: original.href ?? null });

    async function save(e) {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
            const d = await adminFetch("/admin/settings/notice", { method: "PATCH", body });
            onSaved(d);
        } catch (err) {
            setError(Object.values(err.fieldErrors)[0] ?? err.message);
            setBusy(false);
        }
    }

    return (
        <form onSubmit={save} noValidate>
            <PageHead eyebrow="Site content" title="Notice bar" sub="A thin line above the header on every page — holidays, changed hours, a new service." />
            <div className="mt-6 overflow-hidden rounded-xl border border-line">
                <p className="bg-paper-2 px-4 py-1.5 text-[0.7rem] font-semibold tracking-[0.14em] text-ink-3 uppercase">Preview</p>
                {isActive && text.en ? (
                    <div className="flex items-center justify-center gap-2 bg-teal-900 px-4 py-2 text-center text-[0.86rem] text-white">
                        <span>{text.en}</span>
                        {href ? <span className="underline underline-offset-2">Details →</span> : null}
                    </div>
                ) : (
                    <p className="px-4 py-3 text-[0.86rem] text-ink-3">The bar is off — nothing shows above the header.</p>
                )}
            </div>
            <div className="mt-6 max-w-3xl space-y-5">
                <Toggle id="n-on" checked={isActive} onChange={setActive} label="Show the notice bar" />
                <LText id="n-text" label="Message" value={text} onChange={setText} maxLength={160} hint="One short sentence. Visitors can close it." />
                <Field label="Link (optional)" htmlFor="n-href" hint="A page on this site (/patients-visitors) or a full https:// link.">
                    <input id="n-href" value={href} onChange={(e) => setHref(e.target.value)} className={cn(inputCls, "sm:w-96")} spellCheck={false} maxLength={500} />
                </Field>
                {error ? <Notice>{error}</Notice> : null}
                <div className="flex items-center gap-3">
                    <ABtn type="submit" variant="ink" busy={busy} disabled={!dirty}>
                        Save
                    </ABtn>
                    {justSaved && !dirty ? <span className="text-[0.85rem] text-teal-700">Saved.</span> : null}
                </div>
            </div>
        </form>
    );
}

