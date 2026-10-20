// Mock `jobs` collection (admin → Careers). No real openings were published on the old site,
// so only the always-open CV bank is listed — real posts are added from the admin later.
// Shape: { _id, slug, title{en,bn}, department, type, location, summary{en,bn},
//          responsibilities[{en,bn}], requirements[{en,bn}], deadline|null, isActive, order }
const L = (en, bn) => ({ en, bn });

export const jobs = [
    {
        _id: "job_general-application",
        slug: "general-application",
        title: L("General application — CV bank", "সাধারণ আবেদন — সিভি ব্যাংক"),
        department: null,
        type: L("Doctors, nurses, technologists & staff", "ডাক্তার, নার্স, টেকনোলজিস্ট ও কর্মী"),
        location: L("Siddeshwari, Dhaka", "সিদ্ধেশ্বরী, ঢাকা"),
        summary: L(
            "No opening that fits you right now? Send your CV and we'll contact you when a suitable position opens.",
            "এখন উপযুক্ত পদ নেই? সিভি পাঠান — উপযুক্ত পদ খালি হলে আমরা যোগাযোগ করব।",
        ),
        responsibilities: [],
        requirements: [
            L(
                "Relevant qualification and registration (BMDC / BNMC where applicable)",
                "প্রাসঙ্গিক যোগ্যতা ও নিবন্ধন (প্রযোজ্য ক্ষেত্রে বিএমডিসি / বিএনএমসি)",
            ),
            L("An up-to-date CV in PDF or Word format", "পিডিএফ বা ওয়ার্ড ফরম্যাটে হালনাগাদ সিভি"),
        ],
        deadline: null,
        isActive: true,
        order: 1,
    },
];
