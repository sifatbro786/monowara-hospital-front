// Long-form content for `facilities` and `diagnostics` (merged into those docs).
// Facts from the old site are kept (pathology hours 7am–12pm; haemo- + peritoneal dialysis);
// the rest is general patient information written by STR Solutions. No invented figures.
// Preparation notes are standard guidance and always end with "follow the desk's instructions".
const L = (en, bn) => ({ en, bn });

export const facilityContent = {
    emergency: {
        description: L(
            "Our emergency unit is open 24 hours a day, every day of the year, with doctors and nurses on duty around the clock. Patients are seen in order of how unwell they are, not only in order of arrival, so the most urgent cases are treated first.\n\nThe emergency team works directly with the hospital's ICU, operation theatres, imaging and laboratory, so admission and tests can start without delay.",
            "আমাদের জরুরি বিভাগ বছরের প্রতিদিন ২৪ ঘণ্টা খোলা, সার্বক্ষণিক ডাক্তার ও নার্স ডিউটিতে থাকেন। রোগী কতটা অসুস্থ সেই অনুযায়ী দেখা হয়, শুধু আসার ক্রমে নয় — তাই সবচেয়ে জরুরি রোগী আগে চিকিৎসা পান।\n\nজরুরি টিম সরাসরি হাসপাতালের আইসিইউ, অপারেশন থিয়েটার, ইমেজিং ও ল্যাবের সাথে কাজ করে, তাই দেরি ছাড়াই ভর্তি ও পরীক্ষা শুরু করা যায়।",
        ),
        features: [
            L("Doctors and nurses on duty 24/7", "২৪/৭ ডাক্তার ও নার্স"),
            L(
                "Trauma, resuscitation and acute-care areas",
                "ট্রমা, রিসাসিটেশন ও অ্যাকিউট কেয়ার এরিয়া",
            ),
            L("Direct admission to wards and ICU", "ওয়ার্ড ও আইসিইউতে সরাসরি ভর্তি"),
            L("On-site lab, X-ray and CT", "হাসপাতালেই ল্যাব, এক্স-রে ও সিটি"),
            L("24/7 ambulance and pharmacy", "২৪/৭ অ্যাম্বুলেন্স ও ফার্মেসি"),
        ],
        whenTo: L(
            "Come straight away for chest pain, difficulty breathing, sudden weakness or difficulty speaking, heavy bleeding, a serious injury, a seizure, high fever in a baby, or bleeding or severe pain in pregnancy.",
            "বুকে ব্যথা, শ্বাসকষ্ট, হঠাৎ দুর্বলতা বা কথা বলতে কষ্ট, অতিরিক্ত রক্তক্ষরণ, গুরুতর আঘাত, খিঁচুনি, শিশুর তীব্র জ্বর, বা গর্ভাবস্থায় রক্তক্ষরণ বা তীব্র ব্যথা হলে দেরি না করে চলে আসুন।",
        ),
    },
    "operation-theatres": {
        description: L(
            "The hospital's operation theatres are used for general and laparoscopic surgery, caesarean sections, gynaecological, orthopaedic, ENT, urology and plastic surgery. Strict sterilisation and safety checks are followed before, during and after every operation.\n\nAnaesthesia, post-operative recovery and inpatient wards are in the same building, and the NICU is close by for caesarean births.",
            "হাসপাতালের অপারেশন থিয়েটারে জেনারেল ও ল্যাপারোস্কোপিক সার্জারি, সিজারিয়ান, গাইনি, অর্থোপেডিক, ইএনটি, ইউরোলজি ও প্লাস্টিক সার্জারি হয়। প্রতিটি অপারেশনের আগে, চলাকালে ও পরে কঠোর জীবাণুমুক্তকরণ ও নিরাপত্তা নিয়ম মানা হয়।\n\nঅ্যানেসথেসিয়া, অপারেশন-পরবর্তী রিকভারি ও ওয়ার্ড একই ভবনে, আর সিজারিয়ান শিশুদের জন্য এনআইসিইউ কাছেই।",
        ),
        features: [
            L("Open and laparoscopic surgery", "ওপেন ও ল্যাপারোস্কোপিক সার্জারি"),
            L("Caesarean sections with NICU close by", "কাছেই এনআইসিইউসহ সিজারিয়ান"),
            L("Strict sterilisation protocols", "কঠোর জীবাণুমুক্তকরণ নিয়ম"),
            L("Post-operative recovery area", "অপারেশন-পরবর্তী রিকভারি"),
            L(
                "Fixed surgical packages — Call for Price",
                "নির্ধারিত সার্জারি প্যাকেজ — দাম জানতে কল করুন",
            ),
        ],
    },
    icu: {
        description: L(
            "The intensive care unit looks after patients who are critically ill and need continuous monitoring — after major surgery, with severe infection, breathing failure or heart problems. Each patient has an individual care plan and is reviewed by the medical team throughout the day and night.\n\nFamilies receive regular updates from the doctors. Visiting is limited to protect patients from infection; please ask the ICU desk for current visiting times.",
            "আইসিইউতে গুরুতর অসুস্থ রোগীদের সার্বক্ষণিক পর্যবেক্ষণে রাখা হয় — বড় অপারেশনের পর, তীব্র সংক্রমণ, শ্বাসযন্ত্র বিকল বা হৃদরোগে। প্রতিটি রোগীর আলাদা চিকিৎসা পরিকল্পনা থাকে এবং দিন-রাত মেডিকেল টিম দেখে।\n\nডাক্তাররা নিয়মিত পরিবারকে অবস্থা জানান। সংক্রমণ থেকে রোগীদের রক্ষায় দর্শনার্থী সীমিত; বর্তমান সময় জানতে আইসিইউ ডেস্কে জিজ্ঞেস করুন।",
        ),
        features: [
            L(
                "24/7 monitoring by doctors and critical-care nurses",
                "ডাক্তার ও ক্রিটিক্যাল কেয়ার নার্সের ২৪/৭ পর্যবেক্ষণ",
            ),
            L("Ventilator and life-support equipment", "ভেন্টিলেটর ও লাইফ-সাপোর্ট যন্ত্র"),
            L("Individual care plans", "প্রতিটি রোগীর আলাদা চিকিৎসা পরিকল্পনা"),
            L("Specialists from every department on call", "সব বিভাগের বিশেষজ্ঞ অন-কল"),
            L("Regular family updates", "পরিবারকে নিয়মিত অবস্থা জানানো"),
        ],
    },
    nicu: {
        description: L(
            "The neonatal intensive care unit cares for babies who are born early, small or unwell — with breathing difficulty, infection, jaundice or other problems in the first weeks of life. Neonatologists and neonatal nurses look after each baby, and the unit is next to the maternity ward so mothers can stay close.\n\nWe keep parents involved: you will get regular updates and help with feeding and with caring for your baby at home.",
            "এনআইসিইউতে আগে জন্ম নেওয়া, কম ওজনের বা অসুস্থ নবজাতকদের সেবা দেওয়া হয় — শ্বাসকষ্ট, সংক্রমণ, জন্ডিস বা জীবনের প্রথম সপ্তাহের অন্যান্য সমস্যায়। নবজাতক বিশেষজ্ঞ ও নিওনেটাল নার্সরা প্রতিটি শিশুর দেখাশোনা করেন; ইউনিটটি মাতৃসেবা ওয়ার্ডের পাশে, তাই মা কাছেই থাকতে পারেন।\n\nআমরা বাবা-মাকে সাথে রাখি: নিয়মিত অবস্থা জানানো হয় এবং খাওয়ানো ও বাড়িতে শিশুর যত্নে সহায়তা করা হয়।",
        ),
        features: [
            L(
                "Care for premature and low-birth-weight babies",
                "প্রিম্যাচিউর ও কম ওজনের শিশুর সেবা",
            ),
            L("Breathing support and monitoring", "শ্বাস-সহায়তা ও পর্যবেক্ষণ"),
            L("Phototherapy for jaundice", "জন্ডিসের ফটোথেরাপি"),
            L("Next to the maternity ward", "মাতৃসেবা ওয়ার্ডের পাশেই"),
            L(
                "Feeding and home-care support for parents",
                "বাবা-মায়ের জন্য খাওয়ানো ও বাড়িতে যত্নের সহায়তা",
            ),
        ],
    },
    dialysis: {
        description: L(
            "Our dialysis unit offers haemodialysis and peritoneal dialysis for patients with kidney failure, under the care of nephrologists and trained dialysis technicians. Strict hygiene and infection-control rules are followed for every session.\n\nSessions are booked in advance. Patients new to dialysis meet the nephrologist first to plan the right treatment.",
            "আমাদের ডায়ালাইসিস ইউনিটে কিডনি বিকল রোগীদের জন্য নেফ্রোলজিস্ট ও প্রশিক্ষিত ডায়ালাইসিস টেকনিশিয়ানের তত্ত্বাবধানে হিমোডায়ালাইসিস ও পেরিটোনিয়াল ডায়ালাইসিসের ব্যবস্থা আছে। প্রতিটি সেশনে কঠোর পরিচ্ছন্নতা ও সংক্রমণ নিয়ন্ত্রণ নিয়ম মানা হয়।\n\nসেশন আগে থেকে বুক করতে হয়। নতুন রোগীরা প্রথমে নেফ্রোলজিস্টের সাথে দেখা করে সঠিক চিকিৎসার পরিকল্পনা করেন।",
        ),
        features: [
            L("Haemodialysis", "হিমোডায়ালাইসিস"),
            L("Peritoneal dialysis", "পেরিটোনিয়াল ডায়ালাইসিস"),
            L("Supervised by nephrologists", "নেফ্রোলজিস্টের তত্ত্বাবধান"),
            L("Strict infection control", "কঠোর সংক্রমণ নিয়ন্ত্রণ"),
            L("Sessions booked in advance", "আগে থেকে সেশন বুকিং"),
        ],
    },
    ambulance: {
        description: L(
            "Our ambulances run 24 hours a day for emergencies, transfers between hospitals and planned trips home after discharge. Trained staff travel with the patient and stay in contact with our emergency unit, so the team is ready when you arrive.\n\nCall the emergency number and tell us the patient's condition and your exact location.",
            "আমাদের অ্যাম্বুলেন্স ২৪ ঘণ্টা চলে — জরুরি অবস্থায়, এক হাসপাতাল থেকে আরেক হাসপাতালে স্থানান্তরে এবং ছুটির পর বাড়ি ফেরায়। প্রশিক্ষিত কর্মী রোগীর সাথে থাকেন এবং আমাদের জরুরি বিভাগের সাথে যোগাযোগ রাখেন, তাই পৌঁছানোর সাথে সাথে টিম প্রস্তুত থাকে।\n\nজরুরি নম্বরে কল করে রোগীর অবস্থা ও আপনার সঠিক ঠিকানা জানান।",
        ),
        features: [
            L("Available 24/7", "২৪/৭ সেবা"),
            L("Trained staff on board", "প্রশিক্ষিত কর্মী সাথে থাকেন"),
            L("Emergency, transfer and discharge trips", "জরুরি, স্থানান্তর ও ছুটির পর বাড়ি ফেরা"),
            L("Linked to our emergency unit", "জরুরি বিভাগের সাথে সংযুক্ত"),
        ],
    },
    pharmacy: {
        description: L(
            "The in-house pharmacy is open around the clock for inpatients, emergency patients and visitors. Prescriptions from our doctors can be filled before you leave the building, and the pharmacist can explain how and when to take your medicines.",
            "নিজস্ব ফার্মেসি ভর্তি রোগী, জরুরি রোগী ও দর্শনার্থীদের জন্য দিন-রাত খোলা। আমাদের ডাক্তারদের প্রেসক্রিপশনের ওষুধ ভবন ছাড়ার আগেই নেওয়া যায়, আর ফার্মাসিস্ট কীভাবে ও কখন ওষুধ খাবেন তা বুঝিয়ে দেন।",
        ),
        features: [
            L("Open 24/7", "২৪/৭ খোলা"),
            L("Medicines for inpatients and outpatients", "ভর্তি ও বহির্বিভাগ রোগীর ওষুধ"),
            L("Advice on how to take your medicines", "ওষুধ খাওয়ার নিয়ম বিষয়ে পরামর্শ"),
        ],
    },
    "blood-bank": {
        description: L(
            "The blood bank supports surgery, deliveries and emergencies with blood grouping, cross-matching and screened blood. Every unit is tested before it is given.\n\nIf a family member needs blood, the desk will explain how many donors are needed and what donors should bring.",
            "ব্লাড ব্যাংক অপারেশন, ডেলিভারি ও জরুরি প্রয়োজনে রক্তের গ্রুপ নির্ণয়, ক্রস-ম্যাচিং ও স্ক্রিনিং করা রক্ত দিয়ে সহায়তা করে। দেওয়ার আগে প্রতিটি ব্যাগ পরীক্ষা করা হয়।\n\nপরিবারের কারও রক্ত লাগলে কতজন ডোনার লাগবে এবং ডোনারকে কী আনতে হবে, ডেস্ক বুঝিয়ে বলবে।",
        ),
        features: [
            L("Blood grouping and cross-matching", "রক্তের গ্রুপ নির্ণয় ও ক্রস-ম্যাচিং"),
            L("Screened blood for transfusion", "স্ক্রিনিং করা রক্ত"),
            L("Support for surgery and deliveries", "অপারেশন ও ডেলিভারিতে সহায়তা"),
            L("Donor guidance", "ডোনারদের জন্য নির্দেশনা"),
        ],
    },
    "opd-chambers": {
        description: L(
            "More than sixty specialists hold chambers at Monowara Hospital, seven days a week, mostly in the afternoon and evening. Book a serial by phone or WhatsApp, arrive a little early and bring your previous prescriptions and reports.\n\nLab tests, imaging and the pharmacy are in the same building, so most follow-up tests can be done the same day.",
            "মনোয়ারা হসপিটালে ষাটজনেরও বেশি বিশেষজ্ঞ সপ্তাহে ৭ দিন চেম্বার করেন, বেশিরভাগই বিকেল ও সন্ধ্যায়। ফোন বা হোয়াটসঅ্যাপে সিরিয়াল নিন, একটু আগে আসুন এবং আগের প্রেসক্রিপশন ও রিপোর্ট সাথে আনুন।\n\nল্যাব, ইমেজিং ও ফার্মেসি একই ভবনে, তাই বেশিরভাগ পরীক্ষা একই দিনে করা যায়।",
        ),
        features: [
            L("60+ specialists, 7 days a week", "৬০+ বিশেষজ্ঞ, সপ্তাহে ৭ দিন"),
            L("Serial by phone or WhatsApp", "ফোন বা হোয়াটসঅ্যাপে সিরিয়াল"),
            L("Same-building lab, imaging and pharmacy", "একই ভবনে ল্যাব, ইমেজিং ও ফার্মেসি"),
        ],
    },
    reception: {
        description: L(
            "The front desk is staffed day and night. It handles doctor serials, admissions and discharge, billing and general questions, and can guide you to any part of the hospital.",
            "ফ্রন্ট ডেস্ক দিন-রাত খোলা থাকে। ডাক্তারের সিরিয়াল, ভর্তি ও ছুটি, বিলিং এবং সাধারণ প্রশ্নের উত্তর দেয় এবং হাসপাতালের যেকোনো জায়গায় যেতে পথ দেখায়।",
        ),
        features: [
            L("Open 24/7", "২৪/৭ খোলা"),
            L("Doctor serials and appointments", "ডাক্তারের সিরিয়াল ও অ্যাপয়েন্টমেন্ট"),
            L("Admission, discharge and billing", "ভর্তি, ছুটি ও বিলিং"),
        ],
    },
};

