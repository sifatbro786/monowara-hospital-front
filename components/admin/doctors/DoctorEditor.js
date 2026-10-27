"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin/api";
import { DAYS, DAY_LABELS } from "@/lib/admin/config";
import { fmtDateTime } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/Dialog";
import { useAdminGet } from "../hooks";
import { RequirePermission } from "../session";
import { ABtn, AIcon, Field, FormSection, LText, Notice, Toggle, abtn, inputCls } from "../ui";
import {
    EMPTY_DOCTOR,
    changedKeys,
    doctorSlug,
    scheduleProblems,
    toForm,
    toPayload,
} from "./doctorForm";

export function DoctorEditor() {
    return (
        <RequirePermission perm="doctors.manage">
            <EditorLoader />
        </RequirePermission>
    );
}

function EditorLoader() {
    const { id } = useParams();
    const isNew = id === "new";
    const doc = useAdminGet(isNew ? null : `/admin/doctors/${id}`);
    const opts = useAdminGet("/admin/doctors/options");

    if (doc.error) {
        return (
            <div className="py-10">
                <Notice>
                    {doc.error.status === 404
                        ? "This doctor doesn't exist (maybe deleted)."
                        : doc.error.message}
                </Notice>
                <Link href="/admin/doctors" className="mt-4 inline-block text-teal-800 underline">
                    Back to doctors
                </Link>
            </div>
        );
    }
    if ((!isNew && !doc.data) || !opts.data) {
        return <div className="h-96 animate-pulse rounded-xl bg-paper-2/50" aria-busy="true" />;
    }
    // key: a saved doc (new updatedAt) remounts the form with the saved values as the new baseline
    return (
        <Editor
            key={isNew ? "new" : doc.data.updatedAt}
            original={isNew ? null : doc.data}
            departments={opts.data.departments}
            onSaved={(updated) => doc.mutate(() => ({ ...updated, _justSaved: true }))}
        />
    );
}

