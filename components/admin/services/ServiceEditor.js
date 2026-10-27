"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin/api";
import { fmtDateTime } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/Dialog";
import { useAdminGet } from "../hooks";
import { ImageUpload } from "../ImageUpload";
import { RequirePermission } from "../session";
import { ABtn, AIcon, Field, FormSection, LText, Notice, Toggle, abtn, inputCls } from "../ui";
import { KINDS, SECTIONS, changedKeys, slugify, toForm, toPayload } from "./kinds";

export function ServiceEditor({ kind }) {
    return (
        <RequirePermission perm="departments.manage">
            <Loader kind={kind} />
        </RequirePermission>
    );
}

function Loader({ kind }) {
    const cfg = KINDS[kind];
    const { id } = useParams();
    const isNew = id === "new";
    const doc = useAdminGet(isNew ? null : `${cfg.api}/${id}`);
    if (doc.error) {
        return (
            <div className="py-10">
                <Notice>{doc.error.status === 404 ? `This ${cfg.noun} doesn't exist (maybe deleted).` : doc.error.message}</Notice>
                <Link href={cfg.path} className="mt-4 inline-block text-teal-800 underline">
                    Back to {cfg.title.toLowerCase()}
                </Link>
            </div>
        );
    }
    if (!isNew && !doc.data) return <div className="h-96 animate-pulse rounded-xl bg-paper-2/50" aria-busy="true" />;
    return (
        <Editor
            key={isNew ? "new" : doc.data.updatedAt}
            kind={kind}
            original={isNew ? null : doc.data}
            onSaved={(updated) => doc.mutate(() => ({ ...updated, _justSaved: true }))}
        />
    );
}

/** Repeating EN/বাংলা rows with add / remove / move. */
function ListEditor({ id, label, items, onChange, max, placeholder, errors, prefix }) {
    const move = (i, d) => {
        const next = [...items];
        [next[i], next[i + d]] = [next[i + d], next[i]];
        onChange(next);
    };
    return (
        <fieldset>
            <legend className="mb-1.5 text-[0.8rem] font-semibold text-ink-2">
                {label} <span className="font-normal text-ink-3">· {items.length}/{max}</span>
            </legend>
            <ol className="space-y-2">
                {items.map((it, i) => {
                    const err = errors[`${prefix}.${i}.en`] || errors[`${prefix}.${i}.bn`];
                    return (
                        <li key={i} className="grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-start gap-2">
                            <span className="pt-2.5 text-right text-[0.75rem] text-ink-3 tabular-nums">{i + 1}</span>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <input
                                    id={i === 0 ? id : undefined}
                                    lang="en"
                                    value={it.en}
                                    placeholder={placeholder}
                                    maxLength={160}
                                    onChange={(e) => onChange(items.map((x, k) => (k === i ? { ...x, en: e.target.value } : x)))}
                                    aria-label={`${label} ${i + 1} (English)`}
                                    aria-invalid={err ? true : undefined}
                                    className={inputCls}
                                />
                                <input
                                    lang="bn"
                                    value={it.bn}
                                    maxLength={160}
                                    placeholder="বাংলা"
                                    onChange={(e) => onChange(items.map((x, k) => (k === i ? { ...x, bn: e.target.value } : x)))}
                                    aria-label={`${label} ${i + 1} (Bangla)`}
                                    className={inputCls}
                                />
                            </div>
                            <div className="flex">
                                <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="grid size-9 place-items-center rounded-lg text-ink-3 hover:bg-ink/5 disabled:opacity-30" aria-label={`Move ${i + 1} up`}>
                                    <AIcon name="next" className="-rotate-90" />
                                </button>
                                <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="grid size-9 place-items-center rounded-lg text-ink-3 hover:bg-ink/5 disabled:opacity-30" aria-label={`Move ${i + 1} down`}>
                                    <AIcon name="next" className="rotate-90" />
                                </button>
                                <button type="button" onClick={() => onChange(items.filter((_, k) => k !== i))} className="grid size-9 place-items-center rounded-lg text-ink-3 hover:bg-ink/5 hover:text-ink" aria-label={`Remove ${i + 1}`}>
                                    <AIcon name="close" />
                                </button>
                            </div>
                            {err ? <p className="col-start-2 text-[0.8rem] text-emergency-ink">{err}</p> : null}
                        </li>
                    );
                })}
            </ol>
            {items.length < max ? (
                <button type="button" onClick={() => onChange([...items, { en: "", bn: "" }])} className="mt-2 ml-8 inline-flex h-8 items-center gap-1 text-[0.84rem] text-teal-800 hover:underline">
                    <AIcon name="plus" /> Add
                </button>
            ) : null}
        </fieldset>
    );
}

function Counter({ value, max }) {
    const n = value.length;
    return <span className={cn("tabular-nums", n > max ? "text-emergency-ink" : "text-ink-3")}>{n}/{max}</span>;
}

