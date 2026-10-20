// Mock `pages` documents for content pages (About, Patients & Visitors). Admin → Content.
// Facts from the old About page (own building at Siddeshwari, 24/7, mission/vision, BHRPC and
// MH Aesthetic units); the rest written by STR Solutions. No stats are shown anywhere (Sifat,
// 2026-10-20). Items marked CONFIRM need the hospital's real policy before launch.
const stamp = "2026-10-21T00:00:00.000Z";
const L = (en, bn) => ({ en, bn });

export const sitePages = [
    {
        _id: "page_about",
        slug: "about",
        title: L("About Monowara Hospital", "মনোয়ারা হসপিটাল সম্পর্কে"),
        summary: L(
            "A family hospital in its own building at Siddeshwari, caring for Dhaka for more than three decades.",
            "সিদ্ধেশ্বরীতে নিজস্ব ভবনে একটি পারিবারিক হাসপাতাল — তিন দশকেরও বেশি সময় ধরে ঢাকার সেবায়।",
        ),
        body: L(
            "Monowara Hospital (Pvt.) Ltd. has looked after families in Dhaka for more than three decades from its own building at 54 Siddeshwari Road. Generations of patients have been born here, treated here and brought their own children back.\n\nToday the hospital brings together specialist chambers seven days a week, a 24-hour emergency unit, operation theatres, ICU and NICU, dialysis, and in-house laboratory and imaging — so most of what a patient needs is under one roof. Two dedicated units sit alongside: BHRPC for high-risk pregnancies, and MH Aesthetic & Wellness for doctor-led skin and aesthetic care.",
            "মনোয়ারা হসপিটাল (প্রা.) লি. তিন দশকেরও বেশি সময় ধরে ৫৪ সিদ্ধেশ্বরী রোডের নিজস্ব ভবন থেকে ঢাকার পরিবারগুলোর সেবা দিয়ে আসছে। প্রজন্মের পর প্রজন্ম এখানে জন্মেছে, চিকিৎসা নিয়েছে এবং নিজেদের সন্তানদের নিয়ে আবার ফিরে এসেছে।\n\nআজ হাসপাতালে আছে সপ্তাহে ৭ দিন বিশেষজ্ঞ চেম্বার, ২৪ ঘণ্টার জরুরি বিভাগ, অপারেশন থিয়েটার, আইসিইউ ও এনআইসিইউ, ডায়ালাইসিস এবং নিজস্ব ল্যাব ও ইমেজিং — রোগীর প্রয়োজনের প্রায় সবকিছুই এক ছাদের নিচে। পাশাপাশি আছে দুটি বিশেষ ইউনিট: ঝুঁকিপূর্ণ গর্ভাবস্থার জন্য বিএইচআরপিসি এবং ডাক্তারের তত্ত্বাবধানে ত্বক ও অ্যাসথেটিক সেবার জন্য এমএইচ অ্যাসথেটিক অ্যান্ড ওয়েলনেস।",
        ),
        pillars: [
            {
                title: L("Specialists you can name", "নাম জানা বিশেষজ্ঞ"),
                body: L(
                    "Professors and consultants from Dhaka's leading medical colleges and national institutes hold regular chambers here.",
                    "ঢাকার শীর্ষ মেডিকেল কলেজ ও জাতীয় প্রতিষ্ঠানের অধ্যাপক ও কনসালট্যান্টরা এখানে নিয়মিত চেম্বার করেন।",
                ),
            },
            {
                title: L("Everything in one building", "সবকিছু এক ভবনে"),
                body: L(
                    "Chambers, lab, imaging, theatres, ICU, NICU and pharmacy are under one roof — fewer trips, faster answers.",
                    "চেম্বার, ল্যাব, ইমেজিং, থিয়েটার, আইসিইউ, এনআইসিইউ ও ফার্মেসি এক ছাদের নিচে — কম দৌড়াদৌড়ি, দ্রুত সমাধান।",
                ),
            },
            {
                title: L("Open every hour", "প্রতি ঘণ্টায় খোলা"),
                body: L(
                    "Emergency, admission, pharmacy and ambulance run 24 hours a day, every day of the year.",
                    "জরুরি বিভাগ, ভর্তি, ফার্মেসি ও অ্যাম্বুলেন্স বছরের প্রতিদিন ২৪ ঘণ্টা চালু।",
                ),
            },
            {
                title: L("Prices explained first", "আগেই দাম জানানো"),
                body: L(
                    "Packages are quoted on the phone before admission, so families can plan without surprises.",
                    "ভর্তির আগেই ফোনে প্যাকেজের দাম জানানো হয়, তাই পরিবার নিশ্চিন্তে পরিকল্পনা করতে পারে।",
                ),
            },
        ],
        mission: L(
            "To deliver safe, high-quality and affordable care, tailored to each patient and focused on their comfort and trust.",
            "প্রতিটি রোগীর প্রয়োজন অনুযায়ী নিরাপদ, মানসম্মত ও সাশ্রয়ী সেবা দেওয়া — রোগীর স্বস্তি ও আস্থাকে কেন্দ্রে রেখে।",
        ),
        vision: L(
            "To be a leading healthcare institution in Bangladesh, known for patient care, medical education and service to the community.",
            "রোগীসেবা, চিকিৎসা শিক্ষা ও সমাজসেবার জন্য বাংলাদেশের অন্যতম শীর্ষ স্বাস্থ্যসেবা প্রতিষ্ঠান হওয়া।",
        ),
        isActive: true,
        createdAt: stamp,
        updatedAt: stamp,
    },
    {
        _id: "page_patients_visitors",
        slug: "patients-visitors",
        title: L("Patients & visitors", "রোগী ও দর্শনার্থী"),
        summary: L(
            "Visiting hours, admission, what to bring, billing and corporate care — the practical things, in one place.",
            "দর্শনার্থীর সময়, ভর্তি, কী আনবেন, বিলিং ও কর্পোরেট সেবা — দরকারি সব তথ্য এক জায়গায়।",
        ),
        sections: [
            {
                id: "visiting-hours",
                heading: L("Visiting hours", "দর্শনার্থীর সময়"),
                body: L(
                    "Visiting times are set by each ward to give patients time to rest. ICU and NICU visiting is limited to close family to protect patients from infection. Please ask the front desk for today's times. One attendant may stay with a patient in a cabin.",
                    "রোগীদের বিশ্রামের জন্য প্রতিটি ওয়ার্ড দর্শনার্থীর সময় নির্ধারণ করে। সংক্রমণ থেকে রোগীদের রক্ষায় আইসিইউ ও এনআইসিইউতে শুধু নিকটাত্মীয় যেতে পারেন। আজকের সময় জানতে ফ্রন্ট ডেস্কে জিজ্ঞেস করুন। কেবিনে রোগীর সাথে একজন অ্যাটেনডেন্ট থাকতে পারেন।",
                ),
                points: [
                    L(
                        "Children under 12 are discouraged from visiting wards",
                        "১২ বছরের কম বয়সী শিশুদের ওয়ার্ডে না আনাই ভালো",
                    ),
                    L(
                        "Please don't visit if you have a fever, cough or cold",
                        "জ্বর, কাশি বা ঠান্ডা থাকলে দেখতে আসবেন না",
                    ),
                    L(
                        "Clean your hands when entering and leaving",
                        "ঢোকার ও বের হওয়ার সময় হাত পরিষ্কার করুন",
                    ),
                ],
                confirm: true,
            },
            {
                id: "admission",
                heading: L("Admission & what to bring", "ভর্তি ও যা আনবেন"),
                body: L(
                    "Planned admissions are arranged through your doctor and the front desk; emergency admissions go through the emergency unit at any hour. The desk will explain the cabin or ward options and the advance payment before admission.",
                    "পরিকল্পিত ভর্তি আপনার ডাক্তার ও ফ্রন্ট ডেস্কের মাধ্যমে হয়; জরুরি ভর্তি যেকোনো সময় জরুরি বিভাগ দিয়ে। ভর্তির আগে ডেস্ক কেবিন বা ওয়ার্ডের বিকল্প ও অগ্রিম পেমেন্ট বুঝিয়ে বলবে।",
                ),
                points: [
                    L(
                        "National ID or birth certificate of the patient",
                        "রোগীর জাতীয় পরিচয়পত্র বা জন্ম নিবন্ধন",
                    ),
                    L(
                        "All previous prescriptions, reports and scan films",
                        "আগের সব প্রেসক্রিপশন, রিপোর্ট ও স্ক্যান ফিল্ম",
                    ),
                    L(
                        "The medicines you take now, in their packets",
                        "বর্তমানে খাওয়া ওষুধ, প্যাকেটসহ",
                    ),
                    L(
                        "Comfortable clothes, toiletries and a phone charger",
                        "আরামদায়ক কাপড়, প্রয়োজনীয় টয়লেট্রিজ ও ফোন চার্জার",
                    ),
                    L(
                        "Leave jewellery and large amounts of cash at home",
                        "গয়না ও বেশি নগদ টাকা বাড়িতে রেখে আসুন",
                    ),
                ],
            },
            {
                id: "billing",
                heading: L("Billing & discharge", "বিলিং ও ছুটি"),
                body: L(
                    "Your bill is kept up to date during the stay and the desk can give you an interim statement at any time. On the day of discharge, the doctor completes the discharge summary and prescriptions, and the final bill is settled at the front desk.",
                    "ভর্তির পুরো সময় আপনার বিল হালনাগাদ রাখা হয় এবং যেকোনো সময় ডেস্ক থেকে অন্তর্বর্তী বিবরণী নিতে পারেন। ছুটির দিন ডাক্তার ডিসচার্জ সামারি ও প্রেসক্রিপশন দেন এবং ফ্রন্ট ডেস্কে চূড়ান্ত বিল পরিশোধ করা হয়।",
                ),
                points: [
                    L(
                        "Ask for an estimate before planned surgery",
                        "পরিকল্পিত অপারেশনের আগে খরচের আনুমানিক হিসাব চেয়ে নিন",
                    ),
                    L(
                        "Keep your discharge summary for follow-up visits",
                        "ফলো-আপ ভিজিটের জন্য ডিসচার্জ সামারি রেখে দিন",
                    ),
                ],
                confirm: true, // payment methods (cash, card, bKash…) to confirm
            },
            {
                id: "corporate-insurance",
                heading: L("Corporate & insurance", "কর্পোরেট ও ইন্স্যুরেন্স"),
                body: L(
                    "Companies and organisations can arrange health check-ups and treatment for their staff. If your employer or insurer has an arrangement with the hospital, bring your ID card or letter at admission. Contact the desk for corporate enquiries.",
                    "প্রতিষ্ঠানগুলো তাদের কর্মীদের জন্য হেলথ চেকআপ ও চিকিৎসার ব্যবস্থা করতে পারে। আপনার প্রতিষ্ঠান বা ইন্স্যুরেন্সের সাথে হাসপাতালের চুক্তি থাকলে ভর্তির সময় আইডি কার্ড বা চিঠি আনুন। কর্পোরেট বিষয়ে ডেস্কে যোগাযোগ করুন।",
                ),
                confirm: true, // list of corporate / insurance partners
            },
            {
                id: "feedback",
                heading: L("Your rights & feedback", "আপনার অধিকার ও মতামত"),
                body: L(
                    "Every patient has the right to respectful care, clear information and privacy. If something didn't go right, please tell the front desk or write to us — we want to hear it and put it right.",
                    "প্রতিটি রোগীর সম্মানজনক সেবা, পরিষ্কার তথ্য ও গোপনীয়তার অধিকার আছে। কোনো কিছু ঠিকমতো না হলে ফ্রন্ট ডেস্কে জানান বা আমাদের লিখুন — আমরা শুনতে ও ঠিক করতে চাই।",
                ),
                link: {
                    href: "/legal/patient-rights",
                    label: L("Read patient rights", "রোগীর অধিকার পড়ুন"),
                },
            },
        ],
        isActive: true,
        createdAt: stamp,
        updatedAt: stamp,
    },
];

// Management — the old site only had placeholders ("Mr. ABC"). Filled from admin later.
// Shape: { _id, name{en,bn}, role{en,bn}, photo, message{en,bn}|null, order, isActive }
export const management = [];
