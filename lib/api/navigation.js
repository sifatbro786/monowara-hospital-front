import { getDepartments } from "./departments";
import { getFacilities, getDiagnostics } from "./services";

/**
 * Builds the main menu from live collections, so admin edits to departments /
 * facilities / diagnostics show up in the mega-menu without code changes.
 * Labels are dictionary keys (nav.*) or {en,bn} fields; resolved in the Header.
 */
export async function getNavigation() {
    const [departments, facilities, diagnostics] = await Promise.all([
        getDepartments(),
        getFacilities(),
        getDiagnostics(),
    ]);

    return [
        { key: "findDoctor", href: "/doctors" },
        {
            key: "departments",
            href: "/departments",
            mega: {
                columns: [
                    {
                        key: "specialties",
                        items: departments.map((d) => ({
                            label: d.name,
                            href: `/departments/${d.slug}`,
                            featured: d.isFeatured,
                        })),
                    },
                    {
                        key: "facilities",
                        items: facilities.map((f) => ({
                            label: f.name,
                            href: `/facilities/${f.slug}`,
                            badge: f.is24x7 ? "24/7" : null,
                        })),
                    },
                ],
                allKey: "allDepartments",
            },
        },
        {
            key: "packages",
            href: "/packages",
            menu: [
                { key: "maternity", href: "/packages?category=maternity" },
                { key: "surgical", href: "/packages?category=surgical" },
                { key: "checkups", href: "/packages?category=checkup" },
                { key: "allPackages", href: "/packages" },
            ],
        },
        {
            key: "diagnostics",
            href: "/diagnostics",
            menu: [
                ...diagnostics.map((d) => ({ label: d.name, href: `/diagnostics/${d.slug}` })),
                { key: "allDiagnostics", href: "/diagnostics" },
            ],
        },
        {
            key: "patients",
            href: "/patients-visitors",
            menu: [
                { key: "visiting", href: "/patients-visitors#visiting-hours" },
                { key: "admission", href: "/patients-visitors#admission" },
                { key: "insurance", href: "/patients-visitors#corporate-insurance" },
                { key: "patientRights", href: "/legal/patient-rights" },
                { key: "emergency", href: "/emergency", tone: "emergency" },
            ],
        },
        {
            key: "about",
            href: "/about",
            menu: [
                { key: "aboutHospital", href: "/about" },
                { key: "management", href: "/about/management" },
                { key: "bhrpc", href: "/bhrpc" },
                { key: "aesthetic", href: "/mh-aesthetic" },
                { key: "healthTips", href: "/health-tips" },
                { key: "gallery", href: "/gallery" },
                { key: "talks", href: "/expert-talks" },
                { key: "careers", href: "/careers" },
                { key: "contact", href: "/contact" },
            ],
        },
    ];
}