function Editor({ kind, original, onSaved }) {
    const cfg = KINDS[kind];
    const router = useRouter();
    const isNew = !original;
    const [f, setF] = useState(() => toForm(kind, original ?? {}));
    const [slugTouched, setSlugTouched] = useState(!isNew);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const set = (patch) => setF((x) => ({ ...x, ...patch }));

    const payload = useMemo(() => toPayload(kind, f), [kind, f]);
    const changed = useMemo(() => (isNew ? Object.keys(payload) : changedKeys(kind, payload, original)), [kind, payload, original, isNew]);
    const dirty = isNew ? !!f.name.en.trim() : changed.length > 0;
    const canSave = dirty && f.name.en.trim().length >= 2;

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

    async function save(e) {
        e?.preventDefault();
        if (!canSave || busy) return;
        setBusy(true);
        setError(null);
        setErrors({});
        try {
            if (isNew) {
                const { slug, ...rest } = payload;
                const doc = await adminFetch(cfg.api, { method: "POST", body: { ...rest, ...(slugTouched && slug && { slug }) } });
                dirtyRef.current = false;
                router.replace(`${cfg.path}/${doc._id}`);
            } else {
                const body = Object.fromEntries(changed.map((k) => [k, payload[k]]));
                const updated = await adminFetch(`${cfg.api}/${original._id}`, { method: "PATCH", body });
                dirtyRef.current = false;
                onSaved(updated);
            }
        } catch (err) {
            setErrors(err.fieldErrors);
            setError(err.code === "VALIDATION" ? "Some fields need attention — see the highlighted ones below." : err.message);
            setBusy(false);
        }
    }

    function renderField(fd) {
        const v = f[fd.key];
        const on = (val) => set({ [fd.key]: val, ...(fd.key === "name" && !slugTouched && { slug: slugify(val.en) }) });
        if (fd.type === "L" || fd.type === "Lopt")
            return <LText key={fd.key} id={`f-${fd.key}`} label={fd.label} required={fd.required} value={v} onChange={on} multiline={fd.multiline} rows={fd.rows} maxLength={fd.max} hint={fd.hint} errors={errors} prefix={fd.key} />;
        if (fd.type === "list")
            return <ListEditor key={fd.key} id={`f-${fd.key}`} label={fd.label} items={v} onChange={on} max={fd.max} placeholder={fd.placeholder} errors={errors} prefix={fd.key} />;
        if (fd.type === "bool") return <Toggle key={fd.key} id={`f-${fd.key}`} checked={v} onChange={on} label={fd.label} sub={fd.sub} />;
        if (fd.type === "image")
            return <ImageUpload key={fd.key} id={`f-${fd.key}`} folder={fd.folder} value={v} onChange={on} error={errors[fd.key]} aspect="aspect-[3/2]" width="w-80" />;
        if (fd.type === "seo")
            return (
                <div key={fd.key} className="space-y-4">
                    <LText
                        id="f-seo-title"
                        label="Title in Google"
                        value={v.title}
                        onChange={(title) => set({ seo: { ...v, title } })}
                        maxLength={70}
                        errors={errors}
                        prefix="seo.title"
                        hint={<>About 60 characters. EN <Counter value={v.title.en} max={60} /> · বাং <Counter value={v.title.bn} max={60} /></>}
                    />
                    <LText
                        id="f-seo-desc"
                        label="Description in Google"
                        multiline
                        rows={2}
                        value={v.description}
                        onChange={(description) => set({ seo: { ...v, description } })}
                        maxLength={170}
                        errors={errors}
                        prefix="seo.description"
                        hint={<>About 155 characters. EN <Counter value={v.description.en} max={155} /> · বাং <Counter value={v.description.bn} max={155} /></>}
                    />
                </div>
            );
        return null;
    }

    const sections = Object.keys(SECTIONS).filter((s) => cfg.fields.some((fd) => fd.section === s));
    const slugRenamed = !isNew && f.slug && f.slug !== original.slug;

    return (
        <form onSubmit={save} noValidate className="pb-28">
            <nav className="mb-3 text-[0.84rem]">
                <Link href={cfg.path} className="inline-flex items-center gap-1 text-ink-3 hover:text-ink">
                    <AIcon name="prev" /> {cfg.title}
                </Link>
            </nav>
            <header className="flex flex-wrap items-start justify-between gap-4 pb-6">
                <div className="min-w-0">
                    <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-teal-700 uppercase">{isNew ? `New ${cfg.noun}` : `Edit ${cfg.noun}`}</p>
                    <h1 className="mt-1 truncate text-[1.65rem] leading-tight font-medium tracking-[-0.02em]">{f.name.en || "Untitled"}</h1>
                    {!isNew ? <p className="mt-1 text-[0.82rem] text-ink-3">Last saved {fmtDateTime(original.updatedAt)}</p> : null}
                </div>
                {!isNew && original.isActive !== false ? (
                    <a href={`${cfg.publicBase}/${original.slug}`} target="_blank" rel="noopener" className={abtn({ size: "sm" })}>
                        View on website <AIcon name="external" />
                    </a>
                ) : null}
            </header>

            {error ? <Notice className="mb-6">{error}</Notice> : null}

            <div className="space-y-9">
                {sections.map((s, i) => (
                    <FormSection key={s} n={i + 1} title={SECTIONS[s].title} sub={SECTIONS[s].sub}>
                        {cfg.fields.filter((fd) => fd.section === s).map(renderField)}
                        {s === "basics" ? (
                            <Field
                                label="Web address"
                                htmlFor="f-slug"
                                error={errors.slug}
                                hint={slugRenamed ? "The old address will redirect to the new one — shared links keep working." : "Made from the English name. Change only if needed."}
                            >
                                <div className="flex items-stretch overflow-hidden rounded-lg border border-line bg-card focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/15">
                                    <span className="flex items-center bg-paper-2 px-3 text-[0.84rem] whitespace-nowrap text-ink-3">{cfg.publicBase}/</span>
                                    <input
                                        id="f-slug"
                                        value={f.slug}
                                        onChange={(e) => {
                                            setSlugTouched(true);
                                            set({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") });
                                        }}
                                        className="min-h-10 w-full bg-transparent px-3 text-[0.92rem] focus:outline-none"
                                        spellCheck={false}
                                        maxLength={160}
                                    />
                                </div>
                                {original?.legacySlugs?.length ? (
                                    <p className="mt-1 text-[0.78rem] text-ink-3">Old website links that redirect here: {original.legacySlugs.join(", ")}</p>
                                ) : null}
                            </Field>
                        ) : null}
                        {s === "website" ? (
                            <Field label="Sort order" htmlFor="f-order" hint="Lower numbers come first. Empty on a new entry = last." error={errors.order}>
                                <input id="f-order" type="number" min={0} max={9999} value={f.order} onChange={(e) => set({ order: e.target.value })} className={cn(inputCls, "w-32")} />
                            </Field>
                        ) : null}
                    </FormSection>
                ))}
                {!isNew ? (
                    <FormSection n={sections.length + 1} title="Delete" sub={`Only for entries made by mistake. To take it off the website, switch “Show on the website” off instead.`}>
                        <ABtn variant="danger" onClick={() => setConfirmDelete(true)}>
                            Delete {cfg.noun}…
                        </ABtn>
                    </FormSection>
                ) : null}
            </div>

            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur lg:left-[15.5rem]">
                <div className="mx-auto flex max-w-[76rem] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
                    <p className="text-[0.85rem] text-ink-3" role="status">
                        {dirty
                            ? isNew
                                ? `New ${cfg.noun} — not saved yet.`
                                : `${changed.length} unsaved ${changed.length === 1 ? "change" : "changes"}`
                            : original?._justSaved
                              ? "Saved."
                              : "No changes."}
                    </p>
                    <div className="flex gap-2">
                        {dirty && !isNew ? (
                            <ABtn variant="ghost" onClick={() => setF(toForm(kind, original))}>
                                Discard
                            </ABtn>
                        ) : null}
                        <ABtn type="submit" variant="ink" busy={busy} disabled={!canSave}>
                            {isNew ? `Create ${cfg.noun}` : "Save changes"}
                        </ABtn>
                    </div>
                </div>
            </div>

            {!isNew ? <DeleteDialog open={confirmDelete} onClose={() => setConfirmDelete(false)} cfg={cfg} doc={original} /> : null}
        </form>
    );
}

function DeleteDialog({ open, onClose, cfg, doc }) {
    const router = useRouter();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [typed, setTyped] = useState("");
    async function go() {
        setBusy(true);
        setError(null);
        try {
            await adminFetch(`${cfg.api}/${doc._id}`, { method: "DELETE" });
            router.replace(cfg.path);
        } catch (err) {
            setError(err.message);
            setBusy(false);
        }
    }
    return (
        <Dialog open={open} onClose={onClose} closeLabel="Close">
            <div className="p-6 sm:p-7">
                <h2 className="pr-10 text-xl font-medium">Delete {doc.name.en}?</h2>
                <p className="mt-2 text-[0.9rem] text-ink-2">Its page stops working and this can&apos;t be undone. If it may come back, hide it instead.</p>
                <Field label={`Type "delete" to confirm`} htmlFor="del-confirm" className="mt-5">
                    <input id="del-confirm" value={typed} onChange={(e) => setTyped(e.target.value)} className={inputCls} autoComplete="off" />
                </Field>
                {error ? <Notice className="mt-4">{error}</Notice> : null}
                <div className="mt-5 flex gap-2">
                    <ABtn variant="danger" busy={busy} disabled={typed.trim().toLowerCase() !== "delete"} onClick={go}>
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
