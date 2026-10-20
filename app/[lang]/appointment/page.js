import { Container } from "@/components/ui/Layout";
import { Suspense } from "react";
import { AppointmentPanel } from "@/components/booking/AppointmentPanel";
import { AppointmentFromQuery } from "@/components/booking/AppointmentFromQuery";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getDoctors } from "@/lib/api/doctors";
import { getDepartments } from "@/lib/api/departments";
import { BookingForm, BookingFormFromQuery } from "@/components/booking/BookingForm";
import { t } from "@/lib/i18n/t";
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
 * (?for=<doctor|package>). settings.bookingMode: "numbers" (default) = call/WhatsApp panel
 * only; "both" = panel + request form; "form" = form first. `?for=` is read client-side,
 * so the page stays static.
 */
export default async function AppointmentPage({ params }) {
    const { lang } = await params;
    const [dict, settings] = await Promise.all([getDictionary(lang), getSettings()]);
    const mode = settings.bookingMode || "numbers";
    const showForm = mode === "form" || mode === "both";
    const formProps = showForm
        ? await formData({ lang, labels: dict.appointment.form, wa: settings.primaryWhatsapp })
        : null;
    const form = showForm && (
        <section aria-labelledby="form-title" className="border-t border-line bg-paper-2">
            <Container className="grid gap-8 py-14 lg:grid-cols-12 lg:py-20">
                <div className="lg:col-span-4">
                    <h2 id="form-title" className="text-h2">
                        {dict.appointment.form.title}
                    </h2>
                    <p className="mt-3 text-ink-2">{dict.appointment.form.lead}</p>
                </div>
                <div className="lg:col-span-8">
                    <Suspense fallback={<BookingForm {...formProps} />}>
                        <BookingFormFromQuery {...formProps} />
                    </Suspense>
                </div>
            </Container>
        </section>
    );

    return (
        <>
            {mode === "form" && form}
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
                                <AppointmentPanel
                                    settings={settings}
                                    dict={dict}
                                    lang={lang}
                                    as="h1"
                                />
                            }
                        >
                            <AppointmentFromQuery
                                settings={settings}
                                dict={dict}
                                lang={lang}
                                as="h1"
                            />
                        </Suspense>
                    </div>
                </div>
            </Container>
            {mode === "both" && form}
        </>
    );
}

async function formData({ lang, labels, wa }) {
    const [{ items }, departments] = await Promise.all([
        getDoctors({ limit: 500 }),
        getDepartments(),
    ]);
    return {
        labels,
        waNumber: wa?.number,
        departments: departments.map((d) => ({ slug: d.slug, name: t(d.name, lang) })),
        doctors: items.map((d) => ({
            slug: d.slug,
            name: t(d.name, lang),
            dept: d.department?.slug || "",
        })),
    };
}
