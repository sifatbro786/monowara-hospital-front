import { cn } from "@/lib/utils";

export function Container({ as: Tag = "div", className, children, ...rest }) {
    return (
        <Tag
            className={cn("mx-auto w-full max-w-336 px-4 sm:px-6 lg:px-10", className)}
            {...rest}
        >
            {children}
        </Tag>
    );
}

/**
 * Editorial section: optional number ("01"), eyebrow and a hairline rule above the
 * heading. Deliberately left-aligned — no centred-everything rhythm.
 */
export function Section({
    id,
    number,
    eyebrow,
    title,
    lead,
    action,
    tone = "paper",
    className,
    children,
    ...rest
}) {
    const tones = {
        paper: "bg-paper",
        alt: "bg-paper-2",
        card: "bg-card",
        mint: "bg-mint",
        // dark sections: recolour the shared header pieces
        deep: "bg-teal-950 text-paper paper-grain-dark [&_.eyebrow]:text-teal-300 [&_.rule]:bg-paper/15 [&_header_p]:text-paper/70 [&_.section-num]:text-teal-300 [&_h2_em]:text-teal-300 [&_header_a]:text-teal-200",
        ink: "bg-ink text-paper [&_.eyebrow]:text-teal-300 [&_.rule]:bg-paper/15 [&_header_p]:text-paper/70 [&_.section-num]:text-teal-300 [&_h2_em]:text-teal-300 [&_header_a]:text-teal-200",
    };
    return (
        <section
            id={id}
            className={cn("relative isolate py-16 sm:py-20 lg:py-28", tones[tone], className)}
            {...rest}
        >
            <Container>
                {(eyebrow || title) && (
                    <header className="mb-10 lg:mb-14">
                        <div className="flex items-center gap-4">
                            {number && (
                                <span className="section-num font-display text-sm text-teal-700 tabular-nums">
                                    {number}
                                </span>
                            )}
                            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
                            <span className="rule flex-1" aria-hidden />
                        </div>
                        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end">
                            {title && <h2 className="text-h2 lg:col-span-7">{title}</h2>}
                            {(lead || action) && (
                                <div className="flex flex-col gap-5 lg:col-span-5 lg:items-end lg:text-right">
                                    {lead && <p className="max-w-md text-ink-2">{lead}</p>}
                                    {action}
                                </div>
                            )}
                        </div>
                    </header>
                )}
                {children}
            </Container>
        </section>
    );
}

export function Badge({ tone = "teal", className, children }) {
    const tones = {
        teal: "bg-teal-50 text-teal-800 ring-teal-200",
        ink: "bg-ink text-paper ring-ink",
        line: "bg-transparent text-ink-2 ring-line",
        emergency: "bg-emergency-soft text-emergency-ink ring-emergency/25",
    };
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                tones[tone],
                className,
            )}
        >
            {children}
        </span>
    );
}
