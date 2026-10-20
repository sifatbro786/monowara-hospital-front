import { cn } from "@/lib/utils";

/** Shared form styling + label/error wrapper (client and server safe — no hooks). */
export const fieldClass =
    "h-12 w-full rounded-xl border border-line bg-paper/60 px-4 text-[0.95rem] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-teal-600 focus:bg-card aria-invalid:border-emergency";

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
