// Mock `aesthetic` singleton — MH Aesthetic & Wellness Clinic (sub-brand of Monowara Hospital).
// Facts from monowarahospital.com/mhaesthetic + /aboutmh-aesthetic (read 2026-10-21); copy
// rewritten by STR Solutions. CONFIRM: email domain (.com vs .com.bd — both appear on the old
// site), WhatsApp (page link points to …808, text says …807), treatment details and prices.
const stamp = "2026-10-21T00:00:00.000Z";
const L = (en, bn) => ({ en, bn });

const treatments = [
    {
        slug: "skin-analyzer",
        name: L("Skin analysis", "স্কিন অ্যানালাইসিস"),
        summary: L(
            "A digital scan of your skin's texture, pigmentation and hydration, so treatment starts from facts.",
            "ত্বকের গঠন, দাগ ও আর্দ্রতার ডিজিটাল স্ক্যান — তথ্যের ভিত্তিতে চিকিৎসা শুরু।",
        ),
        image: "/uploads/aesthetic/skin-analyzer.webp",
    },
    {
        slug: "hydrafacial",
        name: L("HydraFacial", "হাইড্রাফেসিয়াল"),
        summary: L(
            "Deep cleansing, gentle exfoliation and hydration in one session, with no downtime.",
            "এক সেশনে গভীর পরিষ্কার, হালকা এক্সফোলিয়েশন ও আর্দ্রতা — বিশ্রামের প্রয়োজন নেই।",
        ),
        image: "/uploads/aesthetic/hydrafacial.webp",
    },
    {
        slug: "laser",
        name: L("Laser treatments", "লেজার ট্রিটমেন্ট"),
        summary: L(
            "Doctor-led laser for unwanted hair, pigmentation and skin rejuvenation.",
            "অবাঞ্ছিত লোম, মেছতা ও ত্বক সতেজ করতে ডাক্তারের তত্ত্বাবধানে লেজার।",
        ),
        image: "/uploads/aesthetic/laser.webp",
    },
    {
        slug: "prp",
        name: L("PRP therapy", "পিআরপি থেরাপি"),
        summary: L(
            "Platelet-rich plasma from your own blood, used for hair thinning and skin quality.",
            "নিজের রক্তের প্লাটিলেট-সমৃদ্ধ প্লাজমা — চুল পাতলা হওয়া ও ত্বকের মান উন্নয়নে।",
        ),
        image: "/uploads/aesthetic/prp.webp",
    },
    {
        slug: "fillers",
        name: L("Dermal fillers", "ডার্মাল ফিলার"),
        summary: L(
            "Hyaluronic-acid fillers for volume loss and lines, planned for a natural result.",
            "হায়ালুরোনিক অ্যাসিড ফিলার — ভাঁজ ও শূন্যতা পূরণে, স্বাভাবিক ফলাফলের পরিকল্পনায়।",
        ),
        image: "/uploads/aesthetic/fillers.webp",
    },
    {
        slug: "glutathione",
        name: L("Glutathione", "গ্লুটাথায়োন"),
        summary: L(
            "Antioxidant therapy offered after a doctor's assessment.",
            "ডাক্তারের মূল্যায়নের পর অ্যান্টিঅক্সিড্যান্ট থেরাপি।",
        ),
        image: "/uploads/aesthetic/glutathione.webp",
    },
    {
        slug: "breast-treatment",
        name: L("Breast treatment", "ব্রেস্ট ট্রিটমেন্ট"),
        summary: L(
            "Consultation with our breast and plastic surgeons for reconstructive and cosmetic options.",
            "রিকনস্ট্রাকটিভ ও কসমেটিক বিকল্পের জন্য ব্রেস্ট ও প্লাস্টিক সার্জনের পরামর্শ।",
        ),
        image: "/uploads/aesthetic/breast-treatment.webp",
    },
    {
        slug: "plastic-burn-surgery",
        name: L("Plastic & burn surgery", "প্লাস্টিক ও বার্ন সার্জারি"),
        summary: L(
            "Scar revision, burn care and reconstructive surgery in the hospital's theatres.",
            "হাসপাতালের থিয়েটারে দাগ সংশোধন, পোড়ার চিকিৎসা ও রিকনস্ট্রাকটিভ সার্জারি।",
        ),
        image: "/uploads/aesthetic/plastic-burn-surgery.webp",
    },
].map((x, i) => ({ _id: `aes_${x.slug}`, isActive: true, order: i + 1, ...x }));

