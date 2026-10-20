// Mock `facilities` collection (services & facilities pages, proposal §5.1).
// Phase 2: summaries written by us from the old site's facility pages; images from the old
// facility tiles (run scripts/fetch-wp-images.mjs for the ones marked "download").
import { facilityContent } from "./service-content.js";

const stamp = "2026-10-20T00:00:00.000Z";

const rows = [
    {
        slug: "emergency",
        name: ["24/7 Emergency Unit", "২৪/৭ জরুরি বিভাগ"],
        summary: [
            "Doctors on duty round the clock for accidents, sudden illness and admissions.",
            "দুর্ঘটনা, হঠাৎ অসুস্থতা ও ভর্তির জন্য ২৪ ঘণ্টা ডিউটি ডাক্তার।",
        ],
        is24x7: true,
        image: "emergency.webp", // download
        legacy: ["emergency", "chest-and-medicine"],
    },
    {
        slug: "operation-theatres",
        name: ["Operation Theatres", "অপারেশন থিয়েটার"],
        summary: [
            "Modular theatres for general, laparoscopic, gynae and orthopaedic surgery.",
            "জেনারেল, ল্যাপারোস্কোপিক, গাইনি ও অর্থোপেডিক সার্জারির জন্য আধুনিক থিয়েটার।",
        ],
        is24x7: false,
        image: "operation-theatre.webp",
        legacy: ["operation-suite"],
    },
    {
        slug: "icu",
        name: ["Intensive Care Unit (ICU)", "আইসিইউ"],
        summary: [
            "Monitored beds and ventilator support for critically ill patients.",
            "গুরুতর অসুস্থ রোগীদের জন্য মনিটরযুক্ত বেড ও ভেন্টিলেটর সাপোর্ট।",
        ],
        is24x7: true,
        image: "icu.webp", // download
        legacy: ["icu"],
    },
    {
        slug: "nicu",
        name: ["Neonatal ICU (NICU)", "এনআইসিইউ"],
        summary: [
            "Special care for premature and unwell newborns, next to the maternity ward.",
            "প্রিম্যাচিউর ও অসুস্থ নবজাতকের বিশেষ সেবা, মাতৃসেবা ওয়ার্ডের পাশেই।",
        ],
        is24x7: true,
        image: "nicu.webp",
        legacy: ["nicu"],
    },
    {
        slug: "dialysis",
        name: ["Dialysis", "ডায়ালাইসিস"],
        summary: [
            "Scheduled haemodialysis sessions under a kidney specialist.",
            "কিডনি বিশেষজ্ঞের তত্ত্বাবধানে নির্ধারিত সময়ে হিমোডায়ালাইসিস।",
        ],
        is24x7: false,
        image: "dialysis.webp",
        legacy: ["gynecology"], // old site's "gynecology" page showed Dialysis
    },
    {
        slug: "ambulance",
        name: ["24/7 Ambulance", "২৪/৭ অ্যাম্বুলেন্স"],
        summary: [
            "Ambulance service any time of day — call the emergency line.",
            "দিন-রাত যেকোনো সময় অ্যাম্বুলেন্স — জরুরি নম্বরে কল করুন।",
        ],
        is24x7: true,
        image: "ambulance-card.webp",
        legacy: ["24-7-ambulance-service"],
    },
    {
        slug: "pharmacy",
        name: ["Pharmacy", "ফার্মেসি"],
        summary: [
            "In-house pharmacy open round the clock for inpatients and visitors.",
            "ভর্তি রোগী ও দর্শনার্থীদের জন্য ২৪ ঘণ্টা খোলা নিজস্ব ফার্মেসি।",
        ],
        is24x7: true,
        image: "pharmacy.webp", // download
        legacy: ["pathology"], // old site's "pathology" page showed the pharmacy photo
    },
    {
        slug: "blood-bank",
        name: ["Blood Bank", "ব্লাড ব্যাংক"],
        summary: [
            "Blood grouping, cross-matching and screened blood for surgery and emergencies.",
            "রক্তের গ্রুপ নির্ণয়, ক্রস-ম্যাচিং এবং অপারেশন ও জরুরি প্রয়োজনে স্ক্রিনিং করা রক্ত।",
        ],
        is24x7: false,
        image: "blood-bank.webp", // download
        legacy: ["radiology"], // old site's "radiology" page showed the blood-bank photo
    },
    {
        slug: "opd-chambers",
        name: ["OPD Doctors' Chambers", "ওপিডি ডাক্তার চেম্বার"],
        summary: [
            "Specialist chambers seven days a week — book a serial by phone or WhatsApp.",
            "সপ্তাহে ৭ দিন বিশেষজ্ঞ চেম্বার — ফোন বা হোয়াটসঅ্যাপে সিরিয়াল নিন।",
        ],
        is24x7: false,
        image: "opd-chambers.webp", // download
        legacy: ["opd-doctors-chamber"],
    },
    {
        slug: "reception",
        name: ["24/7 Reception", "২৪/৭ রিসেপশন"],
        summary: [
            "Front desk for serials, admissions and billing, open day and night.",
            "সিরিয়াল, ভর্তি ও বিলিংয়ের জন্য দিন-রাত খোলা ফ্রন্ট ডেস্ক।",
        ],
        is24x7: true,
        image: "reception.webp", // download
        legacy: ["24-7-reception"],
    },
];

export const facilities = rows.map((r, i) => ({
    _id: `fac_${r.slug}`,
    slug: r.slug,
    name: { en: r.name[0], bn: r.name[1] },
    summary: { en: r.summary[0], bn: r.summary[1] },
    description: facilityContent[r.slug]?.description ?? { en: "", bn: "" },
    features: facilityContent[r.slug]?.features ?? [], // [{ en, bn }]
    whenTo: facilityContent[r.slug]?.whenTo ?? null, // optional "when to come" note
    is24x7: r.is24x7,
    image: r.image ? `/uploads/facilities/${r.image}` : null,
    isActive: true,
    order: i + 1,
    legacySlugs: r.legacy, // old /departments/<slug>/ URLs (WP filed facilities under departments)
    createdAt: stamp,
    updatedAt: stamp,
}));
