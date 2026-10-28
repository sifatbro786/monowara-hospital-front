// Mock `seo` collection — per-page Google title/description overrides (proposal §5.4 "Settings & SEO":
// "Google title and description for every page"). Keyed by the locale-less path, so one admin table
// covers index pages ("/doctors") and detail pages ("/departments/cardiology") alike; the BN page uses
// the same entry's bn text. Empty fields fall back to the page's own title/description.
// Admin save → revalidateTag("seo"). Seeded into Mongo (`npm run seed:seo` adds only missing paths),
// then owned by the marketer in Dashboard → SEO.
//
// Writing rules (2026-10-28): titles WITHOUT the brand — the layout template adds " · Monowara Hospital"
// (homepage is absolute). EN title ≤ 40 chars (≈ 60 with the suffix), description 120–155 chars.
// Only facts already published on the site: 24/7 emergency, Siddeshwari (Ramna, Dhaka) address,
// specialist chambers 7 days, Call for Price, appointments by phone/WhatsApp. No prices, no rankings.
// Shape: { _id, path, title: { en, bn }, description: { en, bn }, image, isActive, createdAt, updatedAt }
const T = "2026-10-28T00:00:00.000Z";
const L = (en, bn) => ({ en, bn });
const row = (path, title, description) => ({
    _id: `seo_${path === "/" ? "home" : path.slice(1).replace(/\//g, "_")}`,
    path,
    title,
    description,
    image: null,
    isActive: true,
    createdAt: T,
    updatedAt: T,
});

