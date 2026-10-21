import { getAllDoctors } from "@/lib/api/doctors";
import { getDepartments } from "@/lib/api/departments";
import { getFacilities, getDiagnostics } from "@/lib/api/services";
import { getPackages } from "@/lib/api/packages";
import { getArticles } from "@/lib/api/content";
import { getJobs, getLegalSlugs, getLegalPage } from "@/lib/api/pages";
import { locales, href } from "@/lib/i18n/config";
import { SITE_URL, absUrl } from "@/lib/seo/metadata";

// Every public route in EN + BN, each with hreflang alternates. Built from the same services the
// pages use, so a doctor/package added in the admin appears here after its cache tag revalidates.
// robots.js only advertises this file on the production VPS (demo stays noindex).
const STATIC = [
    ["/", 1, "weekly"],
    ["/doctors", 0.9, "weekly"],
    ["/departments", 0.8, "monthly"],
    ["/diagnostics", 0.7, "monthly"],
    ["/packages", 0.8, "monthly"],
    ["/appointment", 0.8, "monthly"],
    ["/emergency", 0.8, "yearly"],
    ["/bhrpc", 0.7, "monthly"],
    ["/mh-aesthetic", 0.7, "monthly"],
    ["/about", 0.6, "yearly"],
    ["/about/management", 0.4, "yearly"],
    ["/patients-visitors", 0.6, "yearly"],
    ["/health-tips", 0.6, "weekly"],
    ["/gallery", 0.4, "monthly"],
    ["/expert-talks", 0.4, "monthly"],
    ["/careers", 0.4, "monthly"],
    ["/contact", 0.6, "yearly"],
];

const abs = (lang, path) => `${SITE_URL}${href(lang, path)}`;

function entries(path, { priority = 0.5, changeFrequency = "monthly", lastModified, image } = {}) {
    const languages = Object.fromEntries(locales.map((l) => [l, abs(l, path)]));
    languages["x-default"] = abs("en", path);
    return locales.map((lang) => ({
        url: abs(lang, path),
        ...(lastModified && { lastModified }),
        changeFrequency,
        priority,
        alternates: { languages },
        ...(image && { images: [absUrl(image)] }),
    }));
}

export default async function sitemap() {
    const [doctors, departments, facilities, diagnostics, packages, articles, jobs, legalSlugs] =
        await Promise.all([
            getAllDoctors(),
            getDepartments(),
            getFacilities(),
            getDiagnostics(),
            getPackages(),
            getArticles(),
            getJobs(),
            getLegalSlugs(),
        ]);
    const legal = (await Promise.all(legalSlugs.map((s) => getLegalPage(s)))).filter(Boolean);

    const doc =
        (base, priority, changeFrequency = "monthly") =>
        (d) =>
            entries(`${base}/${d.slug}`, {
                priority,
                changeFrequency,
                lastModified: d.updatedAt,
                image: d.photo || d.image,
            });

    return [
        ...STATIC.flatMap(([path, priority, changeFrequency]) =>
            entries(path, { priority, changeFrequency }),
        ),
        ...doctors.flatMap(doc("/doctors", 0.8, "weekly")),
        ...departments.flatMap(doc("/departments", 0.7)),
        ...facilities.flatMap(doc("/facilities", 0.6)),
        ...diagnostics.flatMap(doc("/diagnostics", 0.6)),
        ...packages.flatMap(doc("/packages", 0.6)),
        ...articles.flatMap(doc("/health-tips", 0.6)),
        ...jobs.flatMap(doc("/careers", 0.3)),
        ...legal.flatMap(doc("/legal", 0.2, "yearly")),
    ];
}
