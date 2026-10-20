// Mock `heroSlides` collection — editable from admin later (client requirement §4.2).
// Slide themes follow the current site's 4-slide hero. Media are placeholders until
// the client's own photography arrives (see data/_placeholders.md).
// cardMedia = homepage hero photo card (5:4); wideMedia = wide banner; media = portrait/fallback.
// `*text*` in a title marks the one italic-serif accent phrase (rendered by <Emphasis>).
export const heroSlides = [
    {
        _id: "hero_general",
        slug: "general",
        eyebrow: {
            en: "A multi-specialty hospital in Siddeshwari, Dhaka",
            bn: "সিদ্ধেশ্বরী, ঢাকার একটি বহুমুখী বিশেষায়িত হাসপাতাল",
        },
        title: {
            en: "Trusted care for Dhaka families for over *33 years*.",
            bn: "৩৩ বছরেরও বেশি সময় ধরে ঢাকার পরিবারের *আস্থার* চিকিৎসা।",
        },
        subtitle: {
            en: "Experienced specialists, 24/7 emergency care and modern operation theatres — from your first consultation to recovery, under one roof.",
            bn: "অভিজ্ঞ বিশেষজ্ঞ, ২৪/৭ জরুরি সেবা ও আধুনিক অপারেশন থিয়েটার — প্রথম পরামর্শ থেকে সুস্থ হয়ে ওঠা পর্যন্ত, এক ছাদের নিচে।",
        },
        primaryCta: {
            kind: "appointment",
            label: { en: "Book an appointment", bn: "অ্যাপয়েন্টমেন্ট নিন" },
        },
        secondaryCta: { kind: "whatsapp", label: { en: "WhatsApp us", bn: "হোয়াটসঅ্যাপ করুন" } },
        cardMedia: {
            type: "image",
            src: "/uploads/hero/hospital-building-card.webp",
            alt: {
                en: "Monowara Hospital's own building on Siddeshwari Road, Dhaka",
                bn: "সিদ্ধেশ্বরী রোডে মনোয়ারা হসপিটালের নিজস্ব ভবন",
            },
        },
        wideMedia: {
            type: "image",
            src: "/uploads/hero/hospital-building-wide.webp",
            alt: {
                en: "Monowara Hospital's own building on Siddeshwari Road, Dhaka",
                bn: "সিদ্ধেশ্বরী রোডে মনোয়ারা হসপিটালের নিজস্ব ভবন",
            },
        },
        media: {
            type: "image",
            src: "/uploads/hero/hospital-building.webp",
            alt: {
                en: "Monowara Hospital's own building on Siddeshwari Road, Dhaka",
                bn: "সিদ্ধেশ্বরী রোডে মনোয়ারা হসপিটালের নিজস্ব ভবন",
            },
        },
        order: 1,
        isActive: true,
        createdAt: "2026-10-20T00:00:00.000Z",
        updatedAt: "2026-10-20T00:00:00.000Z",
    },
    {
        _id: "hero_bhrpc",
        slug: "bhrpc",
        eyebrow: { en: "BHRPC · Pregnancy care", bn: "বিএইচআরপিসি · গর্ভকালীন সেবা" },
        title: {
            en: "Safe pregnancy, from the first visit to the first cry.",
            bn: "প্রথম চেকআপ থেকে প্রথম কান্না — নিরাপদ মাতৃত্ব।",
        },
        subtitle: {
            en: "Antenatal care, normal and caesarean delivery, and NICU support.",
            bn: "গর্ভকালীন চেকআপ, স্বাভাবিক ও সিজারিয়ান ডেলিভারি এবং এনআইসিইউ সাপোর্ট।",
        },
        primaryCta: {
            kind: "link",
            href: "/bhrpc",
            label: { en: "Pregnancy care", bn: "গর্ভকালীন সেবা" },
        },
        secondaryCta: {
            kind: "appointment",
            label: { en: "Book an appointment", bn: "অ্যাপয়েন্টমেন্ট নিন" },
        },
        media: {
            type: "image",
            src: "/uploads/hero/bhrpc.webp",
            alt: { en: "The BHRPC pregnancy care team", bn: "বিএইচআরপিসি গর্ভকালীন সেবা টিম" },
        },
        order: 2,
        isActive: true,
        createdAt: "2026-10-20T00:00:00.000Z",
        updatedAt: "2026-10-20T00:00:00.000Z",
    },
    {
        _id: "hero_aesthetic",
        slug: "mh-aesthetic",
        eyebrow: {
            en: "MH Aesthetic & Wellness Clinic",
            bn: "এমএইচ অ্যাসথেটিক অ্যান্ড ওয়েলনেস ক্লিনিক",
        },
        title: {
            en: "Skin, hair and aesthetic care, led by specialists.",
            bn: "বিশেষজ্ঞদের তত্ত্বাবধানে ত্বক, চুল ও অ্যাসথেটিক সেবা।",
        },
        subtitle: {
            en: "Skin analysis, HydraFacial, laser, PRP and more — Saturday to Friday, 10am–7pm.",
            bn: "স্কিন অ্যানালাইসিস, হাইড্রাফেসিয়াল, লেজার, পিআরপি ও আরও অনেক — শনি থেকে শুক্র, সকাল ১০টা–সন্ধ্যা ৭টা।",
        },
        primaryCta: {
            kind: "link",
            href: "/mh-aesthetic",
            label: { en: "Explore MH Aesthetic", bn: "এমএইচ অ্যাসথেটিক দেখুন" },
        },
        secondaryCta: {
            kind: "whatsapp",
            number: "01329672807",
            label: { en: "WhatsApp the clinic", bn: "ক্লিনিকে হোয়াটসঅ্যাপ করুন" },
        },
        media: {
            type: "image",
            src: "/uploads/hero/mh-aesthetic.webp",
            alt: {
                en: "Treatment room at MH Aesthetic & Wellness Clinic",
                bn: "এমএইচ অ্যাসথেটিক ক্লিনিকের ট্রিটমেন্ট রুম",
            },
        },
        order: 3,
        isActive: true,
        createdAt: "2026-10-20T00:00:00.000Z",
        updatedAt: "2026-10-20T00:00:00.000Z",
    },
    {
        _id: "hero_ct",
        slug: "ct-scan",
        eyebrow: { en: "Diagnostics & imaging", bn: "ডায়াগনস্টিকস ও ইমেজিং" },
        title: {
            en: "CT scan, X-ray and lab — under the same roof as your doctor.",
            bn: "সিটি স্ক্যান, এক্স-রে ও ল্যাব — আপনার ডাক্তারের একই ছাদের নিচে।",
        },
        subtitle: {
            en: "Tests ordered in the chamber are done in-house, with reports reviewed by our specialists.",
            bn: "চেম্বারে দেওয়া পরীক্ষাগুলো হাসপাতালেই করা হয়, রিপোর্ট দেখেন আমাদের বিশেষজ্ঞরা।",
        },
        primaryCta: {
            kind: "link",
            href: "/diagnostics",
            label: { en: "See diagnostics", bn: "ডায়াগনস্টিকস দেখুন" },
        },
        secondaryCta: {
            kind: "appointment",
            label: { en: "Call for a test serial", bn: "পরীক্ষার সিরিয়ালের জন্য কল করুন" },
        },
        media: {
            type: "image",
            src: "/uploads/hero/ct-scan.webp",
            alt: { en: "CT scan room", bn: "সিটি স্ক্যান রুম" },
        },
        order: 4,
        isActive: true,
        createdAt: "2026-10-20T00:00:00.000Z",
        updatedAt: "2026-10-20T00:00:00.000Z",
    },
];