const pages = [
    row(
        "/",
        L(
            "Monowara Hospital, Siddeshwari, Dhaka — 24/7 Care",
            "মনোয়ারা হসপিটাল, সিদ্ধেশ্বরী, ঢাকা — ২৪/৭ চিকিৎসা",
        ),
        L(
            "Specialist doctors, 24/7 emergency, ICU, NICU, maternity and diagnostics at 54 Siddeshwari Road, Dhaka. Book a serial by phone or WhatsApp.",
            "সিদ্ধেশ্বরী রোড, ঢাকায় বিশেষজ্ঞ ডাক্তার, ২৪/৭ জরুরি বিভাগ, আইসিইউ, এনআইসিইউ, প্রসূতি সেবা ও ডায়াগনস্টিক। ফোন বা হোয়াটসঅ্যাপে সিরিয়াল নিন।",
        ),
    ),
    row(
        "/doctors",
        L("Find a Doctor in Dhaka — Chamber Times", "ডাক্তার খুঁজুন — চেম্বারের সময়সূচি"),
        L(
            "Search our specialists by department, day or name. See weekly chamber times and book a serial by phone or WhatsApp — Siddeshwari, Dhaka.",
            "বিভাগ, দিন বা নাম দিয়ে বিশেষজ্ঞ ডাক্তার খুঁজুন। সাপ্তাহিক চেম্বারের সময় দেখুন, ফোন বা হোয়াটসঅ্যাপে সিরিয়াল নিন — সিদ্ধেশ্বরী, ঢাকা।",
        ),
    ),
    row(
        "/departments",
        L("Departments & Specialties", "বিভাগ ও বিশেষায়িত সেবা"),
        L(
            "Gynaecology, cardiology, medicine, surgery, paediatrics, oncology and more — specialist departments and 24/7 facilities at Monowara Hospital, Dhaka.",
            "স্ত্রীরোগ, হৃদরোগ, মেডিসিন, সার্জারি, শিশু, ক্যান্সারসহ সব বিশেষায়িত বিভাগ ও ২৪/৭ সুবিধা — মনোয়ারা হসপিটাল, ঢাকা।",
        ),
    ),
    row(
        "/diagnostics",
        L("Diagnostics — CT Scan, X-ray, Lab Tests", "ডায়াগনস্টিক — সিটি স্ক্যান, এক্স-রে, ল্যাব"),
        L(
            "CT scan, digital X-ray, pathology lab, ECG, echo, ETT, Holter, ultrasonography, endoscopy and colonoscopy in Siddeshwari, Dhaka. Timings and preparation.",
            "সিদ্ধেশ্বরী, ঢাকায় সিটি স্ক্যান, এক্স-রে, প্যাথলজি, ইসিজি, ইকো, ইটিটি, হল্টার, আল্ট্রাসনোগ্রাফি, এন্ডোস্কপি ও কোলোনোস্কপি। সময় ও প্রস্তুতি জেনে নিন।",
        ),
    ),
    row(
        "/packages",
        L("Delivery, Surgery & Health Check Packages", "ডেলিভারি, অপারেশন ও হেলথ চেকআপ প্যাকেজ"),
        L(
            "Normal delivery, C-section, antenatal care, gallbladder, hernia and appendix surgery, health check-ups. Call or WhatsApp us for the current price.",
            "নরমাল ডেলিভারি, সিজার, গর্ভকালীন চেকআপ, পিত্তথলি, হার্নিয়া ও অ্যাপেন্ডিক্স অপারেশন এবং হেলথ চেকআপ প্যাকেজ। দাম জানতে কল বা হোয়াটসঅ্যাপ করুন।",
        ),
    ),
    row(
        "/appointment",
        L("Book a Doctor Appointment", "ডাক্তারের অ্যাপয়েন্টমেন্ট নিন"),
        L(
            "Book a doctor's serial at Monowara Hospital by hotline or WhatsApp. Our desk confirms your chamber time — Siddeshwari, Ramna, Dhaka.",
            "হটলাইন বা হোয়াটসঅ্যাপে মনোয়ারা হসপিটালে ডাক্তারের সিরিয়াল নিন। আমাদের ডেস্ক চেম্বারের সময় নিশ্চিত করবে — সিদ্ধেশ্বরী, রমনা, ঢাকা।",
        ),
    ),
    row(
        "/emergency",
        L("24/7 Emergency & Ambulance in Dhaka", "২৪/৭ জরুরি সেবা ও অ্যাম্বুলেন্স, ঢাকা"),
        L(
            "Emergency doctors, ICU and ambulance 24 hours a day, 7 days a week at 54 Siddeshwari Road, Dhaka. Call the emergency number now.",
            "৫৪ সিদ্ধেশ্বরী রোড, ঢাকায় দিনরাত ২৪ ঘণ্টা, সপ্তাহে ৭ দিন জরুরি ডাক্তার, আইসিইউ ও অ্যাম্বুলেন্স। এখনই জরুরি নম্বরে কল করুন।",
        ),
    ),
    row(
        "/bhrpc",
        L("High-Risk Pregnancy Care (BHRPC)", "ঝুঁকিপূর্ণ গর্ভাবস্থার যত্ন (বিএইচআরপিসি)"),
        L(
            "Specialist care for high-risk pregnancy — diabetes, high blood pressure, thalassaemia and more — with obstetricians, NICU and 24/7 delivery support.",
            "ডায়াবেটিস, উচ্চ রক্তচাপ, থ্যালাসেমিয়াসহ ঝুঁকিপূর্ণ গর্ভাবস্থায় বিশেষজ্ঞ প্রসূতি চিকিৎসক, এনআইসিইউ ও ২৪/৭ ডেলিভারি সহায়তা।",
        ),
    ),
    row(
        "/mh-aesthetic",
        L("MH Aesthetic — Skin, Laser & Hydrafacial", "এমএইচ অ্যাসথেটিক — স্কিন, লেজার ও হাইড্রাফেসিয়াল"),
        L(
            "Doctor-led skin and aesthetic treatments: skin analysis, hydrafacial, laser, PRP, fillers and more at MH Aesthetic & Wellness Clinic, Dhaka.",
            "চিকিৎসকের তত্ত্বাবধানে স্কিন ও অ্যাসথেটিক চিকিৎসা: স্কিন অ্যানালাইসিস, হাইড্রাফেসিয়াল, লেজার, পিআরপি, ফিলার — এমএইচ অ্যাসথেটিক, ঢাকা।",
        ),
    ),
    row(
        "/about",
        L("About Monowara Hospital", "মনোয়ারা হসপিটাল সম্পর্কে"),
        L(
            "A private hospital in Siddeshwari, Dhaka, with specialist chambers 7 days a week, 24/7 emergency, ICU, NICU, operation theatres and diagnostics.",
            "সিদ্ধেশ্বরী, ঢাকার একটি বেসরকারি হাসপাতাল — সপ্তাহে ৭ দিন বিশেষজ্ঞ চেম্বার, ২৪/৭ জরুরি বিভাগ, আইসিইউ, এনআইসিইউ, অপারেশন থিয়েটার ও ডায়াগনস্টিক।",
        ),
    ),
    row(
        "/about/management",
        L("Management & Board", "ব্যবস্থাপনা পর্ষদ"),
        L(
            "Meet the management of Monowara Hospital (Pvt.) Ltd., Siddeshwari, Dhaka, and read the message from our leadership.",
            "মনোয়ারা হসপিটাল (প্রা.) লি., সিদ্ধেশ্বরী, ঢাকার ব্যবস্থাপনা পর্ষদের সাথে পরিচিত হোন এবং নেতৃত্বের বার্তা পড়ুন।",
        ),
    ),
    row(
        "/patients-visitors",
        L("Patients & Visitors — Hours, Admission", "রোগী ও দর্শনার্থী — সময়, ভর্তি"),
        L(
            "Visiting hours, admission and discharge, what to bring, corporate and insurance patients, and patient rights at Monowara Hospital, Dhaka.",
            "দর্শনার্থীর সময়, ভর্তি ও ছুটির নিয়ম, সাথে কী আনবেন, কর্পোরেট ও ইনস্যুরেন্স রোগী এবং রোগীর অধিকার — মনোয়ারা হসপিটাল, ঢাকা।",
        ),
    ),
    row(
        "/health-tips",
        L("Health Tips & News", "স্বাস্থ্য পরামর্শ ও সংবাদ"),
        L(
            "Easy-to-read health guides from Monowara Hospital — pregnancy, diabetes, heart, child health and more, in English and Bangla.",
            "মনোয়ারা হসপিটালের সহজ ভাষায় স্বাস্থ্য পরামর্শ — গর্ভাবস্থা, ডায়াবেটিস, হৃদরোগ, শিশুর স্বাস্থ্যসহ নানা বিষয়ে, বাংলা ও ইংরেজিতে।",
        ),
    ),
    row(
        "/gallery",
        L("Photo Gallery", "ছবির গ্যালারি"),
        L(
            "Photos of Monowara Hospital — wards, ICU, NICU, operation theatres, diagnostics and patient areas at Siddeshwari, Dhaka.",
            "মনোয়ারা হসপিটালের ছবি — ওয়ার্ড, আইসিইউ, এনআইসিইউ, অপারেশন থিয়েটার, ডায়াগনস্টিক ও রোগীর সুবিধা, সিদ্ধেশ্বরী, ঢাকা।",
        ),
    ),
    row(
        "/expert-talks",
        L("Expert Talks — Doctor Videos", "বিশেষজ্ঞের কথা — ডাক্তারের ভিডিও"),
        L(
            "Short videos in which our doctors explain common conditions, check-ups and treatments in plain language.",
            "আমাদের ডাক্তাররা সহজ ভাষায় সাধারণ রোগ, চেকআপ ও চিকিৎসা নিয়ে ছোট ভিডিওতে কথা বলেছেন।",
        ),
    ),
    row(
        "/careers",
        L("Careers — Jobs at Monowara Hospital", "ক্যারিয়ার — মনোয়ারা হসপিটালে চাকরি"),
        L(
            "Open positions for doctors, nurses and staff at Monowara Hospital, Dhaka. Apply online with your CV.",
            "মনোয়ারা হসপিটাল, ঢাকায় ডাক্তার, নার্স ও স্টাফ পদে নিয়োগ। অনলাইনে সিভি দিয়ে আবেদন করুন।",
        ),
    ),
    row(
        "/contact",
        L("Contact Us — Phone, WhatsApp, Map", "যোগাযোগ — ফোন, হোয়াটসঅ্যাপ, ম্যাপ"),
        L(
            "Hotline, WhatsApp desks, email and directions to Monowara Hospital, 54 Siddeshwari Road, Ramna, Dhaka-1217. Emergency open 24/7.",
            "মনোয়ারা হসপিটালের হটলাইন, হোয়াটসঅ্যাপ, ইমেইল ও দিকনির্দেশনা — ৫৪ সিদ্ধেশ্বরী রোড, রমনা, ঢাকা-১২১৭। জরুরি বিভাগ ২৪/৭ খোলা।",
        ),
    ),
];

