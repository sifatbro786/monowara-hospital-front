import { cn } from "@/lib/utils";

/** Shared form styling + label/error wrapper (client and server safe — no hooks). */
export const fieldClass =
    "h-12 w-full rounded-xl border border-line bg-paper/60 px-4 text-[0.95rem] text-ink outline-none transition-[border-color,background-color,box-shadow] placeholder:text-ink-3 focus:border-teal-600 focus:ring-3 focus:ring-teal-500/25 focus:bg-card aria-invalid:border-emergency";

export const BD_MOBILE = /^(?:\+?88)?01[3-9]\d{8}$/;
export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Field({ label, error, hint, className, children }) {
    return (
        <label className={cn("grid gap-1.5", className)}>
            <span className="text-xs font-medium text-ink-2">{label}</span>
            {children}
            {hint && !error && <span className="text-xs text-ink-3">{hint}</span>}
            {error && <span className="text-xs text-emergency-ink">{error}</span>}
        </label>
    );
}

/** Form-level message (API refusal, rate limit, server unreachable) — same red as field errors. */
export function FormNotice({ className, children }) {
    return (
        <div
            role="alert"
            className={cn(
                "grid justify-items-start rounded-2xl border-l-4 border-emergency bg-emergency-soft px-4 py-3 text-sm text-ink",
                className,
            )}
        >
            {children}
        </div>
    );
}
