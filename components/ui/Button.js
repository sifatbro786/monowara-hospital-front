import Link from "next/link";
import { cn } from "@/lib/utils";

const base =
    "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap select-none [&_svg]:shrink-0 " +
    "transition-[background-color,color,border-color,transform] duration-200 ease-[var(--ease-calm)] " +
    "active:translate-y-px disabled:opacity-50 disabled:pointer-events-none";

const variants = {
    primary: "bg-teal-700 text-white hover:bg-teal-800",
    ink: "bg-ink text-paper hover:bg-teal-900",
    brand: "bg-teal-500 text-white hover:bg-teal-600",
    bright: "bg-teal-400 text-ink hover:bg-teal-300",
    onTeal: "bg-white text-teal-900 hover:bg-teal-50",
    price: "border border-teal-700/35 text-teal-800 hover:border-teal-700 hover:bg-teal-50",
    outline: "border border-ink/20 text-ink hover:border-ink/60 bg-transparent",
    ghost: "text-ink hover:bg-ink/5",
    light: "bg-card text-ink hover:bg-white border border-line",
    whatsapp: "bg-card text-ink border border-line hover:border-wa/60 [&_.wa]:text-wa",
    emergency: "bg-emergency text-white hover:bg-emergency-ink",
};

const sizes = {
    sm: "h-9 px-3.5 text-sm rounded-pill",
    md: "h-11 px-5 text-[0.95rem] rounded-pill",
    lg: "h-13 px-6 text-base rounded-pill min-h-[3.25rem]",
    icon: "size-11 rounded-pill",
};

export function buttonClass({ variant = "primary", size = "md", className } = {}) {
    return cn(base, variants[variant], sizes[size], className);
}

/**
 * <Button href="/x"> renders next/link; external/tel/wa links render <a>; otherwise <button>.
 * Appointment triggers: pass `appointment` (+ optional `context`) — handled by the
 * global AppointmentProvider through event delegation, so this stays a Server Component.
 */
export function Button({
    href,
    variant,
    size,
    className,
    children,
    appointment,
    context,
    kind,
    external,
    ...rest
}) {
    const cls = buttonClass({ variant, size, className });
    const apptProps = appointment
        ? {
              "data-appt": "",
              "data-appt-context": context || undefined,
              "data-appt-kind": kind || undefined,
          }
        : {};

    if (href) {
        const isExternal = external || /^(https?:|tel:|mailto:)/.test(href);
        if (isExternal) {
            const blank = /^https?:/.test(href);
            return (
                <a
                    href={href}
                    className={cls}
                    {...(blank ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    {...apptProps}
                    {...rest}
                >
                    {children}
                </a>
            );
        }
        return (
            <Link href={href} className={cls} {...apptProps} {...rest}>
                {children}
            </Link>
        );
    }

    return (
        <button type="button" className={cls} {...apptProps} {...rest}>
            {children}
        </button>
    );
}