// Departments: "<specialty> in Dhaka — Specialists"
const dept = (slug, en, bn, focusEn, focusBn) =>
    row(
        `/departments/${slug}`,
        L(`${en} in Dhaka`, `${bn} বিভাগ, ঢাকা`),
        L(
            `${en} specialists in Siddeshwari, Dhaka — ${focusEn}. Chamber times; serial by phone or WhatsApp.`,
            `সিদ্ধেশ্বরী, ঢাকায় ${bn} বিশেষজ্ঞ — ${focusBn}। চেম্বারের সময় দেখুন, ফোন বা হোয়াটসঅ্যাপে সিরিয়াল নিন।`,
        ),
    );

const departments = [
    dept("gynaecology-obstetrics", "Gynaecology & Obstetrics", "প্রসূতি ও স্ত্রীরোগ", "pregnancy, delivery and women's health", "গর্ভকালীন যত্ন, ডেলিভারি ও নারীস্বাস্থ্য"),
    dept("general-laparoscopic-surgery", "Laparoscopic Surgery", "জেনারেল ও ল্যাপারোস্কোপিক সার্জারি", "gallbladder, hernia and appendix", "পিত্তথলি, হার্নিয়া ও অ্যাপেন্ডিক্স"),
    dept("cardiology", "Cardiology", "হৃদরোগ", "ECG, echo, ETT and heart check-ups", "ইসিজি, ইকো, ইটিটি ও হার্ট চেকআপ"),
    dept("dermatology-venereology", "Dermatology", "চর্ম ও যৌনরোগ", "skin, hair and allergy care", "ত্বক, চুল ও অ্যালার্জির চিকিৎসা"),
    dept("medicine", "Internal Medicine", "মেডিসিন", "fever, diabetes, blood pressure and adult care", "জ্বর, ডায়াবেটিস, রক্তচাপ ও প্রাপ্তবয়স্কদের চিকিৎসা"),
    dept("paediatrics-neonatology", "Child Specialist & NICU", "শিশু ও নবজাতক", "child health, vaccines and NICU", "শিশুর স্বাস্থ্য, টিকা ও এনআইসিইউ"),
    dept("oncology", "Cancer Care (Oncology)", "ক্যান্সার", "diagnosis, treatment plans and follow-up", "রোগনির্ণয়, চিকিৎসা পরিকল্পনা ও ফলো-আপ"),
    dept("diabetes-endocrinology", "Diabetes & Hormone Care", "ডায়াবেটিস ও হরমোন", "diabetes, thyroid and hormone disorders", "ডায়াবেটিস, থাইরয়েড ও হরমোনজনিত সমস্যা"),
    dept("gastroenterology-liver", "Gastro & Liver Specialist", "গ্যাস্ট্রো ও লিভার", "stomach, liver, endoscopy and colonoscopy", "পেট, লিভার, এন্ডোস্কপি ও কোলোনোস্কপি"),
    dept("haematology", "Haematology (Blood)", "রক্তরোগ", "anaemia, thalassaemia and blood disorders", "রক্তস্বল্পতা, থ্যালাসেমিয়া ও রক্তের রোগ"),
    dept("nephrology", "Kidney Specialist", "কিডনি রোগ", "kidney disease and dialysis", "কিডনি রোগ ও ডায়ালাইসিস"),
    dept("neurology", "Neurology", "নিউরোলজি", "stroke, headache, epilepsy and nerve disorders", "স্ট্রোক, মাথাব্যথা, মৃগী ও স্নায়ুরোগ"),
    dept("ent", "ENT Specialist", "নাক, কান ও গলা", "ear, nose and throat care and surgery", "নাক, কান ও গলার চিকিৎসা ও অপারেশন"),
    dept("orthopaedics", "Orthopaedics", "অর্থোপেডিকস", "bone, joint, fracture and back pain", "হাড়, জয়েন্ট, ভাঙা হাড় ও কোমর ব্যথা"),
    dept("paediatric-cardiology", "Child Heart Specialist", "শিশু হৃদরোগ", "heart conditions in children", "শিশুদের হৃদরোগ"),
    dept("physical-medicine", "Physical Medicine", "ফিজিক্যাল মেডিসিন", "pain, rehabilitation and mobility", "ব্যথা, পুনর্বাসন ও চলাফেরা"),
    dept("physiotherapy", "Physiotherapy", "ফিজিওথেরাপি", "back, neck and joint pain, post-surgery rehab", "কোমর, ঘাড় ও জয়েন্ট ব্যথা, অপারেশন-পরবর্তী থেরাপি"),
    dept("plastic-surgery", "Plastic & Burn Surgery", "প্লাস্টিক সার্জারি", "reconstructive, burn and cosmetic surgery", "রিকনস্ট্রাকটিভ, পোড়া ও কসমেটিক সার্জারি"),
    dept("thoracic-surgery", "Thoracic Surgery", "থোরাসিক সার্জারি", "chest and lung surgery", "বুক ও ফুসফুসের অপারেশন"),
    dept("urology", "Urology", "ইউরোলজি", "kidney stone, prostate and urinary problems", "কিডনি পাথর, প্রোস্টেট ও প্রস্রাবের সমস্যা"),
    dept("chest-medicine", "Chest Medicine", "বক্ষব্যাধি", "asthma, COPD and lung infections", "অ্যাজমা, সিওপিডি ও ফুসফুসের সংক্রমণ"),
    dept("nutrition-diet", "Nutrition & Diet", "পুষ্টি ও খাদ্য", "diet plans for diabetes, pregnancy, weight", "ডায়াবেটিস, গর্ভাবস্থা ও ওজনের জন্য খাদ্য পরিকল্পনা"),
];

