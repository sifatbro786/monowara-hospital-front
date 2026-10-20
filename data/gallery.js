// Mock `gallery` collection — the hospital's own photos (old site gallery: "Hospital" and
// "Diagnostic" filters). Add more from admin; ask the client for higher-resolution originals.
const L = (en, bn) => ({ en, bn });

const rows = [
    [
        "hospital-building",
        "/uploads/hero/hospital-building-wide.webp",
        "hospital",
        L("Our own building at Siddeshwari", "সিদ্ধেশ্বরীতে আমাদের নিজস্ব ভবন"),
    ],
    [
        "operation-theatre",
        "/uploads/facilities/operation-theatre.webp",
        "hospital",
        L("Operation theatre", "অপারেশন থিয়েটার"),
    ],
    ["ward", "/uploads/facilities/ward.webp", "hospital", L("Inpatient ward", "ইনপেশেন্ট ওয়ার্ড")],
    ["nicu", "/uploads/facilities/nicu.webp", "hospital", L("Neonatal ICU", "এনআইসিইউ")],
    [
        "nicu-care",
        "/uploads/facilities/nicu-care.webp",
        "hospital",
        L("Newborn care", "নবজাতকের যত্ন"),
    ],
    [
        "dialysis",
        "/uploads/facilities/dialysis.webp",
        "hospital",
        L("Dialysis unit", "ডায়ালাইসিস ইউনিট"),
    ],
    ["ct-scan", "/uploads/facilities/ct-scan.webp", "diagnostic", L("CT scan", "সিটি স্ক্যান")],
    [
        "ct-scan-room",
        "/uploads/facilities/ct-scan-room.webp",
        "diagnostic",
        L("Imaging suite", "ইমেজিং কক্ষ"),
    ],
    [
        "x-ray",
        "/uploads/facilities/x-ray.webp",
        "diagnostic",
        L("Digital X-ray", "ডিজিটাল এক্স-রে"),
    ],
    [
        "blood-collection",
        "/uploads/facilities/blood-collection.webp",
        "diagnostic",
        L("Sample collection", "স্যাম্পল কালেকশন"),
    ],
    [
        "pathology",
        "/uploads/facilities/pathology-sample.webp",
        "diagnostic",
        L("Pathology lab", "প্যাথলজি ল্যাব"),
    ],
    [
        "aesthetic",
        "/uploads/hero/mh-aesthetic.webp",
        "hospital",
        L("MH Aesthetic & Wellness", "এমএইচ অ্যাসথেটিক"),
    ],
];

export const gallery = rows.map(([slug, src, category, caption], i) => ({
    _id: `gal_${slug}`,
    src,
    category, // "hospital" | "diagnostic"
    caption,
    isActive: true,
    order: i + 1,
}));
