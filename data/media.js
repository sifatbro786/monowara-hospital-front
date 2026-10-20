// Mock `media` collection — every replaceable image slot on the site, keyed by `key`.
// Future admin page "Media management" lists these slots and uploads a new file per slot
// (multer + sharp → /uploads/media/…); pages read them via lib/api/media.js `getMedia()`.
// `source.type`: "own" (hospital's photo) | "unsplash" (placeholder, free licence — replace
// with real photography before launch). Stock files are downloaded locally by
// `node --no-warnings scripts/fetch-stock-images.mjs` (the build sandbox can't reach Unsplash).
// `position` = CSS object-position (focal point). `overlay` = 0–1 strength of the teal wash.
const L = (en, bn) => ({ en, bn });
const U = (id) => `https://images.unsplash.com/${id}?fm=jpg&q=80&w=2400&fit=crop&auto=format`;

const rows = [
    {
        key: "header.doctors",
        page: "/doctors",
        src: "/uploads/media/header-doctors.webp",
        alt: L("Stethoscope on a doctor's desk", "ডাক্তারের টেবিলে স্টেথোস্কোপ"),
        source: {
            type: "unsplash",
            url: "https://unsplash.com/photos/black-and-gray-stethoscope-yo01Z-9HQAw",
            download: U("photo-1505751172876-fa1923c5c528"),
        },
    },
    {
        key: "header.departments",
        page: "/departments",
        src: "/uploads/media/header-departments.webp",
        alt: L("Doctors walking along a hospital corridor", "হাসপাতালের করিডোরে হাঁটছেন ডাক্তাররা"),
        source: {
            type: "unsplash",
            url: "https://unsplash.com/photos/group-of-doctors-walking-on-hospital-hallway-Pd4lRfKo16U",
            download: U("photo-1516841273335-e39b37888115"),
        },
    },
    {
        key: "header.diagnostics",
        page: "/diagnostics",
        src: "/uploads/media/header-diagnostics.webp",
        alt: L("Laboratory analyser", "ল্যাবরেটরি অ্যানালাইজার"),
        source: {
            type: "unsplash",
            url: "https://unsplash.com/photos/woman-standing-in-front-of-the-digital-machine-oCLuFi9GYNA",
            download: U("photo-1579154204601-01588f351e67"),
        },
    },
    {
        key: "header.packages",
        page: "/packages",
        src: "/uploads/media/header-packages.webp",
        alt: L("Blood pressure check", "রক্তচাপ পরীক্ষা"),
        source: {
            type: "unsplash",
            url: "https://unsplash.com/photos/a-doctor-checking-the-blood-pressure-of-a-patient-XdErxxR6Xog",
            download: U("photo-1631815587646-b85a1bb027e1"),
        },
    },
    {
        key: "header.appointment",
        page: "/appointment",
        src: "/uploads/media/header-appointment.webp",
        alt: L("Stethoscope and blood pressure gauge", "স্টেথোস্কোপ ও রক্তচাপ মাপার যন্ত্র"),
        source: {
            type: "unsplash",
            url: "https://unsplash.com/photos/stethoscope-and-blood-pressure-gauge-njrDE70M2VI",
            download: U("photo-1700832082200-af7deeb63d9b"),
        },
    },
    {
        key: "header.healthTips",
        page: "/health-tips",
        src: "/uploads/media/header-health-tips.webp",
        alt: L("Bowl of fresh vegetables", "তাজা সবজির বাটি"),
        source: {
            type: "unsplash",
            url: "https://unsplash.com/photos/bowl-of-vegetable-salads-IGfIGP5ONV0",
            download: U("photo-1512621776951-a57141f2eefd"),
        },
    },
    {
        key: "header.talks",
        page: "/expert-talks",
        src: "/uploads/media/header-talks.webp",
        alt: L("Studio microphone", "স্টুডিও মাইক্রোফোন"),
        source: {
            type: "unsplash",
            url: "https://unsplash.com/photos/macro-photography-of-silver-and-black-studio-microphone-condenser-c1ZN57GfDB0",
            download: U("photo-1478737270239-2f02b77fc618"),
        },
    },
    {
        key: "header.careers",
        page: "/careers",
        src: "/uploads/media/header-careers.webp",
        alt: L("Surgical team under the operating light", "অপারেশন লাইটের নিচে সার্জিক্যাল টিম"),
        source: {
            type: "unsplash",
            url: "https://unsplash.com/photos/surgeons-looking-down-under-operating-light-701-FJcjLAQ",
            download: U("photo-1579684385127-1ef15d508118"),
        },
    },
    {
        key: "header.contact",
        page: "/contact",
        src: "/uploads/media/header-contact.webp",
        alt: L("Hospital reception", "হাসপাতালের রিসেপশন"),
        source: {
            type: "unsplash",
            url: "https://unsplash.com/photos/hospital-lobby-reception-with-signage-nMyM7fxpokE",
            download: U("photo-1519494026892-80bbd2d6fd0d"),
        },
    },
    {
        key: "header.patientsVisitors",
        page: "/patients-visitors",
        src: "/uploads/media/header-patients-visitors.webp",
        alt: L("Waiting area chairs", "অপেক্ষার জায়গার চেয়ার"),
        source: {
            type: "unsplash",
            url: "https://unsplash.com/photos/brown-and-white-padded-armchairs-FFA8yd4OynY",
            download: U("photo-1581982231900-6a1a46b744c9"),
        },
    },
    {
        key: "header.emergency",
        page: "/emergency",
        src: "/uploads/media/header-emergency.webp",
        alt: L("Ambulance with lights on at night", "রাতে আলো জ্বালানো অ্যাম্বুলেন্স"),
        source: {
            type: "unsplash",
            url: "https://unsplash.com/photos/an-ambulance-is-driving-down-the-street-with-its-lights-on-UmqF84xPUX4",
            download: U("photo-1647446732151-5b0cdc252b4d"),
        },
        overlay: 0.9,
    },
    // ── the hospital's own photos ──
    {
        key: "header.gallery",
        page: "/gallery",
        src: "/uploads/hero/hospital-building-wide.webp",
        alt: L("Monowara Hospital building, Siddeshwari", "মনোয়ারা হসপিটাল ভবন, সিদ্ধেশ্বরী"),
        source: { type: "own" },
    },
    {
        key: "header.management",
        page: "/about/management",
        src: "/uploads/hero/hospital-building-wide.webp",
        alt: L("Monowara Hospital building, Siddeshwari", "মনোয়ারা হসপিটাল ভবন, সিদ্ধেশ্বরী"),
        source: { type: "own" },
    },
    {
        key: "header.bhrpc",
        page: "/bhrpc",
        src: "/uploads/media/header-bhrpc.webp",
        alt: L("Expecting mother", "অন্তঃসত্ত্বা মা"),
        source: { type: "own" }, // old site's BHRPC page banner
        position: "75% center",
        overlay: 0.75,
    },
    {
        key: "header.mhAesthetic",
        page: "/mh-aesthetic",
        src: "/uploads/media/header-mh-aesthetic.webp",
        alt: L("MH Aesthetic lounge", "এমএইচ অ্যাসথেটিক লাউঞ্জ"),
        source: { type: "own" }, // old site's aesthetic section background
    },
    {
        key: "aesthetic.reception",
        page: "/mh-aesthetic",
        src: "/uploads/aesthetic/reception.webp",
        alt: L("MH Aesthetic reception", "এমএইচ অ্যাসথেটিক রিসেপশন"),
        source: { type: "own" },
    },
];

export const media = rows.map((r, i) => ({
    _id: `media_${r.key.replace(/\W+/g, "-")}`,
    position: "center",
    overlay: 0.82,
    isActive: true,
    order: i + 1,
    ...r,
}));
