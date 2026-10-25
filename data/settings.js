// Mock of the `settings` singleton document (Mongo). Shape must match mh-api's Settings model.
// Values marked CONFIRM are taken from monowarahospital.com but desk labels/primary flags
// are our assumption until the client confirms (master plan §7).
export const settings = {
    _id: "settings_main",
    siteName: { en: "Monowara Hospital", bn: "মনোয়ারা হসপিটাল" },
    legalName: { en: "Monowara Hospital (Pvt.) Ltd.", bn: "মনোয়ারা হসপিটাল (প্রা.) লি." },

    hotline: "09611622333",
    emergency: "01789446240", // CONFIRM: concept PDF shows this as Emergency
    ambulance: "01789446240", // CONFIRM: no separate ambulance number published yet
    landline: null, // CONFIRM
    phones: [
        {
            label: { en: "Front desk", bn: "ফ্রন্ট ডেস্ক" },
            number: "01715839400",
            order: 1,
            isActive: true,
        },
        {
            label: { en: "Front desk", bn: "ফ্রন্ট ডেস্ক" },
            number: "01767173195",
            order: 2,
            isActive: true,
        },
    ],

    whatsappNumbers: [
        {
            _id: "wa_appointment",
            label: { en: "Appointments & serial", bn: "অ্যাপয়েন্টমেন্ট ও সিরিয়াল" },
            number: "01301435549", // CONFIRM: header number on current site
            isPrimary: true,
            isActive: true,
            order: 1,
        },
        {
            _id: "wa_emergency",
            label: { en: "Emergency & admission", bn: "জরুরি ও ভর্তি" },
            number: "01789446240", // CONFIRM
            isPrimary: false,
            isActive: true,
            order: 2,
        },
        {
            _id: "wa_aesthetic",
            label: { en: "MH Aesthetic & Wellness", bn: "এমএইচ অ্যাসথেটিক" },
            number: "01329672807",
            isPrimary: false,
            isActive: true,
            order: 3,
        },
    ],

    bookingMode: "numbers", // "numbers" | "form" | "both"

    // Homepage hero slider — Admin → Settings → Hero slider (seconds per slide, 2–15).
    heroSlider: { intervalSec: 5 },

    email: "info@monowarahospital.com", // CONFIRM .com vs .com.bd
    address: {
        en: "54, Siddeshwari Road, Ramna, Dhaka-1217",
        bn: "৫৪, সিদ্ধেশ্বরী রোড, রমনা, ঢাকা-১২১৭",
    },
    hours: {
        emergency: { en: "24 hours, 7 days", bn: "২৪ ঘণ্টা, সপ্তাহে ৭ দিন" },
        opd: { en: "Specialist chambers 7 days a week", bn: "সপ্তাহে ৭ দিন বিশেষজ্ঞ চেম্বার" }, // CONFIRM times
    },
    dghsLicence: null, // CONFIRM — shown in footer once set
    yearsServing: 33, // CONFIRM 33+ vs 34+

    socials: {
        facebook: "https://facebook.com/monowarahospitalpvtltd",
        instagram: "https://instagram.com/monowarahospital",
        youtube: "https://www.youtube.com/@monowarahospitalpvtltd",
        linkedin: null,
    },
    map: {
        embed: "https://maps.google.com/maps?q=Monowara%20Hospital%20%28Pvt.%29%20Limited&t=m&z=16&output=embed&iwloc=near",
        directions:
            "https://www.google.com/maps/dir/?api=1&destination=Monowara+Hospital+Siddeshwari+Dhaka",
    },
    noticeBar: { isActive: false, text: { en: "", bn: "" }, href: null },

    createdAt: "2026-10-20T00:00:00.000Z",
    updatedAt: "2026-10-20T00:00:00.000Z",
};
