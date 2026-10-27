"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin/api";
import { COLLECTIONS, GROUPS } from "@/lib/admin/collections";
import { fmtDateTime } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/Dialog";
import { useAdminGet } from "../hooks";
import { RequirePermission } from "../session";
import { ABtn, AIcon, Field, FormSection, Notice, abtn, inputCls } from "../ui";
import { CollectionTabs } from "./CollectionList";
import { FieldInput } from "./fields";
import { changedKeys, missingRequired, slugify, toForm, toPayload } from "./form";

export function CollectionEditor({ name }) {
    const cfg = useMemo(() => ({ ...COLLECTIONS[name], key: name }), [name]);
    return (
        <RequirePermission perm={cfg.perm}>
            <Loader cfg={cfg} />
        </RequirePermission>
    );
}

function Loader({ cfg: base }) {
    const { id } = useParams();
    const isNew = !base.singleton && !base.noCreate && id === "new";
    const doc = useAdminGet(isNew ? null : base.singleton ? base.api : `${base.api}/${id}`);
    // fields that depend on the document (site vs legal page)
    const fieldsFor = base.fieldsFor;
    const cfg = useMemo(
        () => (fieldsFor && doc.data ? { ...base, fields: fieldsFor(doc.data) } : base),
        [base, fieldsFor, doc.data],
    );
    if (doc.error) {
        return (
            <div className="py-10">
                <Notice>
                    {doc.error.status === 404
                        ? `This ${cfg.noun} doesn't exist (maybe deleted).`
                        : doc.error.message}
                </Notice>
                {!cfg.singleton ? (
                    <Link href={cfg.path} className="mt-4 inline-block text-teal-800 underline">
                        Back to {cfg.title.toLowerCase()}
                    </Link>
                ) : null}
            </div>
        );
    }
    if (!isNew && !doc.data)
        return <div className="h-96 animate-pulse rounded-xl bg-paper-2/50" aria-busy="true" />;
    return (
        <Editor
            key={isNew ? "new" : doc.data.updatedAt}
            cfg={cfg}
            original={isNew ? null : doc.data}
            onSaved={(updated) => doc.mutate(() => ({ ...updated, _justSaved: true }))}
        />
    );
}

