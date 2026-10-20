import { Container } from "@/components/ui/Layout";
import { Suspense } from "react";
import { AppointmentPanel } from "@/components/booking/AppointmentPanel";
import { AppointmentFromQuery } from "@/components/booking/AppointmentFromQuery";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { href } from "@/lib/i18n/config";

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    return {
        title: dict.appointment.title,
        description: dict.appointment.lead,
        alternates: { canonical: href(lang, "/appointment") },
    };
}

/**
 * The booking page — every Appointment / Call-for-Price button lands here
 * (?for=<doctor|package>). Phase 4 adds the optional form when settings.bookingMode
 * is "form" | "both". `?for=` is read client-side, so the page stays static.
 */
export default async function AppointmentPage({ params }) {
    const { lang } = await params;
    const [dict, settings] = await Promise.all([getDictionary(lang), getSettings()]);

    return (
        <Container className="py-12 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-5 lg:pt-10">
                    <p className="eyebrow">{dict.nav.book}</p>
                    <p className="mt-4 max-w-md font-display text-h2 text-ink">
                        {dict.meta.tagline}
                    </p>
                </div>
                <div className="overflow-hidden rounded-3xl border border-line bg-card lg:col-span-7">
                    {/* static shell renders without context; ?for= fills in on the client */}
                    <Suspense
                        fallback={
                            <AppointmentPanel settings={settings} dict={dict} lang={lang} as="h1" />
                        }
                    >
                        <AppointmentFromQuery settings={settings} dict={dict} lang={lang} as="h1" />
                    </Suspense>
                </div>
            </div>
        </Container>
    );
}