const facilities = [
    row("/facilities/emergency", L("24/7 Emergency Unit", "২৪/৭ জরুরি বিভাগ"), L(
        "Emergency doctors and nurses 24 hours, 7 days at Monowara Hospital, Siddeshwari, Dhaka — with ICU, operation theatres and ambulance on site.",
        "মনোয়ারা হসপিটাল, সিদ্ধেশ্বরী, ঢাকায় দিনরাত ২৪ ঘণ্টা জরুরি ডাক্তার ও নার্স — সাথে আইসিইউ, অপারেশন থিয়েটার ও অ্যাম্বুলেন্স।")),
    row("/facilities/icu", L("ICU in Dhaka — Intensive Care", "আইসিইউ — নিবিড় পরিচর্যা, ঢাকা"), L(
        "Intensive Care Unit with round-the-clock doctors, nurses and monitoring at Monowara Hospital, Siddeshwari, Dhaka. Call to check bed availability.",
        "মনোয়ারা হসপিটাল, সিদ্ধেশ্বরী, ঢাকায় ২৪ ঘণ্টা ডাক্তার, নার্স ও মনিটরিংসহ আইসিইউ। বেড খালি আছে কিনা জানতে কল করুন।")),
    row("/facilities/nicu", L("NICU in Dhaka — Newborn Intensive Care", "এনআইসিইউ — নবজাতকের নিবিড় পরিচর্যা"), L(
        "Neonatal ICU for premature and sick newborns, next to our maternity unit — Monowara Hospital, Siddeshwari, Dhaka. Open 24/7.",
        "অপরিণত ও অসুস্থ নবজাতকের জন্য এনআইসিইউ, প্রসূতি বিভাগের পাশেই — মনোয়ারা হসপিটাল, সিদ্ধেশ্বরী, ঢাকা। ২৪/৭ খোলা।")),
    row("/facilities/operation-theatres", L("Operation Theatres", "অপারেশন থিয়েটার"), L(
        "Operation theatres for general, laparoscopic, gynaecological, orthopaedic and plastic surgery at Monowara Hospital, Dhaka.",
        "জেনারেল, ল্যাপারোস্কোপিক, স্ত্রীরোগ, অর্থোপেডিক ও প্লাস্টিক সার্জারির জন্য অপারেশন থিয়েটার — মনোয়ারা হসপিটাল, ঢাকা।")),
    row("/facilities/dialysis", L("Dialysis in Dhaka", "ডায়ালাইসিস, ঢাকা"), L(
        "Haemodialysis under kidney specialists at Monowara Hospital, Siddeshwari, Dhaka. Call or WhatsApp to book a session.",
        "কিডনি বিশেষজ্ঞের তত্ত্বাবধানে হিমোডায়ালাইসিস — মনোয়ারা হসপিটাল, সিদ্ধেশ্বরী, ঢাকা। সেশন বুক করতে কল বা হোয়াটসঅ্যাপ করুন।")),
    row("/facilities/ambulance", L("24/7 Ambulance Service in Dhaka", "২৪/৭ অ্যাম্বুলেন্স সার্ভিস, ঢাকা"), L(
        "Call our ambulance any time, day or night — Monowara Hospital, 54 Siddeshwari Road, Ramna, Dhaka.",
        "দিন-রাত যেকোনো সময় আমাদের অ্যাম্বুলেন্সে কল করুন — মনোয়ারা হসপিটাল, ৫৪ সিদ্ধেশ্বরী রোড, রমনা, ঢাকা।")),
    row("/facilities/pharmacy", L("24/7 Pharmacy", "২৪/৭ ফার্মেসি"), L(
        "In-house pharmacy open 24 hours for patients and visitors at Monowara Hospital, Siddeshwari, Dhaka.",
        "রোগী ও দর্শনার্থীদের জন্য ২৪ ঘণ্টা খোলা হাসপাতালের নিজস্ব ফার্মেসি — মনোয়ারা হসপিটাল, সিদ্ধেশ্বরী, ঢাকা।")),
    row("/facilities/blood-bank", L("Blood Bank", "ব্লাড ব্যাংক"), L(
        "Blood grouping, cross-matching and transfusion support at Monowara Hospital, Dhaka. Call ahead for blood availability.",
        "রক্তের গ্রুপ নির্ণয়, ক্রস-ম্যাচিং ও রক্ত সঞ্চালন সহায়তা — মনোয়ারা হসপিটাল, ঢাকা। রক্ত পাওয়া যাবে কিনা আগে কল করে জানুন।")),
    row("/facilities/opd-chambers", L("OPD — Specialist Doctors' Chambers", "ওপিডি — বিশেষজ্ঞ ডাক্তারের চেম্বার"), L(
        "Specialist doctors' chambers 7 days a week at Monowara Hospital, Siddeshwari, Dhaka. Check chamber times and book a serial.",
        "সপ্তাহে ৭ দিন বিশেষজ্ঞ ডাক্তারের চেম্বার — মনোয়ারা হসপিটাল, সিদ্ধেশ্বরী, ঢাকা। চেম্বারের সময় দেখে সিরিয়াল নিন।")),
    row("/facilities/reception", L("24/7 Reception & Help Desk", "২৪/৭ রিসেপশন ও হেল্প ডেস্ক"), L(
        "Our reception is open 24/7 for admissions, serials, reports and directions at Monowara Hospital, Dhaka.",
        "ভর্তি, সিরিয়াল, রিপোর্ট ও দিকনির্দেশনার জন্য আমাদের রিসেপশন ২৪/৭ খোলা — মনোয়ারা হসপিটাল, ঢাকা।")),
];

