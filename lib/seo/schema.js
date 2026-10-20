import { href } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/t";
import { SITE_URL } from "./metadata";

// schema.org builders. Everything points at one Hospital node (@id) so Physician, MedicalClinic
// and articles all resolve to the same entity in Google's graph.
export const HOSPITAL_ID = `${SITE_URL}/#hospital`;

const abs = (path) => (path ? (path.startsWith("http") ? path : `${SITE_URL}${path}`) : undefined);
const e164 = (n) => (n ? `+88${String(n).replace(/\D/g, "").replace(/^88/, "")}` : undefined);

export function hospitalSchema(settings, lang) {
    const sameAs = Object.values(settings.socials || {}).filter(Boolean);
    const desks = [...new Set((settings.phones || []).map((p) => p.number).filter(Boolean))];
    return {
        "@context": "https://schema.org",
        "@type": "Hospital",
        "@id": HOSPITAL_ID,
        name: settings.legalName.en,
        alternateName: [settings.siteName.en, settings.siteName.bn, settings.legalName.bn],
        url: `${SITE_URL}${href(lang, "/")}`,
        logo: abs("/logo.png"),
        image: abs("/uploads/hero/hospital-building-card.webp"),
        telephone: e164(settings.hotline),
        ...(settings.email && { email: settings.email }),
        address: {
            "@type": "PostalAddress",
            // CONFIRM: split from settings.address — B1 settings model gets structured address fields.
            streetAddress: "54, Siddeshwari Road, Ramna",
            addressLocality: "Dhaka",
            postalCode: "1217",
            addressCountry: "BD",
        },
        ...(settings.map?.directions && { hasMap: settings.map.directions }),
        openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            opens: "00:00",
            closes: "23:59",
        },
        isAcceptingNewPatients: true,
        contactPoint: [
            {
                "@type": "ContactPoint",
                contactType: "customer service",
                telephone: e164(settings.hotline),
                availableLanguage: ["en", "bn"],
            },
            ...(settings.emergency
                ? [
                      {
                          "@type": "ContactPoint",
                          contactType: "emergency",
                          telephone: e164(settings.emergency),
                      },
                  ]
                : []),
            ...desks.map((n) => ({
                "@type": "ContactPoint",
                contactType: "reservations",
                telephone: e164(n),
            })),
        ],
        ...(sameAs.length && { sameAs }),
    };
}

/** Sub-brand clinic (MH Aesthetic, BHRPC) as part of the hospital. */
export function clinicSchema({ lang, path, name, description, image, telephone, email }) {
    return {
        "@context": "https://schema.org",
        "@type": "MedicalClinic",
        name,
        description,
        url: `${SITE_URL}${href(lang, path)}`,
        ...(image && { image: abs(image) }),
        ...(telephone && { telephone: e164(telephone) }),
        ...(email && { email }),
        parentOrganization: { "@id": HOSPITAL_ID },
    };
}

/** items: [{ name, path }] — Home is prepended. Last item = current page. */
export function breadcrumbSchema(lang, homeLabel, items) {
    const list = [{ name: homeLabel, path: "/" }, ...items];
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: list.map((it, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: typeof it.name === "object" ? t(it.name, lang) : it.name,
            item: `${SITE_URL}${href(lang, it.path)}`,
        })),
    };
}
