// Mock `doctors` collection. Source: monowarahospital.com profile pages (fetched 2026-10-20).
// Phase 2 migration script replaces/extends this with all 66 profiles.
// - `bmdc` is not published on the old site → null until the client supplies it.
// - Bangla names are left empty (t() falls back to EN) until the client confirms spellings.
// - schedule: BD week (sat…fri), 24h "HH:MM". Typos on the old site normalised — see _placeholders.md.
const stamp = "2026-10-20T00:00:00.000Z";

const doc = (o, i) => ({
    _id: `doc_${o.slug}`,
    bmdc: null,
    phone: null,
    leave: null, // { from, until, note{en,bn} } — "On leave until …" badge (Phase 3)
    isActive: true,
    order: i + 1,
    createdAt: stamp,
    updatedAt: stamp,
    ...o,
});

export const doctors = [
    {
        slug: "dr-nasima-begum",
        name: { en: "Assoc. Prof. Dr. Nasima Begum", bn: "" },
        designation: {
            en: "Associate Professor, Gynae & Obs",
            bn: "সহযোগী অধ্যাপক, গাইনি ও প্রসূতি",
        },
        degrees: "MBBS, FCPS (Gynaecology)",
        specialty: {
            en: "Gynaecologist, Obstetrician & Surgeon — special interest in pain-free normal delivery",
            bn: "",
        },
        department: "dept_gynaecology-obstetrics",
        photo: "/uploads/doctors/dr-nasima-begum.webp",
        schedule: [
            { day: "sat", from: "20:30", to: "23:30" },
            { day: "sun", from: "10:00", to: "12:00" },
            { day: "sun", from: "20:30", to: "22:30" },
            { day: "mon", from: "10:00", to: "12:00" },
            { day: "mon", from: "20:30", to: "22:30" },
            { day: "tue", from: "10:00", to: "12:00" },
            { day: "tue", from: "20:30", to: "22:30" },
            { day: "wed", from: "10:00", to: "12:00" },
            { day: "wed", from: "20:30", to: "22:30" },
            { day: "thu", from: "10:00", to: "12:00" },
            { day: "thu", from: "20:30", to: "22:30" },
        ],
        isFeatured: true,
    },
    {
        slug: "dr-amiruzzaman-khan",
        name: { en: "Assoc. Prof. Dr. Amiruzzaman Khan", bn: "" },
        designation: {
            en: "Associate Professor, Cardiologist",
            bn: "সহযোগী অধ্যাপক, হৃদরোগ বিশেষজ্ঞ",
        },
        degrees: "MBBS, DTM&H (London), D-Card (Dhaka)",
        specialty: {
            en: "Clinical & interventional cardiology — trained in interventional cardiology (USA)",
            bn: "",
        },
        department: "dept_cardiology",
        photo: "/uploads/doctors/dr-amiruzzaman-khan.webp",
        schedule: ["sat", "sun", "mon", "tue", "wed", "thu"].map((day) => ({
            day,
            from: "17:00",
            to: "20:00",
        })),
        isFeatured: true,
    },
    {
        slug: "dr-ishrat-jabeen",
        name: { en: "Asst. Prof. Dr. Ishrat Jabeen", bn: "" },
        designation: { en: "Assistant Professor, Medicine", bn: "সহকারী অধ্যাপক, মেডিসিন" },
        degrees: "MBBS, BCS (Health), MD (Internal Medicine)",
        specialty: { en: "Medicine specialist", bn: "মেডিসিন বিশেষজ্ঞ" },
        department: "dept_medicine",
        photo: "/uploads/doctors/dr-ishrat-jabeen.webp",
        schedule: ["sat", "sun", "mon", "tue", "wed", "thu"].map((day) => ({
            day,
            from: "19:00",
            to: "21:00",
        })),
        isFeatured: true,
    },
    {
        slug: "dr-royes-uddin",
        name: { en: "Assoc. Prof. Dr. Md. Royes Uddin", bn: "" },
        designation: {
            en: "Associate Professor, Gastroliver",
            bn: "সহযোগী অধ্যাপক, গ্যাস্ট্রোলিভার",
        },
        degrees: "MBBS (DMC), FCPS (Medicine), MCPS (Medicine), MD (Gastro, BSMMU)",
        specialty: {
            en: "Medicine, liver, diabetes & stomach — endoscopy and colonoscopy",
            bn: "",
        },
        department: "dept_gastroenterology-liver",
        photo: "/uploads/doctors/dr-royes-uddin.webp",
        schedule: ["sat", "sun", "mon", "wed"].map((day) => ({ day, from: "20:30", to: "21:30" })),
        isFeatured: true,
    },
    {
        slug: "dr-noor-e-ferdous-nimmi",
        name: { en: "Assoc. Prof. Dr. Noor-E-Ferdous (Nimmi)", bn: "" },
        designation: {
            en: "Associate Professor, Gynaecological Oncologist",
            bn: "সহযোগী অধ্যাপক, গাইনি অনকোলজি",
        },
        degrees: "MBBS (DMC), MS (Obs & Gynae), FCPS (Gynaecological Oncology)",
        specialty: { en: "Obstetrics, infertility & gynaecological oncology", bn: "" },
        department: "dept_gynaecology-obstetrics",
        photo: "/uploads/doctors/dr-noor-e-ferdous-nimmi.webp",
        schedule: ["sat", "mon", "wed"].map((day) => ({ day, from: "14:30", to: "15:30" })),
        isFeatured: true,
    },
    {
        slug: "dr-debashish-saha",
        name: { en: "Asst. Prof. Dr. Debashish Saha", bn: "" },
        designation: {
            en: "Assistant Professor, Kidney Specialist",
            bn: "সহকারী অধ্যাপক, কিডনি বিশেষজ্ঞ",
        },
        degrees: "MBBS (Dhaka), BCS (Health), MD (Nephrology)",
        specialty: { en: "Medicine & kidney disease specialist", bn: "" },
        department: "dept_nephrology",
        photo: "/uploads/doctors/dr-debashish-saha.webp",
        schedule: ["sat", "mon", "wed"].map((day) => ({ day, from: "17:00", to: "19:00" })),
        isFeatured: true,
    },
    {
        slug: "dr-mohammad-hanif",
        name: { en: "Asst. Prof. Dr. Mohammad Hanif", bn: "" },
        designation: { en: "Assistant Professor, ENT", bn: "সহকারী অধ্যাপক, নাক-কান-গলা" },
        degrees: "MBBS, BCS (Health), FCPS (ENT Head & Neck Surgery)",
        specialty: { en: "Ear, nose & throat — head and neck surgery", bn: "" },
        department: "dept_ent",
        photo: "/uploads/doctors/dr-mohammad-hanif.webp",
        schedule: [
            { day: "sat", from: "15:00", to: "17:00" },
            { day: "sun", from: "20:00", to: "21:30" },
            { day: "mon", from: "20:00", to: "21:30" },
            { day: "tue", from: "20:00", to: "21:30" },
            { day: "wed", from: "15:00", to: "17:00" },
        ],
        isFeatured: true,
    },
    {
        slug: "dr-khaleda-akter-bhuiyan",
        name: { en: "Asst. Prof. Dr. Khaleda Akter Bhuiyan", bn: "" },
        designation: {
            en: "Assistant Professor, Obs & Gynae",
            bn: "সহকারী অধ্যাপক, প্রসূতি ও স্ত্রীরোগ",
        },
        degrees: "MBBS, BCS (Health), FCPS (Obs & Gynae)",
        specialty: {
            en: "Obs, gynae & infertility — trained in laparoscopic gynae surgery",
            bn: "",
        },
        department: "dept_gynaecology-obstetrics",
        photo: "/uploads/doctors/dr-khaleda-akter-bhuiyan.webp",
        schedule: [
            ...["sat", "sun", "mon", "tue", "wed", "thu"].map((day) => ({
                day,
                from: "16:00",
                to: "18:00",
            })),
            { day: "fri", from: "10:00", to: "12:00" },
        ],
        isFeatured: true,
    },
    {
        slug: "dr-mahfuja-asma",
        name: { en: "Assoc. Prof. Dr. Mahfuja Asma", bn: "" },
        designation: {
            en: "Associate Professor, Obs & Gynae",
            bn: "সহযোগী অধ্যাপক, প্রসূতি ও স্ত্রীরোগ",
        },
        degrees: "MBBS (Dhaka), BCS (Health), FCPS (Gynae & Obs), FCPS (Feto-maternal Medicine)",
        specialty: { en: "Obstetrics & gynaecology — feto-maternal medicine", bn: "" },
        department: "dept_gynaecology-obstetrics",
        photo: "/uploads/doctors/dr-mahfuja-asma.webp",
        schedule: [{ day: "sat", from: "15:00", to: "17:00" }],
        isFeatured: true,
    },
].map(doc);
