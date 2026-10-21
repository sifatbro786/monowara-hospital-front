"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { href, stripLocale, localeFromPath } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function LangSwitch({ label = "Language", className, tone = "dark" }) {
    const pathname = usePathname() || "/";
    const current = localeFromPath(pathname);
    const base = stripLocale(pathname);

    const item = (lang, text) => {
        const active = current === lang;
        return (
            <Link
                href={href(lang, base)}
                hrefLang={lang}
                lang={lang}
                aria-current={active ? "true" : undefined}
                prefetch={false}
                // On EN pages "বাংলা" is the only Bangla text above the fold: render it in the
                // device's Bangla font so EN visits don't download Hind Siliguri (~70 KB) for one word.
                style={
                    lang === "bn" && current !== "bn"
                        ? { fontFamily: "system-ui, sans-serif" }
                        : undefined
                }
                className={cn(
                    "rounded-pill px-2.5 py-1 transition-colors",
                    active
                        ? tone === "dark"
                            ? "bg-paper text-ink"
                            : "bg-ink text-paper"
                        : tone === "dark"
                          ? "text-paper/75 hover:text-paper"
                          : "text-ink-2 hover:text-ink",
                )}
            >
                {text}
            </Link>
        );
    };

    return (
        <nav
            aria-label={label}
            className={cn("flex items-center gap-0.5 text-[0.8rem]", className)}
        >
            {item("en", "EN")}
            {item("bn", "বাংলা")}
        </nav>
    );
}
