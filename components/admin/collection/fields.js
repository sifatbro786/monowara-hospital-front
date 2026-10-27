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
                    hint={
                        fd.count ? (
                            <>
                                {fd.hint} EN <Counter value={v.en} max={fd.count} /> · বাং{" "}
                                <Counter value={v.bn} max={fd.count} />
                            </>
                        ) : (
                            fd.hint
                        )
                    }
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
                <Field label={fd.label} htmlFor={id} error={err} hint={fd.hint}>
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
        case "number":
            return (
                <Field label={fd.label} htmlFor={id} error={err} hint={fd.hint}>
                    <input
                        id={id}
                        type="number"
                        min={fd.min}
                        max={fd.max}
                        value={v}
                        onChange={(e) => on(e.target.value)}
                        className={cn(inputCls, "w-32")}
                    />
                </Field>
            );
        case "textNull":
            return (
                <Field label={fd.label} htmlFor={id} error={err} hint={fd.hint}>
                    <input
                        id={id}
                        type={fd.inputType ?? "text"}
                        value={v}
                        onChange={(e) => on(e.target.value)}
                        maxLength={fd.max}
                        placeholder={fd.placeholder}
                        className={cn(inputCls, "sm:w-72")}
                    />
                </Field>
            );
        case "ref":
            return <RefSelect fd={fd} id={id} value={v} onChange={on} error={err} />;
        case "ids":
            return <OrderedPicker fd={fd} id={id} value={v} onChange={on} error={err} />;
        case "path":
            return <PathInput fd={fd} id={id} value={v} onChange={on} error={err} />;
        case "treatments":
            return (
                <Repeater
                    label={fd.label}
                    items={v}
                    max={fd.max}
                    onChange={on}
                    addLabel="Add treatment"
                    blank={() => ({ name: { en: "", bn: "" }, summary: { en: "", bn: "" }, image: null, isActive: true })}
                    title={(t) => t.name.en || "New treatment"}
                    muted={(t) => !t.isActive}
                >
                    {(t, i, put) => (
                        <>
                            <LText
                                id={`${id}-${i}-name`}
                                label="Name"
                                required
                                value={t.name}
                                onChange={(name) => put({ name })}
                                maxLength={80}
                                errors={errors}
                                prefix={`${fd.key}.${i}.name`}
                            />
                            <LText
                                id={`${id}-${i}-summary`}
                                label="Summary"
                                multiline
                                rows={2}
                                value={t.summary}
                                onChange={(summary) => put({ summary })}
                                maxLength={300}
                                errors={errors}
                                prefix={`${fd.key}.${i}.summary`}
                            />
                            <ImageUpload
                                id={`${id}-${i}-image`}
                                folder={fd.folder}
                                value={t.image}
                                onChange={(image) => put({ image })}
                                error={errors[`${fd.key}.${i}.image`]}
                                aspect="aspect-[4/3]"
                                width="w-56"
                            />
                            <Toggle
                                id={`${id}-${i}-active`}
                                checked={t.isActive}
                                onChange={(isActive) => put({ isActive })}
                                label="Show on the website"
                            />
                        </>
                    )}
                </Repeater>
            );
        case "pillars":
            return (
                <Repeater
                    label={fd.label}
                    items={v}
                    max={fd.max}
                    onChange={on}
                    addLabel="Add"
                    blank={() => ({ title: { en: "", bn: "" }, body: { en: "", bn: "" } })}
                    title={(p) => p.title.en || "New item"}
                >
                    {(p, i, put) => (
                        <>
                            <LText
                                id={`${id}-${i}-title`}
                                label="Title"
                                value={p.title}
                                onChange={(title) => put({ title })}
                                maxLength={120}
                                errors={errors}
                                prefix={`${fd.key}.${i}.title`}
                            />
                            <LText
                                id={`${id}-${i}-body`}
                                label="Text"
                                multiline
                                rows={3}
                                value={p.body}
                                onChange={(body) => put({ body })}
                                maxLength={600}
                                errors={errors}
                                prefix={`${fd.key}.${i}.body`}
                            />
                        </>
                    )}
                </Repeater>
            );
        case "sections":
            return <SectionsEditor fd={fd} id={id} value={v} onChange={on} errors={errors} />;
        default:
            return null;
    }
}