export const aesthetic = {
    _id: "aesthetic_main",
    name: L("MH Aesthetic & Wellness Clinic", "এমএইচ অ্যাসথেটিক অ্যান্ড ওয়েলনেস ক্লিনিক"),
    tagline: L(
        "Doctor-led skin, hair and body care inside Monowara Hospital.",
        "মনোয়ারা হসপিটালের ভেতরে ডাক্তারের তত্ত্বাবধানে ত্বক, চুল ও শরীরের যত্ন।",
    ),
    about: L(
        "MH Aesthetic & Wellness is Monowara Hospital's clinic for aesthetic dermatology, laser and wellness care. Every treatment starts with a consultation with a dermatologist or aesthetic physician, and procedures are carried out by doctors in a hospital setting — with the hospital's specialists, theatres and emergency support in the same building.\n\nOur aim is simple: results that look natural, treatments explained honestly, and a plan that suits your skin and your budget.",
        "এমএইচ অ্যাসথেটিক অ্যান্ড ওয়েলনেস মনোয়ারা হসপিটালের অ্যাসথেটিক ডার্মাটোলজি, লেজার ও ওয়েলনেস ক্লিনিক। প্রতিটি ট্রিটমেন্ট শুরু হয় চর্মরোগ বিশেষজ্ঞ বা অ্যাসথেটিক ফিজিশিয়ানের পরামর্শ দিয়ে, আর প্রসিডিউর করেন ডাক্তাররা হাসপাতালের পরিবেশে — একই ভবনে হাসপাতালের বিশেষজ্ঞ, থিয়েটার ও জরুরি সহায়তাসহ।\n\nআমাদের লক্ষ্য সহজ: স্বাভাবিক দেখতে ফলাফল, সৎভাবে বুঝিয়ে বলা চিকিৎসা, আর আপনার ত্বক ও বাজেটের সাথে মানানসই পরিকল্পনা।",
    ),
    mission: L(
        "Help people look and feel their best by enhancing natural features and supporting overall well-being.",
        "স্বাভাবিক সৌন্দর্য ফুটিয়ে তোলা ও সার্বিক সুস্থতায় সহায়তা করে মানুষকে সেরা অনুভব করতে সাহায্য করা।",
    ),
    vision: L(
        "To be a leading aesthetic and wellness clinic in Dhaka, known for quality, safety and honest advice.",
        "মান, নিরাপত্তা ও সৎ পরামর্শের জন্য ঢাকার শীর্ষ অ্যাসথেটিক ও ওয়েলনেস ক্লিনিক হওয়া।",
    ),
    phone: "01329672808",
    whatsapp: "01329672807", // CONFIRM (old page links …808)
    email: "aesthetic@monowarahospital.com.bd", // CONFIRM .com vs .com.bd
    hours: L("Saturday – Friday, 10am – 7pm", "শনিবার – শুক্রবার, সকাল ১০টা – সন্ধ্যা ৭টা"),
    location: L(
        "Inside Monowara Hospital, 54 Siddeshwari Road, Ramna, Dhaka-1217",
        "মনোয়ারা হসপিটালের ভেতরে, ৫৪ সিদ্ধেশ্বরী রোড, রমনা, ঢাকা-১২১৭",
    ),
    heroImage: "/uploads/hero/mh-aesthetic.webp",
    // Team = doctor ids (populated by the service).
    doctors: [
        "doc_dr-farzana-rahman-shathi",
        "doc_dr-akm-rezaul-karim",
        "doc_dr-syeda-samina-mahjabin",
        "doc_dr-ahmed-ali",
        "doc_humayra-nabi",
    ],
    treatments,
    createdAt: stamp,
    updatedAt: stamp,
};
