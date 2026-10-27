"use client";

import { Emphasis } from "@/components/ui/Emphasis";
import { fmtDateTime } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { useAdminGet } from "../hooks";
import { ImageUpload } from "../ImageUpload";
import { AIcon, Field, LText, Toggle, inputCls } from "../ui";
import { youtubeId } from "./form";

/** Repeating EN/বাংলা rows with add / remove / move. */
export function ListEditor({ id, label, items, onChange, max, placeholder, errors = {}, prefix }) {
    const move = (i, d) => {
        const next = [...items];
        [next[i], next[i + d]] = [next[i + d], next[i]];
        onChange(next);
    };
    return (
        <fieldset>
            <legend className="mb-1.5 text-[0.8rem] font-semibold text-ink-2">
                {label}{" "}
                <span className="font-normal text-ink-3">
                    · {items.length}/{max}
                </span>
            </legend>
            <ol className="space-y-2">
                {items.map((it, i) => {
                    const err = errors[`${prefix}.${i}.en`] || errors[`${prefix}.${i}.bn`];
                    return (
                        <li
                            key={i}
                            className="grid grid-cols-[1.5rem_minmax(0,1fr)_auto] items-start gap-2"
                        >
                            <span className="pt-2.5 text-right text-[0.75rem] text-ink-3 tabular-nums">
                                {i + 1}
                            </span>
                            <div className="grid gap-2 sm:grid-cols-2">
                                <input
                                    id={i === 0 ? id : undefined}
                                    lang="en"
                                    value={it.en}
                                    placeholder={placeholder}
                                    maxLength={240}
                                    onChange={(e) =>
                                        onChange(
                                            items.map((x, k) =>
                                                k === i ? { ...x, en: e.target.value } : x,
                                            ),
                                        )
                                    }
                                    aria-label={`${label} ${i + 1} (English)`}
                                    aria-invalid={err ? true : undefined}
                                    className={inputCls}
                                />
                                <input
                                    lang="bn"
                                    value={it.bn}
                                    maxLength={240}
                                    placeholder="বাংলা"
                                    onChange={(e) =>
                                        onChange(
                                            items.map((x, k) =>
                                                k === i ? { ...x, bn: e.target.value } : x,
                                            ),
                                        )
                                    }
                                    aria-label={`${label} ${i + 1} (Bangla)`}
                                    className={inputCls}
                                />
                            </div>
                            <div className="flex">
                                <button
                                    type="button"
                                    disabled={i === 0}
                                    onClick={() => move(i, -1)}
                                    className="grid size-9 place-items-center rounded-lg text-ink-3 hover:bg-ink/5 disabled:opacity-30"
                                    aria-label={`Move ${i + 1} up`}
                                >
                                    <AIcon name="next" className="-rotate-90" />
                                </button>
                                <button
                                    type="button"
                                    disabled={i === items.length - 1}
                                    onClick={() => move(i, 1)}
                                    className="grid size-9 place-items-center rounded-lg text-ink-3 hover:bg-ink/5 disabled:opacity-30"
                                    aria-label={`Move ${i + 1} down`}
                                >
                                    <AIcon name="next" className="rotate-90" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onChange(items.filter((_, k) => k !== i))}
                                    className="grid size-9 place-items-center rounded-lg text-ink-3 hover:bg-ink/5 hover:text-ink"
                                    aria-label={`Remove ${i + 1}`}
                                >
                                    <AIcon name="close" />
                                </button>
                            </div>
                            {err ? (
                                <p className="col-start-2 text-[0.8rem] text-emergency-ink">
                                    {err}
                                </p>
                            ) : null}
                        </li>
                    );
                })}
            </ol>
            {items.length < max ? (
                <button
                    type="button"
                    onClick={() => onChange([...items, { en: "", bn: "" }])}
                    className="mt-2 ml-8 inline-flex h-8 items-center gap-1 text-[0.84rem] text-teal-800 hover:underline"
                >
                    <AIcon name="plus" /> Add
                </button>
            ) : null}
        </fieldset>
    );
}

