// Mock `packages` collection (proposal §5.1). Prices are never shown — every package is
// "Call for Price". `inclusions` for check-ups follow the examples in the client's concept;
// maternity/surgical inclusions are empty until the hospital sends the real lists (CONFIRM).
// `inclusions` items are { en, bn } like every other translatable field.
import { packageContent } from "./package-content.js";

const stamp = "2026-10-20T00:00:00.000Z";
const L = (en, bn) => ({ en, bn });

// category: "maternity" | "surgical" | "checkup"
const rows = [
    {
        slug: "normal-delivery",
        category: "maternity",
        name: { en: "Normal delivery package", bn: "নরমাল ডেলিভারি প্যাকেজ" },
        summary: {
            en: "Labour room care with our obstetric team and newborn check.",
            bn: "প্রসূতি দলের তত্ত্বাবধানে লেবার রুম সেবা ও নবজাতকের চেকআপ।",
        },
    },
    {
        slug: "c-section",
        category: "maternity",
        name: { en: "Caesarean section (C-section) package", bn: "সিজারিয়ান (সি-সেকশন) প্যাকেজ" },
        summary: {
            en: "Planned or emergency caesarean in our operation theatres, with NICU on standby.",
            bn: "পরিকল্পিত বা জরুরি সিজার, এনআইসিইউ সাপোর্টসহ।",
        },
    },
    {
        slug: "antenatal-care",
        category: "maternity",
        name: { en: "Antenatal check-up plan", bn: "গর্ভকালীন চেকআপ প্ল্যান" },
        summary: {
            en: "Scheduled visits and scans through your pregnancy.",
            bn: "গর্ভাবস্থা জুড়ে নির্ধারিত চেকআপ ও স্ক্যান।",
        },
    },
    {
        slug: "basic-health-check",
        category: "checkup",
        name: { en: "Basic Health Check", bn: "বেসিক হেলথ চেক" },
        summary: {
            en: "A yearly baseline for adults.",
            bn: "প্রাপ্তবয়স্কদের বার্ষিক প্রাথমিক চেকআপ।",
        },
        inclusions: [
            L("CBC", "সিবিসি"),
            L("Blood sugar", "ব্লাড সুগার"),
            L("Urine R/E", "ইউরিন আর/ই"),
            L("Chest X-ray", "বুকের এক্স-রে"),
        ],
    },
    {
        slug: "executive-health-check",
        category: "checkup",
        name: { en: "Executive Health Check", bn: "এক্সিকিউটিভ হেলথ চেক" },
        summary: {
            en: "A broader panel with a specialist consultation.",
            bn: "বিস্তৃত পরীক্ষা ও বিশেষজ্ঞ পরামর্শসহ।",
        },
        inclusions: [
            L("Extended blood panel", "বিস্তারিত রক্ত পরীক্ষা"),
            L("Imaging", "ইমেজিং"),
            L("Specialist consultation", "বিশেষজ্ঞের পরামর্শ"),
        ],
    },
    {
        slug: "diabetes-care-check",
        category: "checkup",
        name: { en: "Diabetes Care Check", bn: "ডায়াবেটিস কেয়ার চেক" },
        summary: {
            en: "Track control and catch complications early.",
            bn: "নিয়ন্ত্রণ পর্যবেক্ষণ ও জটিলতা আগেভাগে শনাক্ত।",
        },
        inclusions: [
            L("HbA1c", "HbA1c"),
            L("Lipid profile", "লিপিড প্রোফাইল"),
            L("Creatinine", "ক্রিয়েটিনিন"),
        ],
    },
    {
        slug: "heart-health-check",
        category: "checkup",
        name: { en: "Heart Health Check", bn: "হার্ট হেলথ চেক" },
        summary: { en: "A focused look at your heart.", bn: "হৃদযন্ত্রের জন্য বিশেষ চেকআপ।" },
        inclusions: [
            L("ECG", "ইসিজি"),
            L("Echocardiography", "ইকোকার্ডিওগ্রাফি"),
            L("Lipid profile", "লিপিড প্রোফাইল"),
        ],
    },
    {
        slug: "musolmani",
        category: "surgical",
        name: { en: "Musolmani (circumcision)", bn: "মুসলমানি (খৎনা)" },
        summary: {
            en: "Day-care procedure by our surgical team.",
            bn: "সার্জিক্যাল টিমের মাধ্যমে ডে-কেয়ার প্রসিডিউর।",
        },
    },
    {
        slug: "laparoscopic-cholecystectomy",
        category: "surgical",
        name: { en: "Laparoscopic gallbladder surgery", bn: "ল্যাপারোস্কোপিক পিত্তথলি অপারেশন" },
        summary: {
            en: "Keyhole removal of the gallbladder.",
            bn: "ল্যাপারোস্কোপির মাধ্যমে পিত্তথলি অপসারণ।",
        },
    },
    {
        slug: "hernia-surgery",
        category: "surgical",
        name: { en: "Hernia surgery", bn: "হার্নিয়া অপারেশন" },
        summary: { en: "Open or laparoscopic repair.", bn: "ওপেন বা ল্যাপারোস্কোপিক রিপেয়ার।" },
    },
    {
        slug: "appendix-surgery",
        category: "surgical",
        name: { en: "Appendix surgery", bn: "অ্যাপেন্ডিক্স অপারেশন" },
        summary: {
            en: "Appendicectomy, planned or emergency.",
            bn: "পরিকল্পিত বা জরুরি অ্যাপেন্ডিসেক্টমি।",
        },
    },
];

// Related departments (department detail pages list these). Ids, like doctor.department.
const DEPTS = {
    maternity: ["dept_gynaecology-obstetrics"],
    surgical: ["dept_general-laparoscopic-surgery"],
    "basic-health-check": ["dept_medicine"],
    "executive-health-check": ["dept_medicine"],
    "diabetes-care-check": ["dept_diabetes-endocrinology"],
    "heart-health-check": ["dept_cardiology"],
};

export const packages = rows.map((p, i) => ({
    _id: `pkg_${p.slug}`,
    departments: DEPTS[p.slug] || DEPTS[p.category] || [],
    description: packageContent[p.slug]?.description ?? { en: "", bn: "" },
    whoFor: packageContent[p.slug]?.whoFor ?? null,
    typicalStay: packageContent[p.slug]?.typicalStay ?? null, // CONFIRM
    inclusions: [],
    image: null,
    priceMode: "call", // never show a price on the website (proposal §5.1)
    isFeatured: true,
    isActive: true,
    order: i + 1,
    createdAt: stamp,
    updatedAt: stamp,
    ...p,
}));
