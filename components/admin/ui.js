"use client";

import {
    LuArrowRight,
    LuBriefcase,
    LuBuilding2,
    LuCalendarCheck,
    LuCheck,
    LuChevronLeft,
    LuChevronRight,
    LuCircleAlert,
    LuCopy,
    LuDownload,
    LuExternalLink,
    LuEye,
    LuEyeOff,
    LuFileText,
    LuHistory,
    LuHouse,
    LuImage,
    LuInbox,
    LuKeyRound,
    LuLayoutDashboard,
    LuLogOut,
    LuMail,
    LuMenu,
    LuMessageCircle,
    LuMessageCircleQuestion,
    LuPackage,
    LuPencil,
    LuPhone,
    LuPlus,
    LuQuote,
    LuRefreshCw,
    LuSearch,
    LuSettings,
    LuSparkles,
    LuStethoscope,
    LuUsers,
    LuX,
} from "react-icons/lu";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { STATUS_TONE } from "@/lib/admin/config";

const ICONS = {
    home: LuHouse,
    calendar: LuCalendarCheck,
    inbox: LuInbox,
    briefcase: LuBriefcase,
    stethoscope: LuStethoscope,
    building: LuBuilding2,
    package: LuPackage,
    sparkle: LuSparkles,
    chat: LuMessageCircleQuestion,
    image: LuImage,
    layout: LuLayoutDashboard,
    file: LuFileText,
    quote: LuQuote,
    search: LuSearch,
    settings: LuSettings,
    users: LuUsers,
    history: LuHistory,
    logout: LuLogOut,
    menu: LuMenu,
    close: LuX,
    download: LuDownload,
    refresh: LuRefreshCw,
    phone: LuPhone,
    mail: LuMail,
    whatsapp: LuMessageCircle,
    prev: LuChevronLeft,
    next: LuChevronRight,
    key: LuKeyRound,
    copy: LuCopy,
    check: LuCheck,
    plus: LuPlus,
    edit: LuPencil,
    external: LuExternalLink,
    alert: LuCircleAlert,
    arrow: LuArrowRight,
    eye: LuEye,
    eyeOff: LuEyeOff,
};

export function AIcon({ name, className, ...rest }) {
    const C = ICONS[name];
    return C ? (
        <C
            aria-hidden="true"
            className={cn("size-[1.05em] shrink-0", className)}
            strokeWidth={1.75}
            {...rest}
        />
    ) : null;
}

// ── Buttons ────────────────────────────────────────────────────────────────────────────────────────
const BTN = {
    primary: "bg-teal-800 text-white hover:bg-teal-900",
    ink: "bg-ink text-paper hover:bg-teal-950",
    outline: "border border-line bg-card text-ink hover:border-ink/40",
    ghost: "text-ink-2 hover:bg-ink/5 hover:text-ink",
    danger: "border border-emergency/40 bg-card text-emergency-ink hover:bg-emergency-soft",
};
const BTN_SIZE = {
    sm: "h-8 px-3 text-[0.82rem]",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-5 text-[0.95rem]",
};

export function abtn({ variant = "outline", size = "md", className } = {}) {
    return cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        BTN[variant],
        BTN_SIZE[size],
        className,
    );
}

export function ABtn({ variant, size, className, busy, children, type = "button", ...rest }) {
    return (
        <button
            type={type}
            className={abtn({ variant, size, className })}
            disabled={busy || rest.disabled}
            {...rest}
        >
            {busy ? <Spinner /> : null}
            {children}
        </button>
    );
}

export function Spinner({ className }) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                "inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent",
                className,
            )}
        />
    );
}

// ── Form fields ───────────────────────────────────────────────────────────────────────────────────
export const inputCls =
    "min-h-10 w-full rounded-lg border border-line bg-card px-3 py-2 text-[0.92rem] text-ink placeholder:text-ink-3/70 " +
    "focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/15 disabled:bg-paper-2 disabled:text-ink-3 " +
    "aria-[invalid=true]:border-emergency";

export function Field({ label, hint, error, htmlFor, children, className }) {
    return (
        <div className={cn("space-y-1.5", className)}>
            {label ? (
                <label htmlFor={htmlFor} className="block text-[0.8rem] font-semibold text-ink-2">
                    {label}
                </label>
            ) : null}
            {children}
            {error ? (
                <p className="text-[0.8rem] text-emergency-ink" role="alert">
                    {error}
                </p>
            ) : hint ? (
                <p className="text-[0.78rem] text-ink-3">{hint}</p>
            ) : null}
        </div>
    );
}

