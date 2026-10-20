import { BootScript } from "@/components/layout/BootScript";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { locales, hasLocale, href } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getFaqs } from "@/lib/api/content";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingDock } from "@/components/layout/FloatingDock";
import { Loader } from "@/components/layout/Loader";
import { AppointmentProvider } from "@/components/booking/AppointmentProvider";
import { RevealObserver } from "@/components/motion/Reveal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://monowarahospital.com";
// Only the real production deploy is indexable; Vercel demo / previews are noindex.
const INDEXABLE = process.env.NEXT_PUBLIC_SITE_ENV === "production";

export async function generateStaticParams() {
    return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
    const { lang } = await params;
    if (!hasLocale(lang)) return {};
    const dict = await getDictionary(lang);
    return {
        metadataBase: new URL(SITE_URL),
        title: {
            default: `${dict.meta.siteName} — ${dict.meta.tagline}`,
            template: `%s · ${dict.meta.siteName}`,
        },
        description: dict.meta.description,
        applicationName: dict.meta.siteName,
        alternates: { languages: { en: href("en", "/"), bn: href("bn", "/"), "x-default": "/" } },
        openGraph: {
            siteName: dict.meta.legalName,
            locale: lang === "bn" ? "bn_BD" : "en_US",
            type: "website",
        },
        robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
        formatDetection: { telephone: false },
    };
}

export const viewport = {
    themeColor: "#f6f3ec",
};

// Runs before first paint: marks JS, and decides whether the intro loader shows
// (first visit per session; never on /emergency, ?ref=call, or reduced motion).
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('mh-loader-seen'))return;if(/^\\/(bn\\/)?emergency/.test(location.pathname))return;if(/[?&]ref=call/.test(location.search))return;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.setAttribute('data-loader','');}catch(e){}})();`;

export default async function LangLayout({ children, params }) {
    const { lang } = await params;
    if (!hasLocale(lang)) notFound();

    const [dict, settings, faqs] = await Promise.all([
        getDictionary(lang),
        getSettings(),
        getFaqs(),
    ]);

    return (
        <html lang={lang} className={fontVariables} suppressHydrationWarning>
            <head>
                <BootScript code={bootScript} />
            </head>
            <body className="flex min-h-dvh flex-col antialiased" suppressHydrationWarning>
                <a
                    href="#main"
                    className="sr-only z-60 rounded-pill bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
                >
                    {dict.nav.skip}
                </a>
                <Loader
                    skipLabel={dict.loader.skip}
                    wordBn="মনোয়ারা হসপিটাল"
                    wordEn="Monowara Hospital"
                />
                <AppointmentProvider lang={lang}>
                    <TopBar settings={settings} dict={dict} lang={lang} />
                    <Header settings={settings} dict={dict} lang={lang} />
                    <main id="main" className="flex-1">
                        {children}
                    </main>
                    <Footer settings={settings} dict={dict} lang={lang} />
                    <FloatingDock settings={settings} faqs={faqs} dict={dict} lang={lang} />
                </AppointmentProvider>
                <RevealObserver />
            </body>
        </html>
    );
}
