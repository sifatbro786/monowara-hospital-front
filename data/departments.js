// Mock `departments` collection (specialties only — facilities & diagnostics are separate
// collections). Phase 2: summaries written from the old site's specialist pages (which only
// had generic copy), images from the old department tiles, `legacySlugs` → 308 redirects.
// Long-form `description` and `services` are written per department in Phase 3.
const stamp = "2026-10-20T00:00:00.000Z";

const rows = [
    {
        slug: "gynaecology-obstetrics",
        name: ["Obstetrics & Gynaecology", "প্রসূতি ও স্ত্রীরোগ"],
        summary: [
            "Antenatal care, normal and caesarean delivery, infertility, gynae oncology and laparoscopic gynae surgery.",
            "গর্ভকালীন সেবা, নরমাল ও সিজারিয়ান ডেলিভারি, বন্ধ্যাত্ব, গাইনি ক্যান্সার ও ল্যাপারোস্কোপিক গাইনি সার্জারি।",
        ],
        legacy: ["gyne-obs-specialist"], // old /gynecology was the Dialysis page
        image: "1.webp",
        isFeatured: true,
    },
    {
        slug: "general-laparoscopic-surgery",
        name: ["General & Laparoscopic Surgery", "জেনারেল ও ল্যাপারোস্কোপিক সার্জারি"],
        summary: [
            "Open and keyhole surgery for gallbladder, hernia, appendix, breast and bowel conditions.",
            "পিত্তথলি, হার্নিয়া, অ্যাপেন্ডিক্স, স্তন ও অন্ত্রের রোগে ওপেন ও ল্যাপারোস্কোপিক সার্জারি।",
        ],
        legacy: ["surgery-specialist"],
        image: "5.webp",
        isFeatured: true,
    },
    {
        slug: "cardiology",
        name: ["Cardiology", "হৃদরোগ"],
        summary: [
            "Heart consultations with ECG, ETT, echocardiography and Holter monitoring in-house.",
            "হাসপাতালেই ইসিজি, ইটিটি, ইকোকার্ডিওগ্রাফি ও হল্টার মনিটরিংসহ হৃদরোগ পরামর্শ।",
        ],
        legacy: ["cardiology-specialist"],
        image: "15.webp",
        isFeatured: true,
    },
    {
        slug: "dermatology-venereology",
        name: ["Dermatology & Venereology", "চর্ম ও যৌনরোগ"],
        summary: [
            "Skin, hair, nail and sexual-health conditions, with aesthetic treatments at MH Aesthetic.",
            "ত্বক, চুল, নখ ও যৌনরোগের চিকিৎসা; অ্যাসথেটিক ট্রিটমেন্ট এমএইচ অ্যাসথেটিকে।",
        ],
        legacy: ["dermatology-venereal-specialist"],
        image: "18.webp",
        isFeatured: true,
    },
    {
        slug: "medicine",
        name: ["Internal Medicine", "মেডিসিন"],
        summary: [
            "Fever, infections, diabetes, blood pressure and long-term care for adults.",
            "জ্বর, সংক্রমণ, ডায়াবেটিস, উচ্চ রক্তচাপ ও প্রাপ্তবয়স্কদের দীর্ঘমেয়াদি চিকিৎসা।",
        ],
        legacy: ["medicine-specialist"],
        image: "3-medi.webp",
        isFeatured: true,
    },
    {
        slug: "paediatrics-neonatology",
        name: ["Paediatrics & Neonatology", "শিশু ও নবজাতক"],
        summary: [
            "Newborn and child care, vaccination advice and a 24/7 NICU for babies who need it.",
            "নবজাতক ও শিশুর চিকিৎসা, টিকা পরামর্শ এবং প্রয়োজনে ২৪/৭ এনআইসিইউ।",
        ],
        legacy: ["child-specialist"],
        image: "4.webp",
    },
    {
        slug: "oncology",
        name: ["Cancer (Oncology)", "ক্যান্সার"],
        summary: [
            "Consultations in clinical, medical and surgical oncology with specialists from NICRH.",
            "জাতীয় ক্যান্সার গবেষণা ইনস্টিটিউটের বিশেষজ্ঞদের ক্লিনিক্যাল, মেডিক্যাল ও সার্জিক্যাল অনকোলজি পরামর্শ।",
        ],
        legacy: ["cancer-specialist"],
        image: "17-cancer.webp",
    },
    {
        slug: "diabetes-endocrinology",
        name: ["Diabetes & Endocrinology", "ডায়াবেটিস ও হরমোন"],
        summary: [
            "Diabetes, thyroid and other hormone disorders, with diet and follow-up plans.",
            "ডায়াবেটিস, থাইরয়েড ও অন্যান্য হরমোনজনিত রোগ, ডায়েট ও ফলো-আপ পরিকল্পনাসহ।",
        ],
        legacy: ["diabetes-specialist"],
        image: "7-dia.webp",
    },
    {
        slug: "gastroenterology-liver",
        name: ["Gastroenterology & Liver", "গ্যাস্ট্রো ও লিভার"],
        summary: [
            "Stomach, bowel and liver disease, with endoscopy and colonoscopy on site.",
            "পাকস্থলী, অন্ত্র ও লিভারের রোগ; হাসপাতালেই এন্ডোস্কপি ও কোলোনোস্কপি।",
        ],
        legacy: ["gastroliver-specialist"],
        image: "10-ges.webp",
    },
    {
        slug: "haematology",
        name: ["Haematology", "রক্তরোগ"],
        summary: [
            "Anaemia, thalassaemia, bleeding disorders and blood cancers.",
            "রক্তস্বল্পতা, থ্যালাসেমিয়া, রক্তক্ষরণজনিত রোগ ও রক্তের ক্যান্সার।",
        ],
        legacy: ["hematology-specialist"],
        image: "21-Hematology-Specialist.webp",
    },
    {
        slug: "nephrology",
        name: ["Kidney (Nephrology)", "কিডনি রোগ"],
        summary: [
            "Kidney disease, high blood pressure and dialysis care.",
            "কিডনি রোগ, উচ্চ রক্তচাপ ও ডায়ালাইসিস সেবা।",
        ],
        legacy: ["kidney-specialist"],
        image: "11-kidy.webp",
    },
    {
        slug: "neurology",
        name: ["Neurology", "নিউরোলজি"],
        summary: [
            "Stroke, headache, epilepsy, nerve problems and brain & spine neurosurgery.",
            "স্ট্রোক, মাথাব্যথা, মৃগী, স্নায়ুর সমস্যা এবং মস্তিষ্ক ও মেরুদণ্ডের নিউরোসার্জারি।",
        ],
        legacy: ["neurology-specialist"],
        image: "9.webp",
    },
    {
        slug: "ent",
        name: ["ENT (Ear, Nose & Throat)", "নাক, কান ও গলা"],
        summary: [
            "Ear, nose, throat and head-neck conditions, including ENT surgery.",
            "নাক, কান, গলা ও হেড-নেকের রোগ এবং নাক-কান-গলার সার্জারি।",
        ],
        legacy: ["nose-ear-throat-specialist"],
        image: "14-nose.webp",
    },
    {
        slug: "orthopaedics",
        name: ["Orthopaedics", "অর্থোপেডিকস"],
        summary: [
            "Fractures, joint pain, spine problems and joint replacement.",
            "হাড় ভাঙা, জয়েন্টের ব্যথা, মেরুদণ্ডের সমস্যা ও জয়েন্ট রিপ্লেসমেন্ট।",
        ],
        legacy: ["orthopedic-specialist"],
        image: "8-ortho.webp",
    },
    {
        slug: "paediatric-cardiology",
        name: ["Paediatric Cardiology", "শিশু হৃদরোগ"],
        summary: [
            "Congenital heart disease and echocardiography for babies and children.",
            "শিশু ও নবজাতকের জন্মগত হৃদরোগ ও ইকোকার্ডিওগ্রাফি।",
        ],
        legacy: ["pediatric-cardiologist"],
        image: "16-p.webp",
    },
    {
        slug: "physical-medicine",
        name: ["Physical Medicine", "ফিজিক্যাল মেডিসিন"],
        summary: [
            "Rehabilitation for arthritis, back and neck pain, and paralysis.",
            "বাত, কোমর ও ঘাড়ের ব্যথা এবং প্যারালাইসিসের রিহ্যাবিলিটেশন।",
        ],
        legacy: ["physical-medicine-specialist"],
        image: "13-phy.webp",
    },
    {
        slug: "physiotherapy",
        name: ["Physiotherapy", "ফিজিওথেরাপি"],
        summary: [
            "Exercise therapy and pain management after injury, surgery or stroke.",
            "আঘাত, অপারেশন বা স্ট্রোকের পর ব্যায়াম থেরাপি ও ব্যথা ব্যবস্থাপনা।",
        ],
        legacy: ["physiotherapy-specialist"],
        image: "20-ph.webp",
    },
    {
        slug: "plastic-surgery",
        name: ["Plastic Surgery", "প্লাস্টিক সার্জারি"],
        summary: [
            "Burn, breast, hand, reconstructive and cosmetic surgery.",
            "বার্ন, ব্রেস্ট, হ্যান্ড, রিকনস্ট্রাকটিভ ও কসমেটিক সার্জারি।",
        ],
        legacy: ["plastic-surgery-specialist", "plastic-surgery"],
        image: "6-plastic.webp",
    },
    {
        slug: "thoracic-surgery",
        name: ["Thoracic Surgery", "থোরাসিক সার্জারি"],
        summary: [
            "Surgery of the chest wall, lungs and the space around them.",
            "বুকের খাঁচা, ফুসফুস ও এর আশপাশের অংশের সার্জারি।",
        ],
        legacy: ["thoracic-specialist"],
        image: "12.webp",
    },
    {
        slug: "urology",
        name: ["Urology", "ইউরোলজি"],
        summary: [
            "Kidney stones, prostate, bladder and urinary problems, including endo-urology.",
            "কিডনিতে পাথর, প্রোস্টেট, মূত্রথলি ও প্রস্রাবের সমস্যা; এন্ডো-ইউরোলজিসহ।",
        ],
        legacy: ["urology-specialist"],
        image: "2-Urology-Specialist.webp",
    },
    {
        slug: "chest-medicine",
        name: ["Chest Medicine", "বক্ষব্যাধি"],
        summary: [
            "Asthma, COPD, allergy, tuberculosis and other lung conditions.",
            "অ্যাজমা, সিওপিডি, অ্যালার্জি, যক্ষ্মা ও ফুসফুসের অন্যান্য রোগ।",
        ],
        legacy: ["chest-medicine"],
        image: null, // no tile on the old site
    },
    {
        slug: "nutrition-diet",
        name: ["Nutrition & Diet", "পুষ্টি ও খাদ্য"],
        summary: [
            "Diet plans for weight, diabetes, pregnancy and long-term conditions.",
            "ওজন, ডায়াবেটিস, গর্ভাবস্থা ও দীর্ঘমেয়াদি রোগের জন্য ডায়েট প্ল্যান।",
        ],
        legacy: ["nutrition-diet-specialist"],
        image: "19.webp",
    },
];

export const departments = rows.map((r, i) => ({
    _id: `dept_${r.slug}`,
    slug: r.slug,
    name: { en: r.name[0], bn: r.name[1] },
    summary: { en: r.summary[0], bn: r.summary[1] },
    description: { en: "", bn: "" },
    services: [],
    image: r.image ? `/uploads/departments/${r.slug}.webp` : null,
    isFeatured: !!r.isFeatured,
    isActive: true,
    order: i + 1,
    seo: { title: { en: "", bn: "" }, description: { en: "", bn: "" } },
    legacySlugs: r.legacy, // old /departments/<slug>/ URLs → data/redirects.mjs
    createdAt: stamp,
    updatedAt: stamp,
}));
