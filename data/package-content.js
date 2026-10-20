// Long-form copy for `packages` (merged in data/packages.js). Written by STR Solutions.
// `typicalStay` values are common practice in Dhaka, NOT hospital policy — CONFIRM with the client.
// Prices are never shown (proposal §5.1): every package is "Call for Price".
const L = (en, bn) => ({ en, bn });

export const packageContent = {
    "normal-delivery": {
        description: L(
            "Our normal-delivery package covers labour-room care with the obstetric team, the delivery itself and the newborn's first check by a paediatrician. We support natural birth wherever it is safe, and the operation theatre and NICU are on hand if plans need to change.",
            "নরমাল ডেলিভারি প্যাকেজে প্রসূতি টিমের তত্ত্বাবধানে লেবার রুম সেবা, ডেলিভারি এবং শিশু বিশেষজ্ঞের মাধ্যমে নবজাতকের প্রথম চেকআপ অন্তর্ভুক্ত। নিরাপদ হলে আমরা স্বাভাবিক প্রসবে সহায়তা করি; পরিকল্পনা বদলাতে হলে অপারেশন থিয়েটার ও এনআইসিইউ প্রস্তুত থাকে।",
        ),
        whoFor: L(
            "Expecting mothers planning a vaginal birth.",
            "যারা স্বাভাবিক প্রসবের পরিকল্পনা করছেন।",
        ),
        typicalStay: L("Usually 1–2 days", "সাধারণত ১–২ দিন"),
    },
    "c-section": {
        description: L(
            "Planned or emergency caesarean delivery in our own theatres, with anaesthesia, recovery and the NICU in the same building. Your obstetrician explains the reasons, the anaesthesia and the recovery before the operation.",
            "নিজস্ব থিয়েটারে পরিকল্পিত বা জরুরি সিজারিয়ান ডেলিভারি — অ্যানেসথেসিয়া, রিকভারি ও এনআইসিইউ একই ভবনে। অপারেশনের আগে আপনার গাইনি বিশেষজ্ঞ কারণ, অ্যানেসথেসিয়া ও সেরে ওঠার বিষয় বুঝিয়ে বলেন।",
        ),
        whoFor: L(
            "Mothers advised a caesarean by their obstetrician.",
            "যাদের গাইনি বিশেষজ্ঞ সিজারের পরামর্শ দিয়েছেন।",
        ),
        typicalStay: L("Usually 3–4 days", "সাধারণত ৩–৪ দিন"),
    },
    "antenatal-care": {
        description: L(
            "A planned series of check-ups through pregnancy — blood pressure, weight and baby's growth, routine blood and urine tests and scheduled ultrasound scans — with the same obstetric team you will meet at delivery.",
            "গর্ভাবস্থা জুড়ে পরিকল্পিত চেকআপ — রক্তচাপ, ওজন ও শিশুর বৃদ্ধি, রুটিন রক্ত ও প্রস্রাব পরীক্ষা এবং নির্ধারিত আল্ট্রাসাউন্ড — ডেলিভারির সময় যে প্রসূতি টিমের সাথে দেখা হবে, তাদের সাথেই।",
        ),
        whoFor: L(
            "Any stage of pregnancy — ideally from the first trimester.",
            "গর্ভাবস্থার যেকোনো পর্যায়ে — সম্ভব হলে প্রথম তিন মাস থেকেই।",
        ),
        typicalStay: L("Outpatient visits", "বহির্বিভাগ ভিজিট"),
    },
    "basic-health-check": {
        description: L(
            "A simple yearly baseline: a blood count, blood sugar, urine test and chest X-ray, reviewed by a doctor. A good starting point if you haven't had a check-up in a while.",
            "সহজ বার্ষিক চেকআপ: রক্তের কাউন্ট, ব্লাড সুগার, প্রস্রাব পরীক্ষা ও বুকের এক্স-রে, ডাক্তারের পর্যালোচনাসহ। অনেকদিন চেকআপ না করে থাকলে শুরুর জন্য ভালো।",
        ),
        whoFor: L("Adults of any age, once a year.", "যেকোনো বয়সের প্রাপ্তবয়স্ক, বছরে একবার।"),
        typicalStay: L("Half a morning", "সকালের কয়েক ঘণ্টা"),
    },
    "executive-health-check": {
        description: L(
            "A broader panel of blood tests and imaging, finished with a specialist consultation to go through every result with you.",
            "বিস্তৃত রক্ত পরীক্ষা ও ইমেজিং, শেষে বিশেষজ্ঞের সাথে প্রতিটি ফলাফল নিয়ে আলোচনা।",
        ),
        whoFor: L(
            "Adults over 40, or anyone with a family history of illness.",
            "৪০ বছরের বেশি বয়সী বা পারিবারিক রোগের ইতিহাস আছে এমন যে কেউ।",
        ),
        typicalStay: L("Most of a morning", "সকালের বেশিরভাগ সময়"),
    },
    "diabetes-care-check": {
        description: L(
            "Checks how well your diabetes has been controlled over the last three months (HbA1c) and looks for early signs of heart and kidney complications.",
            "গত তিন মাসে ডায়াবেটিস কতটা নিয়ন্ত্রণে ছিল (এইচবিএ১সি) তা দেখে এবং হার্ট ও কিডনির জটিলতার প্রাথমিক লক্ষণ খোঁজে।",
        ),
        whoFor: L(
            "People living with diabetes — every 3–6 months.",
            "ডায়াবেটিস রোগী — প্রতি ৩–৬ মাসে।",
        ),
        typicalStay: L("Half a morning", "সকালের কয়েক ঘণ্টা"),
    },
    "heart-health-check": {
        description: L(
            "An ECG, echocardiogram and cholesterol test, with results reviewed for signs of heart strain, valve problems or raised cardiovascular risk.",
            "ইসিজি, ইকোকার্ডিওগ্রাম ও কোলেস্টেরল পরীক্ষা — হার্টের ওপর চাপ, ভাল্বের সমস্যা বা হৃদরোগের ঝুঁকির লক্ষণ দেখা হয়।",
        ),
        whoFor: L(
            "Adults with high blood pressure, diabetes, smoking or a family history of heart disease.",
            "উচ্চ রক্তচাপ, ডায়াবেটিস, ধূমপান বা পারিবারিক হৃদরোগের ইতিহাস আছে এমন প্রাপ্তবয়স্ক।",
        ),
        typicalStay: L("A few hours", "কয়েক ঘণ্টা"),
    },
    musolmani: {
        description: L(
            "Circumcision for boys, done as a day-care procedure by our surgical team under appropriate anaesthesia, with clear wound-care advice for home.",
            "ছেলেদের মুসলমানি (খৎনা), সার্জিক্যাল টিমের মাধ্যমে উপযুক্ত অ্যানেসথেসিয়ায় ডে-কেয়ার প্রসিডিউর হিসেবে, বাড়িতে ক্ষতের যত্নের পরিষ্কার নির্দেশনাসহ।",
        ),
        whoFor: L(
            "Boys of any age; adults on request.",
            "যেকোনো বয়সের ছেলে; অনুরোধে প্রাপ্তবয়স্ক।",
        ),
        typicalStay: L("Day care — home the same day", "ডে-কেয়ার — একই দিনে বাড়ি"),
    },
    "laparoscopic-cholecystectomy": {
        description: L(
            "Keyhole removal of the gallbladder for gallstones, through a few small cuts. Most patients walk the same evening and return to normal activity within one to two weeks.",
            "পিত্তথলির পাথরের জন্য কয়েকটি ছোট ছিদ্র দিয়ে ল্যাপারোস্কোপিক পদ্ধতিতে পিত্তথলি অপসারণ। বেশিরভাগ রোগী সেদিন সন্ধ্যাতেই হাঁটতে পারেন এবং এক-দুই সপ্তাহে স্বাভাবিক কাজে ফেরেন।",
        ),
        whoFor: L("Patients with symptomatic gallstones.", "উপসর্গযুক্ত পিত্তথলির পাথরের রোগী।"),
        typicalStay: L("Usually 1–2 days", "সাধারণত ১–২ দিন"),
    },
    "hernia-surgery": {
        description: L(
            "Repair of inguinal, umbilical or incisional hernia, usually with a mesh — open or laparoscopic, depending on the hernia and your health.",
            "ইনগুইনাল, নাভির বা আগের অপারেশনের জায়গার হার্নিয়া রিপেয়ার, সাধারণত মেশ দিয়ে — হার্নিয়া ও আপনার স্বাস্থ্য অনুযায়ী ওপেন বা ল্যাপারোস্কোপিক।",
        ),
        whoFor: L("Adults and children with a hernia.", "হার্নিয়া আছে এমন বড় ও শিশু।"),
        typicalStay: L("Usually 1–2 days", "সাধারণত ১–২ দিন"),
    },
    "appendix-surgery": {
        description: L(
            "Removal of an inflamed appendix, planned or as an emergency, by open or laparoscopic surgery. Severe pain in the lower right abdomen should be seen in the emergency unit straight away.",
            "প্রদাহযুক্ত অ্যাপেন্ডিক্স অপসারণ — পরিকল্পিত বা জরুরি, ওপেন বা ল্যাপারোস্কোপিক পদ্ধতিতে। পেটের ডান-নিচে তীব্র ব্যথা হলে দেরি না করে জরুরি বিভাগে আসুন।",
        ),
        whoFor: L("Patients diagnosed with appendicitis.", "অ্যাপেন্ডিসাইটিস ধরা পড়েছে এমন রোগী।"),
        typicalStay: L("Usually 1–3 days", "সাধারণত ১–৩ দিন"),
    },
};