/** Repeating cards (treatments, pillars, sections) with move / remove / add. */
function Repeater({ label, items, max, onChange, addLabel, blank, title, muted, children }) {
    const move = (i, d) => {
        const next = [...items];
        [next[i], next[i + d]] = [next[i + d], next[i]];
        onChange(next);
    };
    const btn =
        "grid size-8 place-items-center rounded-lg text-ink-3 hover:bg-ink/5 hover:text-ink disabled:opacity-30";
    return (
        <fieldset>
            <legend className="mb-2 text-[0.8rem] font-semibold text-ink-2">
                {label}{" "}
                <span className="font-normal text-ink-3">
                    · {items.length}/{max}
                </span>
            </legend>
            <ol className="space-y-3">
                {items.map((it, i) => (
                    <li key={i} className="rounded-xl border border-line bg-card">
                        <div className="flex items-center gap-2 border-b border-line-soft py-1.5 pr-1.5 pl-4">
                            <span className="text-[0.75rem] text-ink-3 tabular-nums">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <span
                                className={cn(
                                    "min-w-0 flex-1 truncate text-[0.9rem] font-medium",
                                    muted?.(it) && "text-ink-3",
                                )}
                            >
                                {title(it)}
                            </span>
                            <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className={btn} aria-label={`Move ${i + 1} up`}>
                                <AIcon name="next" className="-rotate-90" />
                            </button>
                            <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} className={btn} aria-label={`Move ${i + 1} down`}>
                                <AIcon name="next" className="rotate-90" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onChange(items.filter((_, k) => k !== i))}
                                className={btn}
                                aria-label={`Remove ${i + 1}`}
                            >
                                <AIcon name="close" />
                            </button>
                        </div>
                        <div className="space-y-4 p-4">
                            {children(it, i, (patch) =>
                                onChange(items.map((x, k) => (k === i ? { ...x, ...patch } : x))),
                            )}
                        </div>
                    </li>
                ))}
            </ol>
            {items.length < max ? (
                <button
                    type="button"
                    onClick={() => onChange([...items, blank()])}
                    className="mt-3 inline-flex h-8 items-center gap-1 text-[0.84rem] text-teal-800 hover:underline"
                >
                    <AIcon name="plus" /> {addLabel}
                </button>
            ) : null}
        </fieldset>
    );
}

/** Page / article sections. variant "legal" = paragraphs separated by a blank line. */
function SectionsEditor({ fd, id, value, onChange, errors }) {
    const legal = fd.variant === "legal";
    const site = fd.variant === "site";
    return (
        <Repeater
            label={fd.label}
            items={value}
            max={fd.max}
            onChange={onChange}
            addLabel="Add section"
            blank={() => ({
                id: "",
                heading: { en: "", bn: "" },
                body: { en: "", bn: "" },
                ...(site && { points: null }),
            })}
            title={(s) => (
                <>
                    {s.heading.en || "New section"}
                    {s.id ? <span className="ml-2 font-normal text-ink-3">#{s.id}</span> : null}
                </>
            )}
        >
            {(s, i, put) => (
                <>
                    <LText
                        id={`${id}-${i}-heading`}
                        label="Heading"
                        value={s.heading}
                        onChange={(heading) => put({ heading })}
                        maxLength={200}
                        errors={errors}
                        prefix={`${fd.key}.${i}.heading`}
                    />
                    <LText
                        id={`${id}-${i}-body`}
                        label="Text"
                        multiline
                        rows={legal ? 8 : 5}
                        value={s.body}
                        onChange={(body) => put({ body })}
                        maxLength={legal ? 30000 : fd.bodyMax}
                        hint="Leave a blank line between paragraphs."
                        errors={errors}
                        prefix={`${fd.key}.${i}.body`}
                    />
                    {site ? (
                        s.points ? (
                            <ListEditor
                                id={`${id}-${i}-points`}
                                label="Bullet points"
                                items={s.points}
                                onChange={(points) => put({ points })}
                                max={20}
                                errors={errors}
                                prefix={`${fd.key}.${i}.points`}
                            />
                        ) : (
                            <button
                                type="button"
                                onClick={() => put({ points: [{ en: "", bn: "" }] })}
                                className="inline-flex h-8 items-center gap-1 text-[0.84rem] text-teal-800 hover:underline"
                            >
                                <AIcon name="plus" /> Add bullet points
                            </button>
                        )
                    ) : null}
                    {site && s.confirm !== undefined ? (
                        <Toggle
                            id={`${id}-${i}-confirm`}
                            checked={!s.confirm}
                            onChange={(ok) => put({ confirm: !ok })}
                            label="Confirmed by the hospital"
                            sub="Off = the site shows these details as “to be confirmed”."
                        />
                    ) : null}
                    {site && s.link ? (
                        <p className="text-[0.82rem] text-ink-3">
                            Ends with a link: “{s.link.label?.en}” → {s.link.href}
                        </p>
                    ) : null}
                </>
            )}
        </Repeater>
    );
}

const optionLabel = (o) => o.name?.en ?? o.title?.en ?? o.slug ?? o._id;

/** Options (doctors / articles) from an admin "options" endpoint. */
function useOptions(fd) {
    const { data, error } = useAdminGet(fd.source);
    const items = (fd.from ? data?.[fd.from] : data) ?? [];
    return { items, loading: !data && !error, error };
}

/** Single reference, e.g. an article's doctor byline. */
function RefSelect({ fd, id, value, onChange, error }) {
    const { items } = useOptions(fd);
    return (
        <Field label={fd.label} htmlFor={id} error={error} hint={fd.hint}>
            <select
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(inputCls, "sm:w-96")}
            >
                <option value="">— None —</option>
                {value && !items.some((o) => o._id === value) ? (
                    <option value={value}>{value}</option>
                ) : null}
                {items.map((o) => (
                    <option key={o._id} value={o._id}>
                        {optionLabel(o)}
                        {o.isActive === false ? " (hidden)" : ""}
                    </option>
                ))}
            </select>
        </Field>
    );
}