export function PasswordInput({
    id,
    value,
    onChange,
    autoComplete = "current-password",
    invalid,
    ...rest
}) {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <input
                id={id}
                type={show ? "text" : "password"}
                value={value}
                onChange={onChange}
                autoComplete={autoComplete}
                aria-invalid={invalid || undefined}
                className={cn(inputCls, "pr-11")}
                spellCheck={false}
                {...rest}
            />
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute inset-y-0 right-0 grid w-10 place-items-center text-ink-3 hover:text-ink"
                aria-label={show ? "Hide password" : "Show password"}
            >
                <AIcon name={show ? "eyeOff" : "eye"} />
            </button>
        </div>
    );
}

// ── Status + feedback ─────────────────────────────────────────────────────────────────────────────
const TONES = {
    fresh: "bg-teal-800 text-white",
    good: "bg-teal-50 text-teal-800 ring-1 ring-inset ring-teal-700/20",
    done: "bg-paper-2 text-ink-2",
    muted: "bg-transparent text-ink-3 ring-1 ring-inset ring-line",
    bad: "bg-emergency-soft text-emergency-ink",
};

export function StatusChip({ status, label, className }) {
    return (
        <span
            className={cn(
                "inline-flex h-6 items-center rounded-full px-2.5 text-[0.74rem] font-semibold tracking-wide whitespace-nowrap",
                TONES[STATUS_TONE[status] ?? "muted"],
                className,
            )}
        >
            {label ?? status}
        </span>
    );
}

export function Notice({ tone = "error", children, className }) {
    return (
        <div
            role={tone === "error" ? "alert" : "status"}
            className={cn(
                "flex items-start gap-2.5 rounded-lg px-3.5 py-2.5 text-[0.88rem]",
                tone === "error"
                    ? "bg-emergency-soft text-emergency-ink"
                    : "bg-teal-50 text-teal-900",
                className,
            )}
        >
            <AIcon name={tone === "error" ? "alert" : "check"} className="mt-0.5" />
            <div className="min-w-0">{children}</div>
        </div>
    );
}

export function Empty({ title, children }) {
    return (
        <div className="px-6 py-14 text-center">
            <p className="font-medium text-ink">{title}</p>
            {children ? (
                <p className="mx-auto mt-1.5 max-w-md text-[0.88rem] text-ink-3">{children}</p>
            ) : null}
        </div>
    );
}

/** Page heading: small numbered eyebrow + title, actions on the right. */
export function PageHead({ eyebrow, title, children, sub }) {
    return (
        <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-line pb-5">
            <div className="min-w-0">
                {eyebrow ? (
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-teal-700">
                        {eyebrow}
                    </p>
                ) : null}
                <h1 className="mt-1 text-[1.65rem] leading-tight font-medium tracking-[-0.02em]">
                    {title}
                </h1>
                {sub ? <p className="mt-1 text-[0.9rem] text-ink-3">{sub}</p> : null}
            </div>
            {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
        </header>
    );
}

export function Pager({ page, limit, total, onPage }) {
    const pages = Math.max(1, Math.ceil(total / limit));
    if (total <= limit) return null;
    const from = (page - 1) * limit + 1;
    const to = Math.min(total, page * limit);
    return (
        <nav
            className="flex items-center justify-between gap-4 border-t border-line px-4 py-3 text-[0.85rem] text-ink-3"
            aria-label="Pages"
        >
            <span>
                {from}–{to} of {total}
            </span>
            <div className="flex items-center gap-1">
                <ABtn
                    size="sm"
                    variant="ghost"
                    onClick={() => onPage(page - 1)}
                    disabled={page <= 1}
                    aria-label="Previous page"
                >
                    <AIcon name="prev" />
                </ABtn>
                <span className="px-2 tabular-nums">
                    {page} / {pages}
                </span>
                <ABtn
                    size="sm"
                    variant="ghost"
                    onClick={() => onPage(page + 1)}
                    disabled={page >= pages}
                    aria-label="Next page"
                >
                    <AIcon name="next" />
                </ABtn>
            </div>
        </nav>
    );
}

export function CopyButton({ text, label = "Copy" }) {
    const [done, setDone] = useState(false);
    return (
        <ABtn
            size="sm"
            variant="outline"
            onClick={async () => {
                try {
                    await navigator.clipboard.writeText(text);
                    setDone(true);
                    setTimeout(() => setDone(false), 1500);
                } catch {
                    /* clipboard blocked — the text is visible to select */
                }
            }}
        >
            <AIcon name={done ? "check" : "copy"} />
            {done ? "Copied" : label}
        </ABtn>
    );
}

/** Label/value list for detail panels. */
export function Facts({ rows }) {
    return (
        <dl className="divide-y divide-line-soft border-y border-line-soft">
            {rows
                .filter(([, v]) => v !== undefined && v !== null && v !== "")
                .map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 py-2.5 text-[0.9rem]">
                        <dt className="text-ink-3">{k}</dt>
                        <dd className="min-w-0 wrap-break-word text-ink">{v}</dd>
                    </div>
                ))}
        </dl>
    );
}