function Counter({ value, max }) {
    const n = value.length;
    return (
        <span className={cn("tabular-nums", n > max ? "text-emergency-ink" : "text-ink-3")}>
            {n}/{max}
        </span>
    );
}

/** Department picker — multi (packages) or single (jobs). Hidden departments are marked. */
function DepartmentPicker({ id, label, multi, value, onChange, error }) {
    const { data } = useAdminGet("/admin/departments", { limit: 100 });
    const items = data?.items ?? [];
    if (!multi) {
        return (
            <Field label={label} htmlFor={id} error={error}>
                <select
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={inputCls}
                >
                    <option value="">— None —</option>
                    {items.map((d) => (
                        <option key={d._id} value={d._id}>
                            {d.name.en}
                            {d.isActive === false ? " (hidden)" : ""}
                        </option>
                    ))}
                </select>
            </Field>
        );
    }
    const set = new Set(value);
    return (
        <fieldset>
            <legend className="mb-1.5 text-[0.8rem] font-semibold text-ink-2">
                {label} <span className="font-normal text-ink-3">· {value.length} selected</span>
            </legend>
            {!data ? <div className="h-24 animate-pulse rounded-lg bg-paper-2" /> : null}
            <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((d) => (
                    <label
                        key={d._id}
                        className={cn(
                            "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-[0.88rem] transition-colors",
                            set.has(d._id)
                                ? "border-teal-700 bg-teal-50"
                                : "border-line hover:border-ink/30",
                        )}
                    >
                        <input
                            type="checkbox"
                            checked={set.has(d._id)}
                            onChange={(e) =>
                                onChange(
                                    e.target.checked
                                        ? [...value, d._id]
                                        : value.filter((x) => x !== d._id),
                                )
                            }
                            className="size-4 accent-teal-700"
                        />
                        <span className="min-w-0 truncate">
                            {d.name.en}
                            {d.isActive === false ? (
                                <span className="text-ink-3"> (hidden)</span>
                            ) : null}
                        </span>
                    </label>
                ))}
            </div>
            {error ? <p className="mt-1 text-[0.8rem] text-emergency-ink">{error}</p> : null}
        </fieldset>
    );
}

const POSITIONS = [
    ["left center", "Left"],
    ["center", "Centre"],
    ["right center", "Right"],
    ["center top", "Top"],
    ["center bottom", "Bottom"],
];

/** Focal point for object-position: presets + free "x% y%". */
export function PositionPicker({ id, value, onChange }) {
    return (
        <Field
            label="Keep in view when cropped"
            htmlFor={id}
            hint="Phones crop the sides — pick where the subject is. Fine-tune with percentages, e.g. 70% 40%."
        >
            <div className="flex flex-wrap items-center gap-1.5">
                {POSITIONS.map(([v, l]) => (
                    <button
                        key={v}
                        type="button"
                        onClick={() => onChange(v)}
                        aria-pressed={value === v}
                        className={cn(
                            "h-8 rounded-full border px-3 text-[0.82rem]",
                            value === v
                                ? "border-ink bg-ink text-paper"
                                : "border-line text-ink-2 hover:border-ink/40",
                        )}
                    >
                        {l}
                    </button>
                ))}
                <input
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    maxLength={30}
                    className={cn(inputCls, "h-8 min-h-8 max-w-40 py-1")}
                    aria-label="Custom position"
                />
            </div>
        </Field>
    );
}

