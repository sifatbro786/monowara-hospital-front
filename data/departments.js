// Mock `departments` collection (specialties only — facilities & diagnostics are separate
// collections). Phase 1 skeleton: names + slugs for navigation. Phase 2 migration fills
// description/services/image from monowarahospital.com and overwrites this file.
const stamp = "2026-10-20T00:00:00.000Z";

// [slug, en, bn, isFeatured (centre of excellence)]
const rows = [
    ["gynaecology-obstetrics", "Obstetrics & Gynaecology", "প্রসূতি ও স্ত্রীরোগ", true],
    [
        "general-laparoscopic-surgery",
        "General & Laparoscopic Surgery",
        "জেনারেল ও ল্যাপারোস্কোপিক সার্জারি",
        true,
    ],
    ["cardiology", "Cardiology", "হৃদরোগ", true],
    ["dermatology-venereology", "Dermatology & Venereology", "চর্ম ও যৌনরোগ", true],
    ["medicine", "Internal Medicine", "মেডিসিন", true],
    ["paediatrics-neonatology", "Paediatrics & Neonatology", "শিশু ও নবজাতক", false],
    ["oncology", "Cancer (Oncology)", "ক্যান্সার", false],
    ["diabetes-endocrinology", "Diabetes & Endocrinology", "ডায়াবেটিস ও হরমোন", false],
    ["gastroenterology-liver", "Gastroenterology & Liver", "গ্যাস্ট্রো ও লিভার", false],
    ["haematology", "Haematology", "রক্তরোগ", false],
    ["nephrology", "Kidney (Nephrology)", "কিডনি রোগ", false],
    ["neurology", "Neurology", "নিউরোলজি", false],
    ["ent", "ENT (Ear, Nose & Throat)", "নাক, কান ও গলা", false],
    ["orthopaedics", "Orthopaedics", "অর্থোপেডিকস", false],
    ["paediatric-cardiology", "Paediatric Cardiology", "শিশু হৃদরোগ", false],
    ["physical-medicine", "Physical Medicine", "ফিজিক্যাল মেডিসিন", false],
    ["physiotherapy", "Physiotherapy", "ফিজিওথেরাপি", false],
    ["plastic-surgery", "Plastic Surgery", "প্লাস্টিক সার্জারি", false],
    ["thoracic-surgery", "Thoracic Surgery", "থোরাসিক সার্জারি", false],
    ["urology", "Urology", "ইউরোলজি", false],
    ["chest-medicine", "Chest Medicine", "বক্ষব্যাধি", false],
    ["nutrition-diet", "Nutrition & Diet", "পুষ্টি ও খাদ্য", false],
];

export const departments = rows.map(([slug, en, bn, isFeatured], i) => ({
    _id: `dept_${slug}`,
    slug,
    name: { en, bn },
    summary: { en: "", bn: "" },
    description: { en: "", bn: "" },
    services: [],
    image: null,
    isFeatured,
    isActive: true,
    order: i + 1,
    seo: { title: { en: "", bn: "" }, description: { en: "", bn: "" } },
    createdAt: stamp,
    updatedAt: stamp,
}));