export const diagnosticContent = {
    "pathology-lab": {
        description: L(
            "Our pathology laboratory performs routine and specialised blood, urine and stool tests, tissue (histopathology) and microbiology tests, with quality-control checks on every run. Samples from chambers, wards and the emergency unit are processed on site.",
            "আমাদের প্যাথলজি ল্যাবে রক্ত, প্রস্রাব ও মলের রুটিন ও বিশেষ পরীক্ষা, টিস্যু (হিস্টোপ্যাথলজি) ও মাইক্রোবায়োলজি পরীক্ষা হয়, প্রতিবার মান-নিয়ন্ত্রণ যাচাইসহ। চেম্বার, ওয়ার্ড ও জরুরি বিভাগের নমুনা হাসপাতালেই পরীক্ষা করা হয়।",
        ),
        tests: [
            L("Complete blood count (CBC)", "সিবিসি"),
            L("Blood sugar and HbA1c", "ব্লাড সুগার ও এইচবিএ১সি"),
            L("Lipid profile", "লিপিড প্রোফাইল"),
            L("Kidney, liver and thyroid function", "কিডনি, লিভার ও থাইরয়েড ফাংশন"),
            L("Urine and stool tests", "প্রস্রাব ও মল পরীক্ষা"),
            L("Culture and histopathology", "কালচার ও হিস্টোপ্যাথলজি"),
        ],
        timing: L("Sample collection 7am – 12pm.", "স্যাম্পল কালেকশন সকাল ৭টা – দুপুর ১২টা।"),
        preparation: L(
            "Fasting sugar and lipid profile need 8–10 hours without food (water is fine), so come in the morning. Bring your prescription. Follow any instruction the desk gives you for a specific test.",
            "ফাস্টিং সুগার ও লিপিড প্রোফাইলের জন্য ৮–১০ ঘণ্টা না খেয়ে থাকতে হয় (পানি খাওয়া যাবে), তাই সকালে আসুন। প্রেসক্রিপশন সাথে আনুন। নির্দিষ্ট পরীক্ষার জন্য ডেস্কের দেওয়া নির্দেশনা মেনে চলুন।",
        ),
    },
    "ct-scan-x-ray": {
        description: L(
            "CT scans use X-rays to build detailed cross-sectional pictures of the brain, chest, abdomen and bones; plain X-rays check bones, joints and the chest. Both are quick and painless, and images are reported by radiologists.",
            "সিটি স্ক্যান এক্স-রে ব্যবহার করে মস্তিষ্ক, বুক, পেট ও হাড়ের বিস্তারিত প্রস্থচ্ছেদ ছবি তৈরি করে; সাধারণ এক্স-রে দিয়ে হাড়, জয়েন্ট ও বুক দেখা হয়। দুটোই দ্রুত ও ব্যথাহীন, আর রেডিওলজিস্ট রিপোর্ট করেন।",
        ),
        tests: [
            L("CT brain", "সিটি ব্রেইন"),
            L("CT chest and abdomen", "সিটি চেস্ট ও অ্যাবডোমেন"),
            L("Digital X-ray — chest, bones and joints", "ডিজিটাল এক্স-রে — বুক, হাড় ও জয়েন্ট"),
        ],
        preparation: L(
            "Tell staff if you are or might be pregnant. For a CT with contrast you may need to fast for about 4 hours and bring a recent creatinine report. Remove metal objects before the scan. Follow the desk's instructions.",
            "গর্ভবতী হলে বা সম্ভাবনা থাকলে কর্মীদের জানান। কনট্রাস্টসহ সিটির জন্য প্রায় ৪ ঘণ্টা না খেয়ে থাকা ও সাম্প্রতিক ক্রিয়েটিনিন রিপোর্ট আনা লাগতে পারে। স্ক্যানের আগে ধাতব জিনিস খুলে রাখুন। ডেস্কের নির্দেশনা মেনে চলুন।",
        ),
    },
    "ecg-ett-echo": {
        description: L(
            "An ECG records the heart's electrical activity in a few minutes. An exercise treadmill test (ETT) shows how the heart copes with exertion, which can reveal problems that don't appear at rest. Echocardiography uses ultrasound to show the heart's chambers, valves and pumping strength. All three are non-invasive.",
            "ইসিজি কয়েক মিনিটে হৃদযন্ত্রের বৈদ্যুতিক কার্যকলাপ রেকর্ড করে। ইটিটি (ট্রেডমিল টেস্ট) দেখায় পরিশ্রমে হার্ট কেমন কাজ করে — বিশ্রামে ধরা পড়ে না এমন সমস্যা এতে বোঝা যায়। ইকোকার্ডিওগ্রাফি আল্ট্রাসাউন্ড দিয়ে হার্টের চেম্বার, ভাল্ব ও পাম্প করার ক্ষমতা দেখায়। তিনটিই কাটা-ছেঁড়া ছাড়া পরীক্ষা।",
        ),
        tests: [
            L("12-lead ECG", "১২-লিড ইসিজি"),
            L("Exercise treadmill test (ETT)", "ইটিটি"),
            L("Echocardiography (adult, child and fetal)", "ইকোকার্ডিওগ্রাফি (বড়, শিশু ও ফিটাল)"),
        ],
        preparation: L(
            "ECG and echo need no preparation. For an ETT, wear comfortable shoes and clothes, avoid a heavy meal for 2 hours before, and ask your doctor whether to stop any heart medicines. Follow the desk's instructions.",
            "ইসিজি ও ইকোর জন্য কোনো প্রস্তুতি লাগে না। ইটিটির জন্য আরামদায়ক জুতা ও পোশাক পরুন, ২ ঘণ্টা আগে ভারী খাবার এড়িয়ে চলুন এবং হার্টের কোনো ওষুধ বন্ধ রাখতে হবে কি না ডাক্তারকে জিজ্ঞেস করুন। ডেস্কের নির্দেশনা মেনে চলুন।",
        ),
    },
    "holter-monitoring": {
        description: L(
            "A Holter monitor is a small recorder worn for 24 hours (sometimes longer) that records every heartbeat while you go about your normal day. It helps find irregular rhythms that come and go — the cause of palpitations, dizziness or fainting.",
            "হল্টার মনিটর একটি ছোট রেকর্ডার, যা ২৪ ঘণ্টা (কখনো আরও বেশি) পরে থাকতে হয় এবং স্বাভাবিক কাজের মধ্যেই প্রতিটি হৃদস্পন্দন রেকর্ড করে। বুক ধড়ফড়, মাথা ঘোরা বা অজ্ঞান হওয়ার কারণ — যে অনিয়মিত ছন্দ আসে-যায় — তা খুঁজে পেতে এটি সাহায্য করে।",
        ),
        tests: [L("24-hour Holter ECG", "২৪ ঘণ্টার হল্টার ইসিজি")],
        preparation: L(
            "Shower before you come — you can't get the recorder wet. Wear a loose top. Keep a short diary of symptoms and activities while you wear it, and return the device at the agreed time.",
            "আসার আগে গোসল করে আসুন — রেকর্ডার ভেজানো যাবে না। ঢিলেঢালা জামা পরুন। পরে থাকার সময় উপসর্গ ও কাজের ছোট একটা ডায়েরি রাখুন এবং নির্ধারিত সময়ে যন্ত্রটি ফেরত দিন।",
        ),
    },
    "endoscopy-colonoscopy": {
        description: L(
            "Endoscopy and colonoscopy use a thin, flexible camera to look inside the food pipe, stomach and bowel. They are used to find the cause of pain, bleeding, swallowing problems or bowel changes, to take small biopsies and to remove polyps.\n\nOur gastroenterologists explain the procedure beforehand and give written preparation instructions.",
            "এন্ডোস্কপি ও কোলোনোস্কপিতে চিকন, নমনীয় ক্যামেরা দিয়ে খাদ্যনালি, পাকস্থলী ও অন্ত্রের ভেতর দেখা হয়। ব্যথা, রক্তক্ষরণ, গিলতে কষ্ট বা পায়খানার পরিবর্তনের কারণ খুঁজতে, ছোট বায়োপসি নিতে এবং পলিপ অপসারণে এগুলো ব্যবহার হয়।\n\nআমাদের গ্যাস্ট্রোএন্টারোলজিস্টরা আগে থেকে প্রসিডিউর বুঝিয়ে বলেন এবং লিখিত প্রস্তুতির নির্দেশনা দেন।",
        ),
        tests: [
            L("Upper GI endoscopy", "আপার জিআই এন্ডোস্কপি"),
            L("Colonoscopy", "কোলোনোস্কপি"),
            L("Biopsy and polyp removal", "বায়োপসি ও পলিপ অপসারণ"),
        ],
        preparation: L(
            "Endoscopy: nothing to eat for 6–8 hours before. Colonoscopy: a bowel-cleansing preparation the day before, as instructed. Bring someone to take you home if you receive sedation. Follow the written instructions from the desk.",
            "এন্ডোস্কপি: ৬–৮ ঘণ্টা আগে থেকে কিছু খাওয়া যাবে না। কোলোনোস্কপি: আগের দিন নির্দেশনা অনুযায়ী পেট পরিষ্কারের ওষুধ। ঘুমের ওষুধ দেওয়া হলে বাড়ি ফেরার জন্য একজন সঙ্গী আনুন। ডেস্কের লিখিত নির্দেশনা মেনে চলুন।",
        ),
    },
    ultrasonography: {
        description: L(
            "Ultrasound uses sound waves — no radiation — to look at the abdomen, pelvis, pregnancy, thyroid and other soft tissues. It is painless and safe in pregnancy, and is reported by a sonologist.",
            "আল্ট্রাসাউন্ড শব্দতরঙ্গ ব্যবহার করে — কোনো রেডিয়েশন নেই — পেট, তলপেট, গর্ভাবস্থা, থাইরয়েড ও অন্যান্য নরম টিস্যু দেখতে। এটি ব্যথাহীন ও গর্ভাবস্থায় নিরাপদ, আর সনোলজিস্ট রিপোর্ট করেন।",
        ),
        tests: [
            L("Whole abdomen", "হোল অ্যাবডোমেন"),
            L("Pregnancy (obstetric) scans", "গর্ভাবস্থার স্ক্যান"),
            L("Pelvic and thyroid scans", "তলপেট ও থাইরয়েড স্ক্যান"),
        ],
        preparation: L(
            "Abdomen: nothing to eat for about 6 hours. Pelvis and early pregnancy: come with a full bladder (drink water and don't pass urine). Follow the desk's instructions.",
            "পেট: প্রায় ৬ ঘণ্টা না খেয়ে আসুন। তলপেট ও প্রাথমিক গর্ভাবস্থা: প্রস্রাবের চাপ নিয়ে আসুন (পানি খান, প্রস্রাব করবেন না)। ডেস্কের নির্দেশনা মেনে চলুন।",
        ),
    },
};