/** Renders one field from a collection config. */
export function FieldInput({ fd, value: v, set, errors, form }) {
    const id = `f-${fd.key}`;
    const on = (val) => set({ [fd.key]: val });
    const err = errors[fd.key];
    switch (fd.type) {
        case "L":
        case "Lopt":
            return (
                <LText
                    id={id}
                    label={fd.label}
                    required={fd.required}
                    value={v}
                    onChange={on}
                    multiline={fd.multiline}
                    rows={fd.rows}
                    maxLength={fd.max}
                    hint={fd.hint}
                    errors={errors}
                    prefix={fd.key}
                />
            );
        case "list":
            return (
                <ListEditor
                    id={id}
                    label={fd.label}
                    items={v}
                    onChange={on}
                    max={fd.max}
                    placeholder={fd.placeholder}
                    errors={errors}
                    prefix={fd.key}
                />
            );
        case "bool":
            return <Toggle id={id} checked={v} onChange={on} label={fd.label} sub={fd.sub} />;
        case "image":
            return (
                <ImageUpload
                    id={id}
                    folder={fd.folder}
                    value={v}
                    onChange={on}
                    error={err}
                    aspect="aspect-[3/2]"
                    width="w-80"
                />
            );
        case "heroImage":
            return (
                <div className="space-y-5">
                    <ImageUpload
                        id={id}
                        folder={fd.folder}
                        value={v.src}
                        onChange={(src) => on({ ...v, src })}
                        error={errors[`${fd.key}.src`]}
                        aspect="aspect-[16/7]"
                        width="w-[34rem]"
                        imgStyle={{ objectPosition: v.position }}
                        overlay={<HeroOverlay form={form} />}
                    />
                    <PositionPicker
                        id={`${id}-pos`}
                        value={v.position}
                        onChange={(position) => on({ ...v, position })}
                    />
                    <LText
                        id={`${id}-alt`}
                        label="Describe the photo (for screen readers & Google)"
                        value={v.alt}
                        onChange={(alt) => on({ ...v, alt })}
                        maxLength={200}
                        errors={errors}
                        prefix={`${fd.key}.alt`}
                    />
                </div>
            );
        case "seo":
            return (
                <div className="space-y-4">
                    <LText
                        id="f-seo-title"
                        label="Title in Google"
                        value={v.title}
                        onChange={(title) => on({ ...v, title })}
                        maxLength={70}
                        errors={errors}
                        prefix="seo.title"
                        hint={
                            <>
                                About 60 characters. EN <Counter value={v.title.en} max={60} /> ·
                                বাং <Counter value={v.title.bn} max={60} />
                            </>
                        }
                    />
                    <LText
                        id="f-seo-desc"
                        label="Description in Google"
                        multiline
                        rows={2}
                        value={v.description}
                        onChange={(description) => on({ ...v, description })}
                        maxLength={170}
                        errors={errors}
                        prefix="seo.description"
                        hint={
                            <>
                                About 155 characters. EN{" "}
                                <Counter value={v.description.en} max={155} /> · বাং{" "}
                                <Counter value={v.description.bn} max={155} />
                            </>
                        }
                    />
                </div>
            );
        case "departments":
            return (
                <DepartmentPicker
                    id={id}
                    label={fd.label}
                    multi
                    value={v}
                    onChange={on}
                    error={err}
                />
            );
        case "department":
            return (
                <DepartmentPicker id={id} label={fd.label} value={v} onChange={on} error={err} />
            );
        case "select":
            return (
                <Field label={fd.label} htmlFor={id} error={err}>
                    <select
                        id={id}
                        value={v}
                        onChange={(e) => on(e.target.value)}
                        className={cn(inputCls, "sm:w-72")}
                    >
                        {!v ? <option value="">Choose…</option> : null}
                        {fd.options.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                </Field>
            );
        case "text":
            return (
                <Field label={fd.label} htmlFor={id} error={err} hint={fd.hint}>
                    <input
                        id={id}
                        value={v}
                        onChange={(e) => on(e.target.value)}
                        maxLength={fd.max}
                        placeholder={fd.placeholder}
                        className={cn(inputCls, "sm:w-72")}
                    />
                </Field>
            );
        case "href":
            return (
                <Field label={fd.label} htmlFor={id} error={err} hint={fd.hint}>
                    <div className="flex items-center gap-2">
                        <input
                            id={id}
                            value={v}
                            onChange={(e) => on(e.target.value)}
                            maxLength={200}
                            placeholder="/departments/…"
                            spellCheck={false}
                            className={cn(inputCls, "sm:w-96")}
                        />
                        {v.startsWith("/") ? (
                            <a
                                href={v}
                                target="_blank"
                                rel="noopener"
                                className="text-[0.84rem] text-teal-800 hover:underline"
                            >
                                Open <AIcon name="external" className="inline" />
                            </a>
                        ) : null}
                    </div>
                </Field>
            );
        case "date":
            return (
                <Field label={fd.label} htmlFor={id} error={err}>
                    <div className="flex items-center gap-2">
                        <input
                            id={id}
                            type="date"
                            value={v}
                            onChange={(e) => on(e.target.value)}
                            className={cn(inputCls, "w-48")}
                        />
                        {v ? (
                            <button
                                type="button"
                                onClick={() => on("")}
                                className="text-[0.84rem] text-ink-3 hover:text-ink"
                            >
                                Clear
                            </button>
                        ) : null}
                    </div>
                </Field>
            );
        case "youtube": {
            const yid = youtubeId(v);
            const ok = /^[\w-]{11}$/.test(yid);
            return (
                <Field
                    label={fd.label}
                    htmlFor={id}
                    error={
                        err ||
                        (v && !ok ? "Paste a YouTube link or the 11-character video id." : null)
                    }
                    hint="Paste the link from YouTube's Share button."
                >
                    <div className="flex flex-wrap items-center gap-4">
                        <input
                            id={id}
                            value={v}
                            onChange={(e) => on(e.target.value)}
                            placeholder="https://youtu.be/…"
                            spellCheck={false}
                            className={cn(inputCls, "sm:w-96")}
                        />
                        {ok ? (
                            // eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnail preview
                            <img
                                src={`https://i.ytimg.com/vi/${yid}/mqdefault.jpg`}
                                alt=""
                                width={160}
                                height={90}
                                className="rounded-lg border border-line"
                            />
                        ) : null}
                    </div>
                </Field>
            );
        }
        case "consent":
            return (
                <div className="space-y-4 rounded-xl border border-line-soft bg-paper/60 p-4">
                    <Toggle
                        id={id}
                        checked={v.confirmed}
                        onChange={(confirmed) => on({ ...v, confirmed })}
                        label="We have the patient's written consent to publish this"
                        sub="Keep the signed form on file. Without this, the story never appears on the website."
                    />
                    {v.confirmed ? (
                        <Field
                            label="Date consent was given"
                            htmlFor={`${id}-date`}
                            hint="Empty = today."
                        >
                            <input
                                id={`${id}-date`}
                                type="date"
                                value={v.date}
                                onChange={(e) => on({ ...v, date: e.target.value })}
                                className={cn(inputCls, "w-48")}
                            />
                        </Field>
                    ) : null}
                    {v.recordedBy ? (
                        <p className="text-[0.8rem] text-ink-3">
                            Recorded by {v.recordedBy}
                            {v.date
                                ? ` · ${fmtDateTime(`${v.date}T12:00:00+06:00`).split(",")[0]}`
                                : ""}
                        </p>
                    ) : null}
                </div>
            );
        default:
            return null;
    }
}

/** Live hero preview over the uploaded photo (EN copy), styled like the site's slide. */
function HeroOverlay({ form }) {
    if (!form) return null;
    return (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-linear-to-t from-teal-950/85 via-teal-950/35 to-transparent p-4 text-white">
            {form.eyebrow?.en ? (
                <p className="text-[0.6rem] font-semibold tracking-[0.14em] uppercase opacity-80">
                    {form.eyebrow.en}
                </p>
            ) : null}
            {form.title?.en ? (
                <p className="mt-1 max-w-[80%] text-[1.05rem] leading-tight font-medium">
                    <Emphasis text={form.title.en} className="text-teal-200!" />
                </p>
            ) : null}
            {form.subtitle?.en ? (
                <p className="mt-1 line-clamp-2 max-w-[75%] text-[0.65rem] opacity-85">
                    {form.subtitle.en}
                </p>
            ) : null}
        </div>
    );
}