const diagnostics = [
    row("/diagnostics/pathology-lab", L("Pathology Lab — Blood & Urine Tests", "প্যাথলজি ল্যাব — রক্ত ও প্রস্রাব পরীক্ষা"), L(
        "Blood, urine, hormone and other lab tests at Monowara Hospital, Siddeshwari, Dhaka. Sample timings and preparation notes.",
        "রক্ত, প্রস্রাব, হরমোনসহ বিভিন্ন ল্যাব পরীক্ষা — মনোয়ারা হসপিটাল, সিদ্ধেশ্বরী, ঢাকা। নমুনা দেওয়ার সময় ও প্রস্তুতি জেনে নিন।")),
    row("/diagnostics/ct-scan-x-ray", L("CT Scan & X-ray in Dhaka", "সিটি স্ক্যান ও এক্স-রে, ঢাকা"), L(
        "CT scan and digital X-ray at Monowara Hospital, Siddeshwari, Dhaka. Timings, preparation and how to book — call or WhatsApp.",
        "মনোয়ারা হসপিটাল, সিদ্ধেশ্বরী, ঢাকায় সিটি স্ক্যান ও ডিজিটাল এক্স-রে। সময়, প্রস্তুতি ও বুকিং — কল বা হোয়াটসঅ্যাপ করুন।")),
    row("/diagnostics/ecg-ett-echo", L("ECG, ETT & Echo Test", "ইসিজি, ইটিটি ও ইকো পরীক্ষা"), L(
        "ECG, exercise tolerance test (ETT) and echocardiography for heart check-ups at Monowara Hospital, Dhaka. Preparation and timings.",
        "হার্ট চেকআপের জন্য ইসিজি, ইটিটি ও ইকোকার্ডিওগ্রাফি — মনোয়ারা হসপিটাল, ঢাকা। প্রস্তুতি ও সময় জেনে নিন।")),
    row("/diagnostics/holter-monitoring", L("Holter Monitoring (24-Hour ECG)", "হল্টার মনিটরিং (২৪ ঘণ্টার ইসিজি)"), L(
        "24-hour Holter ECG to record irregular heartbeats during daily life — Monowara Hospital, Siddeshwari, Dhaka.",
        "দৈনন্দিন কাজের মধ্যে অনিয়মিত হৃৎস্পন্দন ধরতে ২৪ ঘণ্টার হল্টার ইসিজি — মনোয়ারা হসপিটাল, সিদ্ধেশ্বরী, ঢাকা।")),
    row("/diagnostics/endoscopy-colonoscopy", L("Endoscopy & Colonoscopy in Dhaka", "এন্ডোস্কপি ও কোলোনোস্কপি, ঢাকা"), L(
        "Endoscopy and colonoscopy by gastro specialists at Monowara Hospital, Dhaka. Fasting and bowel-preparation instructions inside.",
        "গ্যাস্ট্রো বিশেষজ্ঞের মাধ্যমে এন্ডোস্কপি ও কোলোনোস্কপি — মনোয়ারা হসপিটাল, ঢাকা। খালি পেট ও প্রস্তুতির নির্দেশনা দেখুন।")),
    row("/diagnostics/ultrasonography", L("Ultrasonography (USG) in Dhaka", "আল্ট্রাসনোগ্রাফি (ইউএসজি), ঢাকা"), L(
        "Pregnancy and whole-abdomen ultrasonography at Monowara Hospital, Siddeshwari, Dhaka. Timings and preparation.",
        "গর্ভাবস্থা ও পুরো পেটের আল্ট্রাসনোগ্রাফি — মনোয়ারা হসপিটাল, সিদ্ধেশ্বরী, ঢাকা। সময় ও প্রস্তুতি জেনে নিন।")),
];

