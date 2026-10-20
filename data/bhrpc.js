// Mock `bhrpc` singleton — the hospital's high-risk pregnancy programme (old /pregnancy-care).
// CONFIRM: full name (the old site never spells out "BHRPC"; heading suggests
// "Bangladesh High Risk Pregnancy Care & Research Center"). Copy written by STR Solutions.
const L = (en, bn) => ({ en, bn });

export const bhrpc = {
    _id: "bhrpc_main",
    short: "BHRPC",
    name: L(
        "Bangladesh High Risk Pregnancy Care & Research Center",
        "বাংলাদেশ হাই রিস্ক প্রেগনেন্সি কেয়ার অ্যান্ড রিসার্চ সেন্টার",
    ),
    tagline: L(
        "Specialist care when a pregnancy needs a closer watch.",
        "যে গর্ভাবস্থায় বাড়তি নজর দরকার, সেখানে বিশেষজ্ঞ সেবা।",
    ),
    about: L(
        "Most pregnancies go smoothly, but some need extra attention — because of diabetes or high blood pressure, a previous difficult pregnancy, twins, a mother's age, or a problem found on a scan. BHRPC is Monowara Hospital's programme for these pregnancies, led by a feto-maternal medicine specialist with a team of obstetricians.\n\nWe plan check-ups and scans around your risks, work closely with medicine, diabetes and cardiology specialists in the same hospital, and prepare early for a safe delivery — with the operation theatres and NICU in the same building.",
        "বেশিরভাগ গর্ভাবস্থা স্বাভাবিকভাবেই এগোয়, তবে কিছু ক্ষেত্রে বাড়তি নজর দরকার — ডায়াবেটিস বা উচ্চ রক্তচাপ, আগের জটিল গর্ভাবস্থা, যমজ সন্তান, মায়ের বয়স বা স্ক্যানে কোনো সমস্যা ধরা পড়লে। এ ধরনের গর্ভাবস্থার জন্য মনোয়ারা হসপিটালের কর্মসূচি বিএইচআরপিসি, যার নেতৃত্বে আছেন একজন ফিটো-ম্যাটার্নাল মেডিসিন বিশেষজ্ঞ ও প্রসূতি বিশেষজ্ঞদের একটি দল।\n\nআপনার ঝুঁকি অনুযায়ী আমরা চেকআপ ও স্ক্যানের পরিকল্পনা করি, একই হাসপাতালের মেডিসিন, ডায়াবেটিস ও হৃদরোগ বিশেষজ্ঞদের সাথে কাজ করি এবং নিরাপদ ডেলিভারির জন্য আগে থেকেই প্রস্তুতি নিই — অপারেশন থিয়েটার ও এনআইসিইউ একই ভবনে।",
    ),
    whoFor: [
        L("Diabetes before or during pregnancy", "গর্ভাবস্থার আগে বা সময়ে ডায়াবেটিস"),
        L("High blood pressure or pre-eclampsia", "উচ্চ রক্তচাপ বা প্রি-এক্লাম্পসিয়া"),
        L("Twins or more", "যমজ বা তার বেশি সন্তান"),
        L(
            "Previous miscarriage, stillbirth or preterm birth",
            "আগে গর্ভপাত, মৃত সন্তান প্রসব বা আগাম প্রসব",
        ),
        L("Previous caesarean section", "আগে সিজারিয়ান হয়েছে"),
        L("Thyroid, heart or kidney disease", "থাইরয়েড, হৃদরোগ বা কিডনি রোগ"),
        L("Thalassaemia carrier or family history", "থ্যালাসেমিয়া বাহক বা পারিবারিক ইতিহাস"),
        L("A problem found on the baby's scan", "শিশুর স্ক্যানে কোনো সমস্যা ধরা পড়া"),
    ],
    services: [
        L("Risk assessment at the first visit", "প্রথম ভিজিটে ঝুঁকি মূল্যায়ন"),
        L("Personalised antenatal check-up plan", "ব্যক্তিগত গর্ভকালীন চেকআপ পরিকল্পনা"),
        L("Pregnancy and growth scans", "গর্ভাবস্থা ও শিশুর বৃদ্ধির স্ক্যান"),
        L(
            "Diabetes and blood-pressure control in pregnancy",
            "গর্ভাবস্থায় ডায়াবেটিস ও রক্তচাপ নিয়ন্ত্রণ",
        ),
        L("Genetic and thalassaemia counselling", "জেনেটিক ও থ্যালাসেমিয়া কাউন্সেলিং"),
        L("Delivery planning with the NICU team", "এনআইসিইউ টিমের সাথে ডেলিভারি পরিকল্পনা"),
        L("Postnatal follow-up", "প্রসব-পরবর্তী ফলো-আপ"),
    ],
    doctors: [
        "doc_dr-mahfuja-asma",
        "doc_dr-arifa-sharmin",
        "doc_dr-dina-layla-hossain",
        "doc_dr-rajshree-debnath",
        "doc_dr-raunak-jahan",
        "doc_dr-sanjida-mahmud",
        "doc_dr-tajmira-sultana",
    ],
    // Bangla articles from the old BHRPC pages → /health-tips/<slug> (step 4.7)
    topics: [
        "pregnancy-diabetes",
        "thalassaemia",
        "genetic-counselling",
        "pregnancy-high-blood-pressure",
    ],
    createdAt: "2026-10-21T00:00:00.000Z",
    updatedAt: "2026-10-21T00:00:00.000Z",
};