function Editor({ original, departments, onSaved }) {
    const router = useRouter();
    const isNew = !original;
    const [f, setF] = useState(() => (original ? toForm(original) : EMPTY_DOCTOR));
    const [slugTouched, setSlugTouched] = useState(!isNew);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const savedAt = original?._justSaved;
    const [confirmDelete, setConfirmDelete] = useState(false);
    const set = (patch) => setF((x) => ({ ...x, ...patch }));

    const payload = useMemo(() => toPayload(f), [f]);
    const changed = useMemo(
        () => (isNew ? Object.keys(payload) : changedKeys(payload, original)),
        [payload, original, isNew],
    );
    const dirty = isNew ? !!f.name.en.trim() : changed.length > 0;
    const localErrors = useMemo(() => {
        const e = scheduleProblems(f.schedule);
        if (f.leaveOn && !f.leave.until) e["leave.until"] = "Pick the last day of leave.";
        if (f.leaveOn && f.leave.from && f.leave.until && f.leave.from > f.leave.until)
            e["leave.until"] = "Must be on or after the first day.";
        return e;
    }, [f.schedule, f.leaveOn, f.leave]);
    const allErrors = { ...errors, ...localErrors };
    const canSave = dirty && f.name.en.trim().length >= 2 && !Object.keys(localErrors).length;

    // Leaving with unsaved edits (reload / close tab) asks first.
    const dirtyRef = useRef(dirty);
    useEffect(() => {
        dirtyRef.current = dirty;
    }, [dirty]);
    useEffect(() => {
        const onBeforeUnload = (e) => {
            if (dirtyRef.current) e.preventDefault();
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, []);

    function onName(name) {
        set({ name, ...(!slugTouched && { slug: doctorSlug(name.en) }) });
    }

    async function save(e) {
        e?.preventDefault();
        if (!canSave || busy) return;
        setBusy(true);
        setError(null);
        setErrors({});
        try {
            if (isNew) {
                const { slug, ...rest } = payload;
                const doc = await adminFetch("/admin/doctors", {
                    method: "POST",
                    body: { ...rest, ...(slugTouched && slug && { slug }) },
                });
                dirtyRef.current = false;
                router.replace(`/admin/doctors/${doc._id}`);
            } else {
                const body = Object.fromEntries(changed.map((k) => [k, payload[k]]));
                const updated = await adminFetch(`/admin/doctors/${original._id}`, {
                    method: "PATCH",
                    body,
                });
                dirtyRef.current = false;
                onSaved(updated); // → remount on the new updatedAt
            }
        } catch (err) {
            setErrors(err.fieldErrors);
            setError(
                err.code === "VALIDATION"
                    ? "Some fields need attention — see the highlighted ones below."
                    : err.message,
            );
            setBusy(false);
        }
    }

    const publicUrl = `/doctors/${original?.slug ?? ""}`;
    const slugRenamed = !isNew && f.slug && f.slug !== original.slug;

    return (
        <form onSubmit={save} noValidate className="pb-28">
            <nav className="mb-3 text-[0.84rem]">
                <Link
                    href="/admin/doctors"
                    className="inline-flex items-center gap-1 text-ink-3 hover:text-ink"
                >
                    <AIcon name="prev" /> Doctors
                </Link>
            </nav>
            <header className="flex flex-wrap items-start justify-between gap-4 pb-6">
                <div className="flex min-w-0 items-center gap-4">
                    <Photo value={f.photo} onChange={(photo) => set({ photo })} compact />
                    <div className="min-w-0">
                        <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-teal-700 uppercase">
                            {isNew ? "New doctor" : "Edit doctor"}
                        </p>
                        <h1 className="mt-1 truncate text-[1.65rem] leading-tight font-medium tracking-[-0.02em]">
                            {f.name.en || "Untitled"}
                        </h1>
                        {!isNew ? (
                            <p className="mt-1 text-[0.82rem] text-ink-3">
                                Last saved {fmtDateTime(original.updatedAt)}
                            </p>
                        ) : null}
                    </div>
                </div>
                {!isNew && original.isActive !== false ? (
                    <a
                        href={publicUrl}
                        target="_blank"
                        rel="noopener"
                        className={abtn({ size: "sm" })}
                    >
                        View on website <AIcon name="external" />
                    </a>
                ) : null}
            </header>

            {error ? <Notice className="mb-6">{error}</Notice> : null}

            <div className="space-y-9">
                <FormSection
                    n={1}
                    title="Profile"
                    sub="What patients read on the doctor's page and card."
                >
                    <LText
                        id="dn"
                        label="Name (with title)"
                        required
                        value={f.name}
                        onChange={onName}
                        maxLength={160}
                        errors={allErrors}
                        prefix="name"
                        hint="Example: Prof. Dr. Nasima Begum · অধ্যাপক ডা. নাসিমা বেগম"
                    />
                    <Field
                        label="Web address"
                        htmlFor="d-slug"
                        error={allErrors.slug}
                        hint={
                            slugRenamed
                                ? "The old address will redirect to the new one — shared links keep working."
                                : "Made from the English name. Change only if needed."
                        }
                    >
                        <div className="flex items-stretch overflow-hidden rounded-lg border border-line bg-card focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/15">
                            <span className="flex items-center bg-paper-2 px-3 text-[0.84rem] whitespace-nowrap text-ink-3">
                                /doctors/
                            </span>
                            <input
                                id="d-slug"
                                value={f.slug}
                                onChange={(e) => {
                                    setSlugTouched(true);
                                    set({
                                        slug: e.target.value
                                            .toLowerCase()
                                            .replace(/[^a-z0-9-]/g, "-"),
                                    });
                                }}
                                className="min-h-10 w-full bg-transparent px-3 text-[0.92rem] focus:outline-none"
                                spellCheck={false}
                                maxLength={160}
                            />
                        </div>
                    </Field>
                    <LText
                        id="ddes"
                        label="Designation"
                        value={f.designation}
                        onChange={(designation) => set({ designation })}
                        maxLength={200}
                        errors={allErrors}
                        prefix="designation"
                        hint="Example: Associate Professor, Gynae & Obs"
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="Degrees"
                            htmlFor="d-deg"
                            error={allErrors.degrees}
                            hint="As written on the prescription pad."
                        >
                            <input
                                id="d-deg"
                                value={f.degrees}
                                onChange={(e) => set({ degrees: e.target.value })}
                                maxLength={300}
                                className={inputCls}
                            />
                        </Field>
                        <Field label="Department" htmlFor="d-dept" error={allErrors.department}>
                            <select
                                id="d-dept"
                                value={f.department}
                                onChange={(e) => set({ department: e.target.value })}
                                className={inputCls}
                            >
                                <option value="">— None —</option>
                                {departments.map((d) => (
                                    <option key={d._id} value={d._id}>
                                        {d.name.en}
                                        {d.isActive === false ? " (hidden)" : ""}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>
                    <LText
                        id="dspec"
                        label="Speciality / special interest"
                        multiline
                        rows={2}
                        value={f.specialty}
                        onChange={(specialty) => set({ specialty })}
                        maxLength={400}
                        errors={allErrors}
                        prefix="specialty"
                    />
                    <LText
                        id="daff"
                        label="Also works at (optional)"
                        value={f.affiliation}
                        onChange={(affiliation) => set({ affiliation })}
                        maxLength={200}
                        errors={allErrors}
                        prefix="affiliation"
                        hint="Example: Enam Medical College Hospital, Savar"
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                            label="BMDC registration no."
                            htmlFor="d-bmdc"
                            error={allErrors.bmdc}
                            hint="Shown on the profile (proposal requirement)."
                        >
                            <input
                                id="d-bmdc"
                                value={f.bmdc}
                                onChange={(e) => set({ bmdc: e.target.value })}
                                maxLength={20}
                                placeholder="A-12345"
                                className={inputCls}
                            />
                        </Field>
                        <Field
                            label="Doctor's phone (optional)"
                            htmlFor="d-phone"
                            error={allErrors.phone}
                            hint="Leave empty to route patients to the hospital desk."
                        >
                            <input
                                id="d-phone"
                                type="tel"
                                value={f.phone}
                                onChange={(e) => set({ phone: e.target.value })}
                                maxLength={20}
                                className={inputCls}
                            />
                        </Field>
                    </div>
                </FormSection>

                <FormSection
                    n={2}
                    title="Photo"
                    sub="Portrait, face in the upper third. JPG/PNG/WebP up to 10 MB — converted to WebP automatically."
                >
                    <Photo
                        value={f.photo}
                        onChange={(photo) => set({ photo })}
                        error={allErrors.photo}
                    />
                </FormSection>

                <FormSection
                    n={3}
                    title="Chamber times"
                    sub="Dhaka time. Shown as the weekly timetable and the “Today” badge."
                >
                    <ScheduleEditor
                        schedule={f.schedule}
                        onChange={(schedule) => set({ schedule })}
                        errors={allErrors}
                    />
                    <LText
                        id="dsn"
                        label="Note instead of times (optional)"
                        value={f.scheduleNote}
                        onChange={(scheduleNote) => set({ scheduleNote })}
                        maxLength={200}
                        errors={allErrors}
                        prefix="scheduleNote"
                        hint="For doctors without fixed chamber hours — e.g. “Operates on scheduled OT days — call the desk”."
                    />
                </FormSection>

                <FormSection
                    n={4}
                    title="Leave"
                    sub="Shows “On leave until …” on the website for these days."
                >
                    <Toggle
                        id="d-leave"
                        checked={f.leaveOn}
                        onChange={(leaveOn) => set({ leaveOn })}
                        label="Doctor is on leave"
                    />
                    {f.leaveOn ? (
                        <div className="space-y-4 rounded-xl border border-line-soft bg-paper/60 p-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="First day (optional)"
                                    htmlFor="d-lf"
                                    hint="Empty = from today."
                                >
                                    <input
                                        id="d-lf"
                                        type="date"
                                        value={f.leave.from}
                                        onChange={(e) =>
                                            set({ leave: { ...f.leave, from: e.target.value } })
                                        }
                                        className={inputCls}
                                    />
                                </Field>
                                <Field
                                    label="Last day"
                                    htmlFor="d-lu"
                                    error={allErrors["leave.until"]}
                                >
                                    <input
                                        id="d-lu"
                                        type="date"
                                        value={f.leave.until}
                                        min={f.leave.from || undefined}
                                        onChange={(e) =>
                                            set({ leave: { ...f.leave, until: e.target.value } })
                                        }
                                        className={inputCls}
                                    />
                                </Field>
                            </div>
                            <LText
                                id="dln"
                                label="Note (optional)"
                                value={f.leave.note}
                                onChange={(note) => set({ leave: { ...f.leave, note } })}
                                maxLength={160}
                                hint="Example: Abroad for a conference"
                            />
                        </div>
                    ) : null}
                </FormSection>

                <FormSection n={5} title="On the website">
                    <Toggle
                        id="d-active"
                        checked={f.isActive}
                        onChange={(isActive) => set({ isActive })}
                        label="Show this doctor on the website"
                        sub="Off = hidden everywhere (profile, lists, search). Nothing is deleted."
                    />
                    <Toggle
                        id="d-feat"
                        checked={f.isFeatured}
                        onChange={(isFeatured) => set({ isFeatured })}
                        label="Feature on the homepage"
                        sub="Appears in the homepage doctors rail."
                    />
                    <Field
                        label="Sort order"
                        htmlFor="d-order"
                        hint="Lower numbers come first in lists. Empty on a new doctor = last."
                        error={allErrors.order}
                    >
                        <input
                            id="d-order"
                            type="number"
                            min={0}
                            max={9999}
                            value={f.order}
                            onChange={(e) => set({ order: e.target.value })}
                            className={cn(inputCls, "w-32")}
                        />
                    </Field>
                </FormSection>

                {!isNew ? (
                    <FormSection
                        n={6}
                        title="Delete"
                        sub="Only for entries made by mistake. To take a doctor off the website, switch “Show this doctor” off instead."
                    >
                        <ABtn variant="danger" onClick={() => setConfirmDelete(true)}>
                            Delete doctor…
                        </ABtn>
                    </FormSection>
                ) : null}
            </div>

            {/* Sticky save bar */}
            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur lg:left-62">
                <div className="mx-auto flex max-w-304 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
                    <p className="text-[0.85rem] text-ink-3" role="status">
                        {Object.keys(localErrors).length
                            ? "Fix the highlighted fields to save."
                            : dirty
                              ? isNew
                                  ? "New doctor — not saved yet."
                                  : `${changed.length} unsaved ${changed.length === 1 ? "change" : "changes"}`
                              : savedAt
                                ? "Saved."
                                : "No changes."}
                    </p>
                    <div className="flex gap-2">
                        {dirty && !isNew ? (
                            <ABtn variant="ghost" onClick={() => setF(toForm(original))}>
                                Discard
                            </ABtn>
                        ) : null}
                        <ABtn type="submit" variant="ink" busy={busy} disabled={!canSave}>
                            {isNew ? "Create doctor" : "Save changes"}
                        </ABtn>
                    </div>
                </div>
            </div>

            {!isNew ? (
                <DeleteDialog
                    open={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    doctor={original}
                />
            ) : null}
        </form>
    );
}

// ── Photo ────────────────────────────────────────────────────────────────────────────────────────────
function Photo({ value, onChange, error, compact }) {
    const input = useRef(null);
    const [busy, setBusy] = useState(false);
    const [problem, setProblem] = useState(null);

    async function upload(file) {
        if (!file) return;
        setBusy(true);
        setProblem(null);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const out = await adminFetch("/admin/uploads/doctors", { method: "POST", body: fd });
            onChange(out.src);
            if (out.warnings?.length) setProblem(out.warnings.join(" "));
        } catch (err) {
            setProblem(err.message);
        } finally {
            setBusy(false);
            if (input.current) input.current.value = "";
        }
    }

    const img = value ? (
        // eslint-disable-next-line @next/next/no-img-element -- fresh uploads aren't known to next/image
        <img
            src={value}
            alt="Doctor photo"
            onError={(e) => (e.currentTarget.style.visibility = "hidden")}
            className="size-full object-cover object-top"
        />
    ) : (
        <span className="grid size-full place-items-center text-ink-3">
            <AIcon name="stethoscope" className="size-6" />
        </span>
    );

    if (compact)
        return (
            <span className="size-16 shrink-0 overflow-hidden rounded-xl border border-line bg-paper-2">
                {img}
            </span>
        );

    return (
        <div className="flex flex-wrap items-end gap-5">
            <div className="aspect-4/5 w-40 overflow-hidden rounded-xl border border-line bg-paper-2">
                {img}
            </div>
            <div className="space-y-2">
                <input
                    ref={input}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="sr-only"
                    id="d-photo"
                    onChange={(e) => upload(e.target.files?.[0])}
                />
                <label
                    htmlFor="d-photo"
                    className={cn(
                        abtn({ size: "sm" }),
                        "cursor-pointer",
                        busy && "pointer-events-none opacity-50",
                    )}
                >
                    <AIcon
                        name={busy ? "refresh" : "image"}
                        className={busy ? "animate-spin" : ""}
                    />
                    {busy ? "Uploading…" : value ? "Replace photo" : "Upload photo"}
                </label>
                {value ? (
                    <ABtn size="sm" variant="ghost" onClick={() => onChange(null)}>
                        Remove
                    </ABtn>
                ) : null}
                {problem || error ? (
                    <p className="max-w-xs text-[0.8rem] text-emergency-ink">{problem || error}</p>
                ) : null}
            </div>
        </div>
    );
}

// ── Weekly schedule ─────────────────────────────────────────────────────────────────────────────────
function ScheduleEditor({ schedule, onChange, errors }) {
    const rows = schedule.map((s, i) => ({ ...s, i }));
    const update = (i, patch) =>
        onChange(schedule.map((s, k) => (k === i ? { ...s, ...patch } : s)));
    const remove = (i) => onChange(schedule.filter((_, k) => k !== i));
    const add = (day) => {
        const last = rows.filter((r) => r.day === day).at(-1);
        onChange([
            ...schedule,
            last ? { day, from: last.to, to: "" } : { day, from: "17:00", to: "20:00" },
        ]);
    };
    const copyToAll = (day) => {
        const src = schedule.filter((s) => s.day === day);
        onChange([
            ...schedule.filter((s) => s.day === day),
            ...DAYS.filter((d) => d !== day && d !== "fri").flatMap((d) =>
                src.map((s) => ({ ...s, day: d })),
            ),
        ]);
    };

    return (
        <div className="overflow-hidden rounded-xl border border-line bg-card">
            {DAYS.map((day) => {
                const slots = rows.filter((r) => r.day === day);
                return (
                    <div
                        key={day}
                        className="grid gap-3 border-b border-line-soft px-4 py-3 last:border-0 sm:grid-cols-[7.5rem_minmax(0,1fr)]"
                    >
                        <p
                            className={cn(
                                "pt-2 text-[0.9rem] font-medium",
                                !slots.length && "text-ink-3",
                            )}
                        >
                            {DAY_LABELS[day]}
                        </p>
                        <div className="space-y-2">
                            {slots.map((s) => {
                                const err =
                                    errors[`schedule.${s.i}.from`] || errors[`schedule.${s.i}.to`];
                                return (
                                    <div key={s.i}>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <input
                                                type="time"
                                                step={300}
                                                value={s.from}
                                                onChange={(e) =>
                                                    update(s.i, { from: e.target.value })
                                                }
                                                aria-label={`${DAY_LABELS[day]} start`}
                                                aria-invalid={err ? true : undefined}
                                                className={cn(inputCls, "w-34")}
                                            />
                                            <span className="text-ink-3">to</span>
                                            <input
                                                type="time"
                                                step={300}
                                                value={s.to}
                                                onChange={(e) =>
                                                    update(s.i, { to: e.target.value })
                                                }
                                                aria-label={`${DAY_LABELS[day]} end`}
                                                aria-invalid={err ? true : undefined}
                                                className={cn(inputCls, "w-34")}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => remove(s.i)}
                                                className="grid size-9 place-items-center rounded-lg text-ink-3 hover:bg-ink/5 hover:text-ink"
                                                aria-label={`Remove ${DAY_LABELS[day]} ${s.from}–${s.to}`}
                                            >
                                                <AIcon name="close" />
                                            </button>
                                        </div>
                                        {err ? (
                                            <p className="mt-1 text-[0.8rem] text-emergency-ink">
                                                {err}
                                            </p>
                                        ) : null}
                                    </div>
                                );
                            })}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.84rem]">
                                <button
                                    type="button"
                                    onClick={() => add(day)}
                                    className="inline-flex h-8 items-center gap-1 text-teal-800 hover:underline"
                                >
                                    <AIcon name="plus" />{" "}
                                    {slots.length ? "Add another time" : "Add time"}
                                </button>
                                {slots.length ? (
                                    <button
                                        type="button"
                                        onClick={() => copyToAll(day)}
                                        className="inline-flex h-8 items-center gap-1 text-ink-3 hover:text-ink"
                                    >
                                        <AIcon name="copy" /> Same times Sat–Thu
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ── Delete ───────────────────────────────────────────────────────────────────────────────────────────
function DeleteDialog({ open, onClose, doctor }) {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [typed, setTyped] = useState("");
    async function go() {
        setBusy(true);
        setError(null);
        try {
            await adminFetch(`/admin/doctors/${doctor._id}`, { method: "DELETE" });
            router.replace("/admin/doctors");
        } catch (err) {
            setError(err.message);
            setBusy(false);
        }
    }
    return (
        <Dialog open={open} onClose={onClose} closeLabel="Close">
            <div className="p-6 sm:p-7">
                <h2 className="pr-10 text-xl font-medium">Delete {doctor.name.en}?</h2>
                <p className="mt-2 text-[0.9rem] text-ink-2">
                    The profile page stops working and this can&apos;t be undone. Past bookings keep
                    the doctor&apos;s name. If the doctor may come back, hide them instead.
                </p>
                <Field label={`Type "delete" to confirm`} htmlFor="del-confirm" className="mt-5">
                    <input
                        id="del-confirm"
                        value={typed}
                        onChange={(e) => setTyped(e.target.value)}
                        className={inputCls}
                        autoComplete="off"
                    />
                </Field>
                {error ? <Notice className="mt-4">{error}</Notice> : null}
                <div className="mt-5 flex gap-2">
                    <ABtn
                        variant="danger"
                        busy={busy}
                        disabled={typed.trim().toLowerCase() !== "delete"}
                        onClick={go}
                    >
                        Delete permanently
                    </ABtn>
                    <ABtn variant="ghost" onClick={onClose}>
                        Cancel
                    </ABtn>
                </div>
            </div>
        </Dialog>
    );
}