const pkg = (slug, en, bn, whatEn, whatBn) =>
    row(
        `/packages/${slug}`,
        L(en, bn),
        L(
            `${whatEn} in Siddeshwari, Dhaka. See what's included; call or WhatsApp for the current price.`,
            `${whatBn} — সিদ্ধেশ্বরী, ঢাকা। কী কী থাকছে দেখুন, দাম জানতে কল বা হোয়াটসঅ্যাপ করুন।`,
        ),
    );

const packages = [
    pkg("normal-delivery", "Normal Delivery Package in Dhaka", "নরমাল ডেলিভারি প্যাকেজ, ঢাকা", "Normal delivery with obstetricians, labour room and NICU backup", "প্রসূতি বিশেষজ্ঞ, লেবার রুম ও এনআইসিইউ সহায়তাসহ নরমাল ডেলিভারি প্যাকেজ"),
    pkg("c-section", "C-Section (Caesarean) Package", "সিজারিয়ান (সি-সেকশন) প্যাকেজ", "Caesarean section with obstetricians, anaesthesia and NICU backup", "অপারেশন থিয়েটার, অ্যানেস্থেসিয়া ও এনআইসিইউ সহায়তাসহ সিজারিয়ান প্যাকেজ"),
    pkg("antenatal-care", "Antenatal Check-up Plan", "গর্ভকালীন চেকআপ প্ল্যান", "Antenatal check-up plan for a safe pregnancy", "নিরাপদ গর্ভাবস্থার জন্য গর্ভকালীন চেকআপ প্ল্যান"),
    pkg("basic-health-check", "Basic Health Check-up", "বেসিক হেলথ চেকআপ", "Basic health check-up with essential blood tests", "প্রয়োজনীয় রক্ত পরীক্ষাসহ বেসিক হেলথ চেকআপ"),
    pkg("executive-health-check", "Executive Health Check-up", "এক্সিকিউটিভ হেলথ চেকআপ", "Executive health check-up for adults", "প্রাপ্তবয়স্কদের জন্য এক্সিকিউটিভ হেলথ চেকআপ"),
    pkg("diabetes-care-check", "Diabetes Check-up Package", "ডায়াবেটিস চেকআপ প্যাকেজ", "Diabetes check-up package", "ডায়াবেটিস চেকআপ প্যাকেজ"),
    pkg("heart-health-check", "Heart Check-up Package", "হার্ট চেকআপ প্যাকেজ", "Heart check-up package", "হার্ট চেকআপ প্যাকেজ"),
    pkg("musolmani", "Musolmani (Circumcision)", "মুসলমানি (খৎনা)", "Musolmani (circumcision) for boys by surgeons", "সার্জনের মাধ্যমে ছেলেদের মুসলমানি (খৎনা)"),
    pkg("laparoscopic-cholecystectomy", "Laparoscopic Gallbladder Surgery", "ল্যাপারোস্কোপিক পিত্তথলি অপারেশন", "Laparoscopic gallbladder stone surgery", "ল্যাপারোস্কোপিক পদ্ধতিতে পিত্তথলির পাথরের অপারেশন"),
    pkg("hernia-surgery", "Hernia Surgery Package", "হার্নিয়া অপারেশন প্যাকেজ", "Hernia surgery package", "হার্নিয়া অপারেশন প্যাকেজ"),
    pkg("appendix-surgery", "Appendix Surgery Package", "অ্যাপেন্ডিক্স অপারেশন প্যাকেজ", "Appendix surgery package", "অ্যাপেন্ডিক্স অপারেশন প্যাকেজ"),
];

export const seo = [...pages, ...departments, ...facilities, ...diagnostics, ...packages];
