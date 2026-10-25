// Mock `heroSlides` collection — Admin → Hero slider (client requirement §4.2, revised 2026-10-25).
// Per slide only the copy + photo change; the buttons (Book / Emergency / WhatsApp) are common to
// every slide and come from settings, so they are NOT stored here.
// `*text*` in a title marks the one accent phrase (rendered by <Emphasis>).
// `label` = short name in the slider nav. image = full-bleed background (landscape, ≥ 2000px wide);
// image.position = CSS object-position (focal point — keep the subject right of centre on desktop).
// image.source.type "unsplash" = placeholder (free licence) — downloaded locally by
// `node --no-warnings scripts/fetch-stock-images.mjs`; replace with the hospital's own photos.
const stamp = "2026-10-25T00:00:00.000Z";
const L = (en, bn) => ({ en, bn });
const U = (id) => `https://images.unsplash.com/${id}?fm=jpg&q=80&w=2400&fit=crop&auto=format`;

export const heroSlides = [
    {
        _id: "hero_general",
        slug: "general",
        label: L("General care", "সাধারণ চিকিৎসা"),
        eyebrow: L(
            "A multi-specialty hospital in Siddeshwari, Dhaka",
            "সিদ্ধেশ্বরী, ঢাকার একটি বহুমুখী বিশেষায়িত হাসপাতাল",
        ),
        title: L(
            "Trusted care for Dhaka families for over *33 years*.",
            "৩৩ বছরেরও বেশি সময় ধরে ঢাকার পরিবারের *আস্থার* চিকিৎসা।",
        ),
        subtitle: L(
            "Experienced specialists, 24/7 emergency care and modern operation theatres — from your first consultation to recovery, under one roof.",
            "অভিজ্ঞ বিশেষজ্ঞ, ২৪/৭ জরুরি সেবা ও আধুনিক অপারেশন থিয়েটার — প্রথম পরামর্শ থেকে সুস্থ হয়ে ওঠা পর্যন্ত, এক ছাদের নিচে।",
        ),
        image: {
            src: "/uploads/hero/hospital-building-wide.webp",
            alt: L(
                "Monowara Hospital's own building on Siddeshwari Road, Dhaka",
                "সিদ্ধেশ্বরী রোডে মনোয়ারা হসপিটালের নিজস্ব ভবন",
            ),
            position: "72% center",
            source: { type: "own" },
        },
    },
    {
        _id: "hero_bhrpc",
        slug: "bhrpc",
        label: L("Pregnancy care", "গর্ভকালীন সেবা"),
        eyebrow: L("BHRPC · Pregnancy care", "বিএইচআরপিসি · গর্ভকালীন সেবা"),
        title: L(
            "Safe pregnancy, from the first visit to the *first cry*.",
            "প্রথম চেকআপ থেকে *প্রথম কান্না* — নিরাপদ মাতৃত্ব।",
        ),
        subtitle: L(
            "Antenatal check-ups, normal and caesarean delivery, and NICU support — one obstetric team with you at every step.",
            "গর্ভকালীন চেকআপ, স্বাভাবিক ও সিজারিয়ান ডেলিভারি এবং এনআইসিইউ সাপোর্ট — প্রতিটি ধাপে একই প্রসূতি টিম।",
        ),
        image: {
            src: "/uploads/hero/slide-bhrpc.webp",
            alt: L(
                "A doctor talking with a pregnant patient",
                "গর্ভবতী রোগীর সঙ্গে কথা বলছেন একজন ডাক্তার",
            ),
            position: "center",
            source: {
                type: "unsplash",
                url: "https://unsplash.com/photos/a-doctor-talking-to-a-pregnant-woman-in-a-waiting-room-c8fnD1rKGCk",
                download: U("photo-1632053652571-a6a45052bbbd"),
            },
        },
    },
    {
        _id: "hero_emergency",
        slug: "emergency",
        label: L("Emergency 24/7", "জরুরি সেবা ২৪/৭"),
        eyebrow: L("Emergency & critical care · 24/7", "জরুরি ও ক্রিটিক্যাল কেয়ার · ২৪/৭"),
        title: L(
            "When minutes matter, *we are ready*.",
            "প্রতিটি মিনিট যখন জরুরি, *আমরা প্রস্তুত*।",
        ),
        subtitle: L(
            "Round-the-clock emergency doctors, ICU, observation beds and admission — call on the way and we will be waiting.",
            "২৪ ঘণ্টা জরুরি চিকিৎসক, আইসিইউ, অবজারভেশন বেড ও ভর্তি — আসার পথে কল করুন, আমরা প্রস্তুত থাকব।",
        ),
        image: {
            src: "/uploads/hero/slide-emergency.webp",
            alt: L(
                "Medical staff moving a patient along a hospital corridor",
                "হাসপাতালের করিডোরে রোগী নিয়ে যাচ্ছেন মেডিকেল স্টাফ",
            ),
            position: "center",
            source: {
                type: "unsplash",
                url: "https://unsplash.com/photos/medical-staff-transport-patient-down-hospital-hallway-OLO28JXWv98",
                download: U("photo-1758653500534-a47f6cd8abb0"),
            },
        },
    },
    {
        _id: "hero_diagnostics",
        slug: "diagnostics",
        label: L("Diagnostics", "ডায়াগনস্টিকস"),
        eyebrow: L("Diagnostics & imaging", "ডায়াগনস্টিকস ও ইমেজিং"),
        title: L(
            "CT scan, X-ray and lab, *under one roof*.",
            "সিটি স্ক্যান, এক্স-রে ও ল্যাব — *এক ছাদের নিচে*।",
        ),
        subtitle: L(
            "Tests ordered in the chamber are done in-house, with reports reviewed by our specialists.",
            "চেম্বারে দেওয়া পরীক্ষাগুলো হাসপাতালেই করা হয়, রিপোর্ট দেখেন আমাদের বিশেষজ্ঞরা।",
        ),
        image: {
            src: "/uploads/hero/slide-diagnostics.webp",
            alt: L("Imaging machine in a clinic", "ক্লিনিকের ইমেজিং মেশিন"),
            position: "center",
            source: {
                type: "unsplash",
                url: "https://unsplash.com/photos/medical-radiation-therapy-machine-in-clinic-QTP8UKW_PgI",
                download: U("photo-1666214280352-db292c05fd80"),
            },
        },
    },
    {
        _id: "hero_aesthetic",
        slug: "mh-aesthetic",
        label: L("MH Aesthetic", "এমএইচ অ্যাসথেটিক"),
        eyebrow: L("MH Aesthetic & Wellness Clinic", "এমএইচ অ্যাসথেটিক অ্যান্ড ওয়েলনেস ক্লিনিক"),
        title: L(
            "Skin, hair and aesthetic care, *led by specialists*.",
            "*বিশেষজ্ঞদের তত্ত্বাবধানে* ত্বক, চুল ও অ্যাসথেটিক সেবা।",
        ),
        subtitle: L(
            "Skin analysis, HydraFacial, laser, PRP and more — Saturday to Friday, 10am–7pm.",
            "স্কিন অ্যানালাইসিস, হাইড্রাফেসিয়াল, লেজার, পিআরপি ও আরও অনেক — শনি থেকে শুক্র, সকাল ১০টা–সন্ধ্যা ৭টা।",
        ),
        image: {
            src: "/uploads/hero/slide-aesthetic.webp",
            alt: L(
                "A specialist giving a facial treatment",
                "ফেসিয়াল ট্রিটমেন্ট দিচ্ছেন একজন বিশেষজ্ঞ",
            ),
            position: "center",
            source: {
                type: "unsplash",
                url: "https://unsplash.com/photos/a-woman-getting-a-facial-peel-from-a-doctor-HtXyytr9304",
                download: U("photo-1713085085470-fba013d67e65"),
            },
        },
    },
].map((s, i) => ({ ...s, order: i + 1, isActive: true, createdAt: stamp, updatedAt: stamp }));