function Editor({ cfg, original, onSaved }) {
    const router = useRouter();
    const isNew = !original;
    const [f, setF] = useState(() => toForm(cfg, original ?? {}));
    const [slugTouched, setSlugTouched] = useState(!isNew);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const set = (patch) =>
        setF((x) => {
            const next = { ...x, ...patch };
            // new entries: web address follows the English name until edited by hand
            if (cfg.slug && !slugTouched && patch[cfg.nameKey])
                next.slug = slugify(patch[cfg.nameKey].en);
            return next;
        });

    const payload = useMemo(() => toPayload(cfg, f), [cfg, f]);
    const changed = useMemo(
        () => (isNew ? Object.keys(payload) : changedKeys(cfg, payload, original)),
        [cfg, payload, original, isNew],
    );
    const missing = useMemo(() => missingRequired(cfg, f), [cfg, f]);
    const dirty = isNew ? changedKeys(cfg, payload, {}).length > 0 : changed.length > 0;
    const canSave = dirty && !Object.keys(missing).length;

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
                const doc = await adminFetch(cfg.api, {
                    method: "POST",
                    body: { ...rest, ...(slugTouched && slug && { slug }) },
                });
                dirtyRef.current = false;
                router.replace(`${cfg.path}/${doc._id}`);
            } else {
                const body = Object.fromEntries(changed.map((k) => [k, payload[k]]));
                const updated = await adminFetch(cfg.singleton ? cfg.api : `${cfg.api}/${original._id}`, {
                    method: "PATCH",
                    body,
                });
                dirtyRef.current = false;
                onSaved(updated);
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

    const sections = Object.keys(cfg.sections).filter((s) =>
        cfg.fields.some((fd) => fd.section === s),
    );
    const title = f[cfg.nameKey]?.en || "Untitled";
    const slugRenamed = !isNew && cfg.slug && f.slug && f.slug !== original.slug;
    const viewUrl =
        isNew || original.isActive === false
            ? null
            : cfg.viewUrl
              ? cfg.viewUrl(original)
              : cfg.slug?.publicBase
                ? `${cfg.slug.publicBase}/${original.slug}`
                : null;
    const canDelete = !isNew && !cfg.singleton && !cfg.noCreate;
    const group = cfg.group && cfg.singleton ? GROUPS[cfg.group] : null;
    const allErrors = { ...errors, ...(isNew ? {} : missing) };

    return (
        <form onSubmit={save} noValidate className="pb-28">
            {group ? (
                <div className="mb-6">
                    <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-teal-700 uppercase">
                        {group.eyebrow}
                    </p>
                    <h1 className="mt-1 text-[1.65rem] leading-tight font-medium tracking-[-0.02em]">
                        {group.title}
                    </h1>
                    <CollectionTabs current={cfg.key} />
                </div>
            ) : (
                <nav className="mb-3 text-[0.84rem]">
                    <Link
                        href={cfg.path}
                        className="inline-flex items-center gap-1 text-ink-3 hover:text-ink"
                    >
                        <AIcon name="prev" /> {GROUPS[cfg.group]?.title ?? cfg.title}
                    </Link>
                </nav>
            )}
            <header className="flex flex-wrap items-start justify-between gap-4 pb-6">
                <div className="min-w-0">
                    {group ? (
                        <h2 className="truncate text-[1.2rem] leading-tight font-medium">{title}</h2>
                    ) : (
                        <>
                            <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-teal-700 uppercase">
                                {isNew ? `New ${cfg.noun}` : `Edit ${cfg.noun}`}
                            </p>
                            <h1 className="mt-1 truncate text-[1.65rem] leading-tight font-medium tracking-[-0.02em]">
                                {title}
                            </h1>
                        </>
                    )}
                    {!isNew ? (
                        <p className="mt-1 text-[0.82rem] text-ink-3">
                            Last saved {fmtDateTime(original.updatedAt)}
                        </p>
                    ) : null}
                </div>
                {viewUrl ? (
                    <a
                        href={viewUrl}
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
                {sections.map((s, i) => (
                    <FormSection
                        key={s}
                        n={i + 1}
                        title={cfg.sections[s].title}
                        sub={cfg.sections[s].sub}
                    >
                        {cfg.fields
                            .filter((fd) => fd.section === s)
                            .map((fd) => (
                                <FieldInput
                                    key={fd.key}
                                    fd={fd}
                                    value={f[fd.key]}
                                    set={set}
                                    errors={allErrors}
                                    form={f}
                                />
                            ))}
                        {s === sections[0] && cfg.slug ? (
                            <Field
                                label="Web address"
                                htmlFor="f-slug"
                                error={errors.slug}
                                hint={
                                    slugRenamed
                                        ? "The old address will redirect to the new one — shared links keep working."
                                        : "Made from the English name. Change only if needed."
                                }
                            >
                                <div className="flex items-stretch overflow-hidden rounded-lg border border-line bg-card focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/15">
                                    <span className="flex items-center bg-paper-2 px-3 text-[0.84rem] whitespace-nowrap text-ink-3">
                                        {cfg.slug.publicBase}/
                                    </span>
                                    <input
                                        id="f-slug"
                                        value={f.slug}
                                        onChange={(e) => {
                                            setSlugTouched(true);
                                            setF((x) => ({
                                                ...x,
                                                slug: e.target.value
                                                    .toLowerCase()
                                                    .replace(/[^a-z0-9-]/g, "-"),
                                            }));
                                        }}
                                        className="min-h-10 w-full bg-transparent px-3 text-[0.92rem] focus:outline-none"
                                        spellCheck={false}
                                        maxLength={160}
                                    />
                                </div>
                                {original?.legacySlugs?.length ? (
                                    <p className="mt-1 text-[0.78rem] text-ink-3">
                                        Old website links that redirect here:{" "}
                                        {original.legacySlugs.join(", ")}
                                    </p>
                                ) : null}
                            </Field>
                        ) : null}
                        {s === "website" && !cfg.orderable && !cfg.noOrder ? (
                            <Field
                                label="Sort order"
                                htmlFor="f-order"
                                hint="Lower numbers come first. Empty on a new entry = last."
                                error={errors.order}
                            >
                                <input
                                    id="f-order"
                                    type="number"
                                    min={0}
                                    max={9999}
                                    value={f.order}
                                    onChange={(e) => setF((x) => ({ ...x, order: e.target.value }))}
                                    className={cn(inputCls, "w-32")}
                                />
                            </Field>
                        ) : null}
                    </FormSection>
                ))}
                {canDelete ? (
                    <FormSection
                        n={sections.length + 1}
                        title="Delete"
                        sub="Only for entries made by mistake. To take it off the website, switch “Show on the website” off instead."
                    >
                        <ABtn variant="danger" onClick={() => setConfirmDelete(true)}>
                            Delete {cfg.noun}…
                        </ABtn>
                    </FormSection>
                ) : null}
            </div>

            <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur lg:left-62">
                <div className="mx-auto flex max-w-304 items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
                    <p className="text-[0.85rem] text-ink-3" role="status">
                        {isNew
                            ? Object.keys(missing).length
                                ? "Fill the required fields (*) to create it."
                                : `New ${cfg.noun} — not saved yet.`
                            : Object.keys(missing).length
                              ? "Fill the required fields (*) to save."
                              : dirty
                                ? `${changed.length} unsaved ${changed.length === 1 ? "change" : "changes"}`
                                : original?._justSaved
                                  ? "Saved."
                                  : "No changes."}
                    </p>
                    <div className="flex gap-2">
                        {dirty && !isNew ? (
                            <ABtn variant="ghost" onClick={() => setF(toForm(cfg, original))}>
                                Discard
                            </ABtn>
                        ) : null}
                        <ABtn type="submit" variant="ink" busy={busy} disabled={!canSave}>
                            {isNew ? `Create ${cfg.noun}` : "Save changes"}
                        </ABtn>
                    </div>
                </div>
            </div>

            {canDelete ? (
                <DeleteDialog
                    open={confirmDelete}
                    onClose={() => setConfirmDelete(false)}
                    cfg={cfg}
                    doc={original}
                    title={title}
                />
            ) : null}
        </form>
    );
}

function DeleteDialog({ open, onClose, cfg, doc, title }) {
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
                <h2 className="pr-10 text-xl font-medium">Delete {title}?</h2>
                <p className="mt-2 text-[0.9rem] text-ink-2">
                    This can&apos;t be undone. If it may come back, hide it instead.
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
