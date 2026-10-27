"use client";

import { useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin/api";
import { cn } from "@/lib/utils";
import { useAdminGet } from "./hooks";
import { ImageUpload } from "./ImageUpload";
import { PositionPicker } from "./collection/fields";
import { RequirePermission } from "./session";
import { ABtn, Field, LText, Notice, PageHead, inputCls } from "./ui";

/**
 * Image slots: every fixed picture on the site (page header bands, homepage maternity photo…).
 * The slots themselves are defined by the website's code, so this screen only swaps the picture,
 * its description and framing — each card saves on its own.
 */
export function MediaScreen() {
    return (
        <RequirePermission perm="media.manage">
            <Slots />
        </RequirePermission>
    );
}

const pageLabel = (p) => (p === "/" ? "Homepage" : (p ?? "—"));

function Slots() {
    const list = useAdminGet("/admin/media");
    const [q, setQ] = useState("");
    const items = useMemo(() => {
        const all = list.data ?? [];
        const s = q.trim().toLowerCase();
        return s
            ? all.filter((m) => `${m.key} ${m.page} ${m.alt?.en}`.toLowerCase().includes(s))
            : all;
    }, [list.data, q]);

    return (
        <>
            <PageHead
                eyebrow="Site content"
                title="Image slots"
                sub="The fixed photos of the website — page header bands and section pictures. Replace a photo, describe it, and choose what stays in view."
            />
            <div className="mt-5 max-w-md">
                <Field label="Find a slot" htmlFor="m-q">
                    <input
                        id="m-q"
                        type="search"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="doctors, contact, homepage…"
                        className={inputCls}
                    />
                </Field>
            </div>
            {list.error ? <Notice className="mt-4">{list.error.message}</Notice> : null}
            {!list.data ? (
                <div className="mt-6 h-64 animate-pulse rounded-xl bg-paper-2/50" />
            ) : null}
            <ul className="mt-6 grid gap-5 xl:grid-cols-2">
                {items.map((m) => (
                    <li key={m._id}>
                        <SlotCard
                            slot={m}
                            onSaved={(d) =>
                                list.mutate((all) => all.map((x) => (x._id === d._id ? d : x)))
                            }
                        />
                    </li>
                ))}
            </ul>
        </>
    );
}

const L = (v) => ({ en: v?.en ?? "", bn: v?.bn ?? "" });

function SlotCard({ slot, onSaved }) {
    const [src, setSrc] = useState(slot.src);
    const [alt, setAlt] = useState(L(slot.alt));
    const [position, setPosition] = useState(slot.position ?? "center");
    const [overlay, setOverlay] = useState(slot.overlay ?? null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);

    const body = {};
    if (src !== slot.src) body.src = src;
    if (JSON.stringify({ en: alt.en.trim(), bn: alt.bn.trim() }) !== JSON.stringify(L(slot.alt)))
        body.alt = { en: alt.en.trim(), bn: alt.bn.trim() };
    if (position.trim() !== (slot.position ?? "center"))
        body.position = position.trim() || "center";
    if (overlay !== (slot.overlay ?? null)) body.overlay = overlay;
    const dirty = Object.keys(body).length > 0;
    const isHeader = slot.key.startsWith("header.");

    async function save() {
        setBusy(true);
        setError(null);
        try {
            const d = await adminFetch(`/admin/media/${slot._id}`, { method: "PATCH", body });
            onSaved(d);
            setSaved(true);
        } catch (err) {
            setError(Object.values(err.fieldErrors)[0] ?? err.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <article className="space-y-4 rounded-xl border border-line bg-card p-4">
            <header className="flex items-baseline justify-between gap-3">
                <div className="min-w-0">
                    <h2 className="truncate font-medium">{pageLabel(slot.page)}</h2>
                    <p className="font-mono text-[0.74rem] text-ink-3">{slot.key}</p>
                </div>
                {slot.source?.type && slot.source.type !== "own" ? (
                    <span
                        className="rounded-full bg-paper-2 px-2 py-0.5 text-[0.72rem] text-ink-2"
                        title="Stock placeholder — replace with the hospital's own photo"
                    >
                        Stock photo
                    </span>
                ) : null}
            </header>
            <ImageUpload
                id={`m-${slot._id}`}
                folder="media"
                value={src}
                onChange={(v) => {
                    setSaved(false);
                    setSrc(v ?? slot.src);
                }}
                removable={false} // a slot always needs a picture
                query={{ position }}
                aspect="aspect-[3/2]"
                width="w-full"
                imgStyle={{ objectPosition: position }}
                hint="Cropped to 3:2 around the point below when uploaded."
                overlay={
                    isHeader && overlay !== null ? (
                        <span
                            className="absolute inset-0 bg-linear-to-r from-teal-950 to-teal-950/25"
                            style={{ opacity: overlay }}
                            aria-hidden="true"
                        />
                    ) : null
                }
            />
            <PositionPicker
                id={`m-pos-${slot._id}`}
                value={position}
                onChange={(v) => (setSaved(false), setPosition(v))}
            />
            {isHeader ? (
                <Field
                    label={`Darkening behind the title · ${overlay === null ? "default" : `${Math.round(overlay * 100)}%`}`}
                    htmlFor={`m-ov-${slot._id}`}
                    hint="Higher = white heading text stays readable on bright photos."
                >
                    <input
                        id={`m-ov-${slot._id}`}
                        type="range"
                        min={0}
                        max={1}
                        step={0.02}
                        value={overlay ?? 0.8}
                        onChange={(e) => (setSaved(false), setOverlay(Number(e.target.value)))}
                        className="w-64 accent-teal-700"
                    />
                </Field>
            ) : null}
            <LText
                id={`m-alt-${slot._id}`}
                label="Describe the photo"
                value={alt}
                onChange={(v) => (setSaved(false), setAlt(v))}
                maxLength={200}
            />
            {error ? <Notice>{error}</Notice> : null}
            <div className={cn("flex items-center gap-3", !dirty && !saved && "hidden")}>
                <ABtn variant="ink" size="sm" busy={busy} disabled={!dirty} onClick={save}>
                    Save
                </ABtn>
                {dirty ? (
                    <ABtn
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSrc(slot.src);
                            setAlt(L(slot.alt));
                            setPosition(slot.position ?? "center");
                            setOverlay(slot.overlay ?? null);
                        }}
                    >
                        Discard
                    </ABtn>
                ) : (
                    <span className="text-[0.84rem] text-teal-700">Saved.</span>
                )}
            </div>
        </article>
    );
}
