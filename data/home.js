// Homepage blocks editable from admin later ("Content → homepage banners and numbers").
// Copy for centres/numbers follows the client's chosen concept (MH_Website_Concept.pdf).
const stamp = "2026-10-20T00:00:00.000Z";

export const keyNumbers = [
    {
        _id: "num_years",
        value: { en: "33+", bn: "৩৩+" },
        label: { en: "years serving Dhaka", bn: "বছর ধরে ঢাকায় সেবা" },
        order: 1,
        isActive: true,
    },
    {
        _id: "num_beds",
        value: { en: "100", bn: "১০০" },
        label: { en: "inpatient beds", bn: "ইনপেশেন্ট বেড" },
        order: 2,
        isActive: true,
    },
    {
        _id: "num_247",
        value: { en: "24/7", bn: "২৪/৭" },
        label: { en: "emergency & admission", bn: "জরুরি সেবা ও ভর্তি" },
        order: 3,
        isActive: true,
    },
    {
        _id: "num_days",
        value: { en: "7 days", bn: "৭ দিন" },
        label: { en: "specialist consultations", bn: "বিশেষজ্ঞ পরামর্শ" },
        order: 4,
        isActive: true,
    },
];

// Centres of excellence — each links to a department, facility or diagnostics page.
export const centres = [
    {
        _id: "ctr_obgyn",
        title: { en: "Obstetrics & Gynaecology", bn: "প্রসূতি ও স্ত্রীরোগ" },
        summary: {
            en: "Antenatal care, normal and C-section delivery, and women's health.",
            bn: "গর্ভকালীন সেবা, নরমাল ও সিজারিয়ান ডেলিভারি এবং নারীস্বাস্থ্য।",
        },
        href: "/departments/gynaecology-obstetrics",
        image: "/uploads/facilities/nicu.webp",
    },
    {
        _id: "ctr_surgery",
        title: { en: "General & Laparoscopic Surgery", bn: "জেনারেল ও ল্যাপারোস্কোপিক সার্জারি" },
        summary: {
            en: "Modern operation theatres for open, laparoscopic and endoscopic procedures.",
            bn: "ওপেন, ল্যাপারোস্কোপিক ও এন্ডোস্কোপিক প্রসিডিউরের জন্য আধুনিক অপারেশন থিয়েটার।",
        },
        href: "/departments/general-laparoscopic-surgery",
        image: "/uploads/facilities/operation-theatre.webp",
    },
    {
        _id: "ctr_cardio",
        title: { en: "Cardiology", bn: "হৃদরোগ" },
        summary: {
            en: "Heart consultations, ECG, echocardiography and follow-up care.",
            bn: "হৃদরোগ পরামর্শ, ইসিজি, ইকোকার্ডিওগ্রাফি ও ফলো-আপ।",
        },
        href: "/departments/cardiology",
        image: null, // CONFIRM: no cardiology photo yet → hover falls back to the building
    },
    {
        _id: "ctr_derm",
        title: { en: "Dermatology", bn: "চর্মরোগ" },
        summary: {
            en: "Diagnosis and treatment of skin, hair and nail conditions.",
            bn: "ত্বক, চুল ও নখের রোগ নির্ণয় ও চিকিৎসা।",
        },
        href: "/departments/dermatology-venereology",
        image: "/uploads/hero/mh-aesthetic.webp",
    },
    {
        _id: "ctr_emergency",
        title: { en: "Emergency & Critical Care", bn: "জরুরি ও ক্রিটিক্যাল কেয়ার" },
        summary: {
            en: "Round-the-clock emergency team, ICU, observation and admission.",
            bn: "২৪ ঘণ্টা জরুরি টিম, আইসিইউ, পর্যবেক্ষণ ও ভর্তি।",
        },
        href: "/facilities/emergency",
        image: "/uploads/facilities/ward.webp",
    },
    {
        _id: "ctr_medicine",
        title: { en: "Internal Medicine", bn: "মেডিসিন" },
        summary: {
            en: "Diabetes, hypertension and long-term care for adults.",
            bn: "ডায়াবেটিস, উচ্চ রক্তচাপ ও দীর্ঘমেয়াদি চিকিৎসা।",
        },
        href: "/departments/medicine",
        image: "/uploads/facilities/blood-collection.webp",
    },
    {
        _id: "ctr_endoscopy",
        title: { en: "Endoscopy", bn: "এন্ডোস্কপি" },
        summary: {
            en: "Diagnostic and therapeutic endoscopy and colonoscopy.",
            bn: "রোগ নির্ণয় ও চিকিৎসায় এন্ডোস্কপি ও কোলোনোস্কপি।",
        },
        href: "/diagnostics/endoscopy-colonoscopy",
        image: null, // CONFIRM: no endoscopy photo yet → hover falls back to the building
    },
    {
        _id: "ctr_imaging",
        title: { en: "Diagnostics & Imaging", bn: "ডায়াগনস্টিকস ও ইমেজিং" },
        summary: {
            en: "Pathology, CT scan, X-ray and ultrasound under one roof.",
            bn: "প্যাথলজি, সিটি স্ক্যান, এক্স-রে ও আল্ট্রাসাউন্ড এক ছাদের নিচে।",
        },
        href: "/diagnostics",
        image: "/uploads/facilities/ct-scan-room.webp",
    },
].map((c, i) => ({ ...c, order: i + 1, isActive: true, createdAt: stamp, updatedAt: stamp }));

// Expert talks — the hospital's own YouTube channel (titles from YouTube oEmbed).
export const talks = [
    {
        _id: "talk_usg_pregnancy",
        youtubeId: "BriBQgWl28Y",
        title: {
            en: "How many ultrasounds are safe during pregnancy?",
            bn: "পুরো প্রেগনেন্সিতে কত বার আল্ট্রাসনোগ্রাফি করা নিরাপদ?",
        },
        speaker: { en: "Maternity care", bn: "মাতৃসেবা" },
    },
    {
        _id: "talk_surgery",
        youtubeId: "54Q9fd86xXQ",
        title: {
            en: "Over 25 years of surgical care",
            bn: "২৫ বছরেরও বেশি সময় ধরে সার্জারি সেবা",
        },
        speaker: { en: "Monowara Hospital", bn: "মনোয়ারা হসপিটাল" },
    },
    {
        _id: "talk_endoscopy",
        youtubeId: "mxcsFgmUm0A",
        title: { en: "Upper GI endoscopy, explained", bn: "আপার জি আই এন্ডোস্কপি" },
        speaker: { en: "Dr. Royes Uddin · Gastroliver", bn: "ডা. রয়েস উদ্দিন · গ্যাস্ট্রোলিভার" },
    },
].map((v, i) => ({ ...v, order: i + 1, isActive: true, createdAt: stamp, updatedAt: stamp }));

// Patient stories need written consent (proposal §3) — empty until the client supplies them.
// Shape: { _id, quote{en,bn}, name{en,bn}, context{en,bn}?, consent: { confirmed: true, date, recordedBy },
//          isActive, order, createdAt, updatedAt }. Rendered only when consent.confirmed is true.
export const stories = [];
