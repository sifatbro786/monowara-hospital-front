// Mock `diagnostics` collection (proposal §5.1 — timing + preparation notes filled in Phase 3).
// No test-report feature (client meeting, Oct 2026) — these are information pages only.
const stamp = "2026-10-20T00:00:00.000Z";

const rows = [
    {
        slug: "pathology-lab",
        name: ["Pathology Lab", "প্যাথলজি ল্যাব"],
        summary: [
            "Blood, urine and other routine and special tests, with sample collection on site.",
            "রক্ত, প্রস্রাবসহ রুটিন ও বিশেষ পরীক্ষা; হাসপাতালেই স্যাম্পল কালেকশন।",
        ],
        image: "/uploads/facilities/pathology-sample.webp",
        legacy: ["pathology-lab"],
    },
    {
        slug: "ct-scan-x-ray",
        name: ["CT Scan & X-ray", "সিটি স্ক্যান ও এক্স-রে"],
        summary: [
            "CT scan and digital X-ray, reported by radiologists.",
            "সিটি স্ক্যান ও ডিজিটাল এক্স-রে, রেডিওলজিস্টের রিপোর্টসহ।",
        ],
        image: "/uploads/facilities/ct-scan.webp",
        legacy: [],
    },
    {
        slug: "ecg-ett-echo",
        name: ["ECG, ETT & Echocardiography", "ইসিজি, ইটিটি ও ইকোকার্ডিওগ্রাফি"],
        summary: [
            "Heart tracing, exercise stress test and heart ultrasound.",
            "হৃদযন্ত্রের ট্রেসিং, ব্যায়াম স্ট্রেস টেস্ট ও হার্টের আল্ট্রাসাউন্ড।",
        ],
        image: "/uploads/facilities/ecg.webp", // download
        legacy: ["ecg-ett-echo-cardiogram"],
    },
    {
        slug: "holter-monitoring",
        name: ["Holter Monitoring", "হল্টার মনিটরিং"],
        summary: [
            "24-hour heart-rhythm recording while you go about your day.",
            "স্বাভাবিক কাজের মধ্যেই ২৪ ঘণ্টা হৃদস্পন্দন রেকর্ডিং।",
        ],
        image: "/uploads/facilities/holter.webp", // download
        legacy: ["halter-monitoring"],
    },
    {
        slug: "endoscopy-colonoscopy",
        name: ["Endoscopy & Colonoscopy", "এন্ডোস্কপি ও কোলোনোস্কপি"],
        summary: [
            "Camera tests of the stomach and bowel, diagnostic and therapeutic.",
            "পাকস্থলী ও অন্ত্রের ক্যামেরা পরীক্ষা — রোগ নির্ণয় ও চিকিৎসা দুটোই।",
        ],
        image: "/uploads/facilities/colonoscopy.webp", // download
        legacy: ["endoscopy-colonoscopy"],
    },
    {
        slug: "ultrasonography",
        name: ["Ultrasonography", "আল্ট্রাসনোগ্রাফি"],
        summary: [
            "Abdominal, pregnancy and other ultrasound scans.",
            "পেট, গর্ভাবস্থা ও অন্যান্য আল্ট্রাসাউন্ড স্ক্যান।",
        ],
        image: null, // CONFIRM: no photo on the old site
        legacy: [],
    },
];

export const diagnostics = rows.map((r, i) => ({
    _id: `diag_${r.slug}`,
    slug: r.slug,
    name: { en: r.name[0], bn: r.name[1] },
    summary: { en: r.summary[0], bn: r.summary[1] },
    timing: { en: "", bn: "" },
    preparation: { en: "", bn: "" },
    image: r.image,
    isActive: true,
    order: i + 1,
    legacySlugs: r.legacy,
    createdAt: stamp,
    updatedAt: stamp,
}));
