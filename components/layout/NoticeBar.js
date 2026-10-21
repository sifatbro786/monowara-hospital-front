import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { Icon } from "@/components/ui/Icon";
import { href } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/t";

/**
 * Site-wide notice (Admin → Content → Notice bar: settings.noticeBar { isActive, text{en,bn}, href }).
 * Renders nothing until switched on. Internal hrefs ("/packages") are localised; external links
 * open in a new tab. Plain text only — admin input is never rendered as HTML.
 */
export function NoticeBar({ notice, label, lang }) {
    const text = notice?.isActive ? t(notice.text, lang).trim() : "";
    if (!text) return null;
    const link = notice.href?.trim();
    const external = /^https?:\/\//.test(link || "");
    const body = (
        <>
            <span>{text}</span>
            {link && <Icon name="arrow" size={15} className="shrink-0" />}
        </>
    );
    return (
        <section aria-label={label} data-track="notice" className="bg-teal-50 text-teal-900">
            <Container className="flex min-h-10 items-center justify-center py-2 text-center text-sm">
                {!link ? (
                    <p className="flex items-center gap-2">{body}</p>
                ) : external ? (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 font-medium underline decoration-teal-500/50 underline-offset-4 hover:text-teal-700"
                    >
                        {body}
                    </a>
                ) : (
                    <Link
                        href={href(lang, link)}
                        className="flex items-center gap-2 font-medium underline decoration-teal-500/50 underline-offset-4 hover:text-teal-700"
                    >
                        {body}
                    </Link>
                )}
            </Container>
        </section>
    );
}
