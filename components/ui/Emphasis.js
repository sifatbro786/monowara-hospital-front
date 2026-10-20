import { cn } from "@/lib/utils";

/**
 * Renders admin-editable text where `*phrase*` becomes the single accent phrase
 * (italic serif in EN; colour only in BN, which has no true italic).
 * Plain text in, React nodes out — no HTML from the CMS is ever injected.
 */
export function Emphasis({ text = "", className }) {
    const parts = String(text).split(/\*(.+?)\*/g);
    return parts.map((part, i) =>
        i % 2 ? (
            <em
                key={i}
                className={cn(
                    "font-display italic text-teal-700 [&:lang(bn)]:not-italic",
                    className,
                )}
            >
                {part}
            </em>
        ) : (
            part
        ),
    );
}
