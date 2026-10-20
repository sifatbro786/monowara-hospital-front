// Mock `diagnostics` collection (proposal §5.1 — timing + preparation notes filled in Phase 3).
const stamp = "2026-10-20T00:00:00.000Z";

// [slug, en, bn]
const rows = [
    ["pathology-lab", "Pathology Lab", "প্যাথলজি ল্যাব"],
    ["ct-scan-x-ray", "CT Scan & X-ray", "সিটি স্ক্যান ও এক্স-রে"],
    ["ecg-ett-echo", "ECG, ETT & Echocardiography", "ইসিজি, ইটিটি ও ইকোকার্ডিওগ্রাফি"],
    ["holter-monitoring", "Holter Monitoring", "হল্টার মনিটরিং"],
    ["endoscopy-colonoscopy", "Endoscopy & Colonoscopy", "এন্ডোস্কপি ও কোলোনোস্কপি"],
    ["ultrasonography", "Ultrasonography", "আল্ট্রাসনোগ্রাফি"],
];

export const diagnostics = rows.map(([slug, en, bn], i) => ({
    _id: `diag_${slug}`,
    slug,
    name: { en, bn },
    summary: { en: "", bn: "" },
    timing: { en: "", bn: "" },
    preparation: { en: "", bn: "" },
    image: null,
    isActive: true,
    order: i + 1,
    createdAt: stamp,
    updatedAt: stamp,
}));
