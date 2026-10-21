// Copy for the client-side error boundaries (error.js / global-error.js). They are Client
// Components, so they can't use the server-only getDictionary(); keeping this tiny avoids
// shipping the whole dictionary to the browser.
export const errorCopy = {
    en: {
        eyebrow: "Something went wrong",
        title: "This page didn't load properly",
        lead: "It's on our side, not yours. Try again — if it keeps happening, call the desk and we'll help you directly.",
        retry: "Try again",
        home: "Back to home",
        call: "Hotline",
        emergency: "Emergency",
        ref: "Reference",
    },
    bn: {
        eyebrow: "একটি সমস্যা হয়েছে",
        title: "পেজটি ঠিকমতো লোড হয়নি",
        lead: "সমস্যাটি আমাদের দিকে, আপনার নয়। আবার চেষ্টা করুন — বারবার হলে ডেস্কে কল করুন, আমরা সরাসরি সাহায্য করব।",
        retry: "আবার চেষ্টা করুন",
        home: "হোমে ফিরে যান",
        call: "হটলাইন",
        emergency: "জরুরি",
        ref: "রেফারেন্স",
    },
};

// Used only by global-error.js, which renders when the root layout itself fails (e.g. the API is
// down in B3) — the one moment settings can't be loaded, and a phone number matters most.
export const FALLBACK_HOTLINE = process.env.NEXT_PUBLIC_FALLBACK_HOTLINE || "09611622333";
export const FALLBACK_EMERGENCY = process.env.NEXT_PUBLIC_FALLBACK_EMERGENCY || "01789446240";
