// Mock `facilities` collection (services & facilities pages, proposal §5.1).
const stamp = "2026-10-20T00:00:00.000Z";

// [slug, en, bn, is24x7]
const rows = [
    ["emergency", "24/7 Emergency Unit", "২৪/৭ জরুরি বিভাগ", true],
    ["operation-theatres", "Operation Theatres", "অপারেশন থিয়েটার", false],
    ["icu", "Intensive Care Unit (ICU)", "আইসিইউ", true],
    ["nicu", "Neonatal ICU (NICU)", "এনআইসিইউ", true],
    ["dialysis", "Dialysis", "ডায়ালাইসিস", false],
    ["ambulance", "24/7 Ambulance", "২৪/৭ অ্যাম্বুলেন্স", true],
    ["pharmacy", "Pharmacy", "ফার্মেসি", true],
    ["blood-bank", "Blood Bank", "ব্লাড ব্যাংক", false],
    ["opd-chambers", "OPD Doctors' Chambers", "ওপিডি ডাক্তার চেম্বার", false],
    ["reception", "24/7 Reception", "২৪/৭ রিসেপশন", true],
];

export const facilities = rows.map(([slug, en, bn, is24x7], i) => ({
    _id: `fac_${slug}`,
    slug,
    name: { en, bn },
    summary: { en: "", bn: "" },
    description: { en: "", bn: "" },
    is24x7,
    image: null,
    isActive: true,
    order: i + 1,
    createdAt: stamp,
    updatedAt: stamp,
}));