/**
 * Bilingual text: English + বাংলা side by side (stacked on phones). value = { en, bn }.
 * `errors` uses the API's dotted paths: { "name.en": "…" } → pass prefix "name".
 */
export function LText({
    id,
    label,
    hint,
    value,
    onChange,
    required,
    multiline,
    rows = 3,
    maxLength,
    errors = {},
    prefix,
}) {
    const v = value ?? { en: "", bn: "" };
    const Tag = multiline ? "textarea" : "input";
    const errEn = prefix ? (errors[`${prefix}.en`] ?? errors[prefix]) : null;
    const errBn = prefix ? errors[`${prefix}.bn`] : null;
    return (
        <fieldset className="space-y-1.5">
            <legend className="mb-1.5 text-[0.8rem] font-semibold text-ink-2">
                {label}
                {required ? <span className="text-emergency-ink"> *</span> : null}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
                {["en", "bn"].map((l) => (
                    <div key={l} className="relative">
                        <span className="pointer-events-none absolute top-2 right-2.5 text-[0.68rem] font-semibold tracking-wider text-ink-3/80 uppercase">
                            {l === "en" ? "EN" : "বাং"}
                        </span>
                        <Tag
                            id={l === "en" ? id : `${id}-bn`}
                            lang={l}
                            rows={multiline ? rows : undefined}
                            maxLength={maxLength}
                            value={v[l] ?? ""}
                            onChange={(e) => onChange({ ...v, [l]: e.target.value })}
                            aria-label={`${label} (${l === "en" ? "English" : "Bangla"})`}
                            aria-invalid={(l === "en" ? errEn : errBn) ? true : undefined}
                            className={cn(inputCls, "pr-10")}
                        />
                    </div>
                ))}
            </div>
            {errEn || errBn ? (
                <p className="text-[0.8rem] text-emergency-ink" role="alert">
                    {errEn || errBn}
                </p>
            ) : hint ? (
                <p className="text-[0.78rem] text-ink-3">{hint}</p>
            ) : null}
        </fieldset>
    );
}

/** Numbered editorial section for long forms. */
export function FormSection({ n, title, sub, children, aside }) {
    return (
        <section className="grid gap-x-10 gap-y-4 border-t border-line pt-7 lg:grid-cols-[14rem_minmax(0,1fr)]">
            <header>
                <p className="text-[0.75rem] font-semibold text-teal-700 tabular-nums">
                    {String(n).padStart(2, "0")}
                </p>
                <h2 className="mt-0.5 text-[1.1rem] font-medium">{title}</h2>
                {sub ? <p className="mt-1 text-[0.84rem] text-ink-3">{sub}</p> : null}
                {aside}
            </header>
            <div className="min-w-0 space-y-5">{children}</div>
        </section>
    );
}

export function Toggle({ id, checked, onChange, label, sub, disabled }) {
    return (
        <label
            htmlFor={id}
            className={cn(
                "flex cursor-pointer items-start gap-3",
                disabled && "cursor-not-allowed opacity-60",
            )}
        >
            <span className="relative mt-0.5 inline-flex shrink-0">
                <input
                    id={id}
                    type="checkbox"
                    role="switch"
                    checked={checked}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.checked)}
                    className="peer sr-only"
                />
                <span className="h-6 w-10 rounded-full bg-line transition-colors peer-checked:bg-teal-700 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-teal-600" />
                <span className="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
            </span>
            <span>
                <span className="block text-[0.92rem] font-medium">{label}</span>
                {sub ? <span className="block text-[0.8rem] text-ink-3">{sub}</span> : null}
            </span>
        </label>
    );
}