/** Ordered multi-pick (programme team, reading list): the order is the order on the website. */
function OrderedPicker({ fd, id, value, onChange, error }) {
    const { items, loading } = useOptions(fd);
    const by = fd.by ?? "_id";
    const map = new Map(items.map((o) => [o[by], o]));
    const left = items.filter((o) => !value.includes(o[by]));
    const move = (i, d) => {
        const next = [...value];
        [next[i], next[i + d]] = [next[i + d], next[i]];
        onChange(next);
    };
    const btn =
        "grid size-8 place-items-center rounded-lg text-ink-3 hover:bg-ink/5 hover:text-ink disabled:opacity-30";
    return (
        <fieldset>
            <legend className="mb-1.5 text-[0.8rem] font-semibold text-ink-2">
                {fd.label}{" "}
                <span className="font-normal text-ink-3">
                    · {value.length}/{fd.max}
                </span>
            </legend>
            {value.length ? (
                <ol className="divide-y divide-line-soft rounded-xl border border-line bg-card">
                    {value.map((k, i) => {
                        const o = map.get(k);
                        return (
                            <li key={k} className="flex items-center gap-3 py-1.5 pr-1.5 pl-4">
                                <span className="text-[0.75rem] text-ink-3 tabular-nums">{i + 1}</span>
                                <span className="min-w-0 flex-1">
                                    <span className={cn("block truncate text-[0.9rem]", !o && "text-emergency-ink")}>
                                        {o ? optionLabel(o) : loading ? k : `${k} (no longer exists)`}
                                        {o?.isActive === false ? <span className="text-ink-3"> (hidden)</span> : null}
                                    </span>
                                    {o?.designation?.en ? (
                                        <span className="block truncate text-[0.78rem] text-ink-3">{o.designation.en}</span>
                                    ) : null}
                                </span>
                                <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className={btn} aria-label={`Move ${i + 1} up`}>
                                    <AIcon name="next" className="-rotate-90" />
                                </button>
                                <button type="button" disabled={i === value.length - 1} onClick={() => move(i, 1)} className={btn} aria-label={`Move ${i + 1} down`}>
                                    <AIcon name="next" className="rotate-90" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onChange(value.filter((x) => x !== k))}
                                    className={btn}
                                    aria-label={`Remove ${o ? optionLabel(o) : k}`}
                                >
                                    <AIcon name="close" />
                                </button>
                            </li>
                        );
                    })}
                </ol>
            ) : (
                <p className="rounded-xl border border-dashed border-line px-4 py-3 text-[0.86rem] text-ink-3">
                    None yet.
                </p>
            )}
            {value.length < fd.max ? (
                <select
                    id={id}
                    value=""
                    onChange={(e) => e.target.value && onChange([...value, e.target.value])}
                    className={cn(inputCls, "mt-2 sm:w-96")}
                    aria-label={`Add to ${fd.label}`}
                >
                    <option value="">{loading ? "Loading…" : `+ ${fd.addLabel ?? "Add"}…`}</option>
                    {left.map((o) => (
                        <option key={o[by]} value={o[by]}>
                            {optionLabel(o)}
                            {o.isActive === false ? " (hidden)" : ""}
                        </option>
                    ))}
                </select>
            ) : null}
            {error ? <p className="mt-1 text-[0.8rem] text-emergency-ink">{error}</p> : null}
        </fieldset>
    );
}

/** Site path with suggestions from GET /admin/seo/paths. */
function PathInput({ fd, id, value, onChange, error }) {
    const { data } = useAdminGet(fd.source);
    const match = data?.find((p) => p.path === value.trim().toLowerCase());
    return (
        <Field
            label={fd.label}
            htmlFor={id}
            error={error}
            hint={match ? `→ ${match.label}` : "Start typing — e.g. /doctors or /departments/cardiology. Without /en or /bn."}
        >
            <input
                id={id}
                list={`${id}-list`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                maxLength={200}
                spellCheck={false}
                placeholder="/"
                className={cn(inputCls, "sm:w-96")}
            />
            <datalist id={`${id}-list`}>
                {(data ?? []).map((p) => (
                    <option key={p.path} value={p.path}>
                        {p.label}
                    </option>
                ))}
            </datalist>
        </Field>
    );
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
