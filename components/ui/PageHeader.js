import Image from "next/image";
import { Container } from "@/components/ui/Layout";
import { t } from "@/lib/i18n/t";
import { cn } from "@/lib/utils";

/**
 * Inner-page header. With a media slot it becomes a photo band: the image fills the band
 * under a deep-teal wash that is strongest on the left (where the copy sits), so text stays
 * AA-readable on any photo. Without media it keeps the quiet paper band. If the file is
 * missing the teal background still reads well (graceful before photos are uploaded).
 * `media` = getMedia()[key] → { src, alt, position, overlay }.
 */
export function PageHeader({ eyebrow, title, lead, media, lang, children, className, tone }) {
    const photo = media?.src;
    const wash = media?.overlay ?? 0.82;
    const emergency = tone === "emergency";
    return (
        <header
            className={cn(
                "relative isolate overflow-hidden",
                photo
                    ? cn("text-paper", emergency ? "bg-ink" : "bg-teal-950")
                    : "border-b border-line bg-paper-2",
                className,
            )}
        >
            {photo && (
                <>
                    <Image
                        src={photo}
                        alt={t(media.alt, lang)}
                        fill
                        loading="eager"
                        fetchPriority="high"
                        sizes="100vw"
                        quality={75}
                        className="-z-20 object-cover"
                        style={{ objectPosition: media.position || "center" }}
                    />
                    <div
                        aria-hidden
                        className={cn(
                            "absolute inset-0 -z-10",
                            emergency
                                ? "bg-linear-to-r from-ink via-ink/85 to-ink/40"
                                : "bg-linear-to-r from-teal-950 via-teal-950/80 to-teal-950/25",
                        )}
                        style={{ opacity: wash }}
                    />
                    {/* bottom fade keeps the band's lower edge calm on busy photos */}
                    <div
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-linear-to-t from-teal-950/60 to-transparent"
                    />
                </>
            )}
            <Container className="py-16 lg:py-24">
                {eyebrow && (
                    <p
                        className={cn(
                            "eyebrow",
                            photo && (emergency ? "text-[#ff8a7e]" : "text-teal-300"),
                        )}
                    >
                        {eyebrow}
                    </p>
                )}
                <h1
                    className={cn(
                        "mt-4 max-w-3xl text-h1",
                        photo && "text-paper [&_em]:text-teal-200",
                    )}
                >
                    {title}
                </h1>
                {lead && (
                    <p
                        className={cn(
                            "mt-4 max-w-2xl text-lg",
                            photo ? "text-paper/80" : "text-ink-2",
                        )}
                    >
                        {lead}
                    </p>
                )}
                {children}
            </Container>
        </header>
    );
}
