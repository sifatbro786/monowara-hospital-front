// Mock `faqs` collection — fixed question → fixed answer chatbot (client requirement §4.3).
// Seed answers use only facts published on monowarahospital.com; client to supply the real list.
const stamp = "2026-10-20T00:00:00.000Z";

export const faqs = [
    {
        _id: "faq_appointment",
        question: { en: "How do I book a doctor's serial?", bn: "ডাক্তারের সিরিয়াল কীভাবে নেব?" },
        answer: {
            en: "Call our hotline or message the Appointments desk on WhatsApp. The desk confirms your serial and chamber time.",
            bn: "আমাদের হটলাইনে কল করুন অথবা হোয়াটসঅ্যাপে অ্যাপয়েন্টমেন্ট ডেস্কে মেসেজ দিন। ডেস্ক আপনার সিরিয়াল ও চেম্বারের সময় নিশ্চিত করবে।",
        },
        category: "appointment",
        order: 1,
        isActive: true,
        createdAt: stamp,
        updatedAt: stamp,
    },
    {
        _id: "faq_emergency",
        question: { en: "Is the emergency open at night?", bn: "রাতে কি জরুরি বিভাগ খোলা থাকে?" },
        answer: {
            en: "Yes. Emergency and admission run 24 hours, 7 days a week. Call the emergency line before you leave if you can.",
            bn: "হ্যাঁ। জরুরি বিভাগ ও ভর্তি ২৪ ঘণ্টা, সপ্তাহে ৭ দিন চালু। সম্ভব হলে রওনা হওয়ার আগে জরুরি নম্বরে কল করুন।",
        },
        category: "emergency",
        order: 2,
        isActive: true,
        createdAt: stamp,
        updatedAt: stamp,
    },
    {
        _id: "faq_location",
        question: { en: "Where is the hospital?", bn: "হাসপাতালটি কোথায়?" },
        answer: {
            en: "54, Siddeshwari Road, Ramna, Dhaka-1217 — in the hospital's own building.",
            bn: "৫৪, সিদ্ধেশ্বরী রোড, রমনা, ঢাকা-১২১৭ — হাসপাতালের নিজস্ব ভবনে।",
        },
        category: "visit",
        order: 3,
        isActive: true,
        createdAt: stamp,
        updatedAt: stamp,
    },
    {
        _id: "faq_packages",
        question: {
            en: "How much does a delivery or check-up package cost?",
            bn: "ডেলিভারি বা চেকআপ প্যাকেজের খরচ কত?",
        },
        answer: {
            en: "Package prices are shared over the phone so they are always current. Call or WhatsApp us and mention the package name.",
            bn: "প্যাকেজের সর্বশেষ মূল্য ফোনে জানানো হয়। প্যাকেজের নাম উল্লেখ করে কল বা হোয়াটসঅ্যাপ করুন।",
        },
        category: "packages",
        order: 4,
        isActive: true,
        createdAt: stamp,
        updatedAt: stamp,
    },
];
