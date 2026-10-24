import { cn } from "@/lib/utils";

/**
 * Renders admin-editable text where `*phrase*` becomes the single accent phrase
 * (teal colour only, same face and weight — no italic-serif accent).
 * Plain text in, React nodes out — no HTML from the CMS is ever injected.
 */
export function Emphasis({ text = "", className }) {
    const parts = String(text).split(/\*(.+?)\*/g);
    return parts.map((part, i) =>
        i % 2 ? (
            <em key={i} className={cn("not-italic text-teal-700", className)}>
                {part}
            </em>
        ) : (
            part
        ),
    );
}
