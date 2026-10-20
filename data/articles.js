// Mock `articles` collection — Health Tips & News. The 4 pregnancy topics replace the old
// BHRPC pages filed under /departments (diabetes, thalassaemia, genetic counselling, high BP);
// text rewritten by STR Solutions as general patient information. ⚠ Medical review by the
// hospital before launch; `author` stays null until a doctor agrees to a byline (E-E-A-T).
// Body = sections [{ heading{en,bn}, body{en,bn} }] (paragraphs split by a blank line).
const L = (en, bn) => ({ en, bn });
const S = (hEn, hBn, en, bn) => ({ heading: L(hEn, hBn), body: L(en, bn) });

const rows = [
    {
        slug: "pregnancy-diabetes",
        category: "pregnancy",
        title: L(
            "Diabetes in pregnancy: what every mother should know",
            "গর্ভাবস্থায় ডায়াবেটিস: প্রত্যেক মায়ের যা জানা দরকার",
        ),
        excerpt: L(
            "Gestational diabetes is common and usually controllable. Testing early and keeping sugar in range protects both mother and baby.",
            "গর্ভকালীন ডায়াবেটিস সাধারণ এবং সাধারণত নিয়ন্ত্রণযোগ্য। আগে পরীক্ষা ও সুগার নিয়ন্ত্রণে রাখলে মা ও শিশু দুজনই সুরক্ষিত থাকে।",
        ),
        image: "/uploads/facilities/blood-collection.webp",
        readMinutes: 4,
        publishedAt: "2026-10-21",
        sections: [
            S(
                "What is gestational diabetes?",
                "গর্ভকালীন ডায়াবেটিস কী?",
                "During pregnancy, hormones from the placenta make the body less sensitive to insulin. In some women blood sugar rises above normal — this is gestational diabetes. Women who already had diabetes before pregnancy need extra care from the very start.",
                "গর্ভাবস্থায় গর্ভফুলের হরমোনের কারণে শরীরে ইনসুলিনের কার্যকারিতা কমে যায়। কিছু মায়ের ক্ষেত্রে রক্তে সুগার স্বাভাবিকের চেয়ে বেড়ে যায় — একেই গর্ভকালীন ডায়াবেটিস বলে। যাদের গর্ভধারণের আগে থেকেই ডায়াবেটিস আছে, তাদের শুরু থেকেই বাড়তি যত্ন দরকার।",
            ),
            S(
                "Who should be tested, and when?",
                "কাদের, কখন পরীক্ষা করা উচিত?",
                "Every pregnant woman should have her blood sugar checked. Testing is usually done at the first visit and again between 24 and 28 weeks with an oral glucose tolerance test (OGTT). Women who are overweight, over 30, have a family history of diabetes or had a large baby before may be tested earlier.",
                "প্রত্যেক গর্ভবতী মায়ের রক্তে সুগার পরীক্ষা করা উচিত। সাধারণত প্রথম ভিজিটে এবং আবার ২৪ থেকে ২৮ সপ্তাহের মধ্যে ওজিটিটি (গ্লুকোজ টলারেন্স টেস্ট) করা হয়। যাদের ওজন বেশি, বয়স ৩০-এর বেশি, পরিবারে ডায়াবেটিস আছে বা আগে বড় ওজনের সন্তান হয়েছে, তাদের আরও আগে পরীক্ষা করা হতে পারে।",
            ),
            S(
                "Why control matters",
                "নিয়ন্ত্রণ কেন জরুরি",
                "High sugar can make the baby grow too large, raise the chance of a difficult delivery or caesarean, and cause low sugar in the newborn after birth. Good control lowers these risks a great deal.",
                "সুগার বেশি থাকলে শিশুর ওজন অতিরিক্ত বেড়ে যেতে পারে, জটিল প্রসব বা সিজারের সম্ভাবনা বাড়ে এবং জন্মের পর নবজাতকের সুগার কমে যেতে পারে। ভালো নিয়ন্ত্রণে এসব ঝুঁকি অনেক কমে।",
            ),
            S(
                "What you can do",
                "আপনি যা করতে পারেন",
                "Eat regular, smaller meals; choose brown rice or ruti in sensible portions, plenty of vegetables, lentils and protein; cut down on sweets, sugary drinks and white rice. A 20–30 minute walk after meals helps. Check your sugar as advised and bring the record to every visit. If diet is not enough, your doctor may start medicine or insulin — both are safe in pregnancy when prescribed.\n\nMost women's sugar returns to normal after delivery, but the chance of diabetes later in life is higher, so check it again 6–12 weeks after the birth and then every year.",
                "নিয়মিত, অল্প অল্প করে খান; পরিমিত লাল চাল বা রুটি, প্রচুর সবজি, ডাল ও প্রোটিন বেছে নিন; মিষ্টি, চিনিযুক্ত পানীয় ও সাদা ভাত কমান। খাওয়ার পর ২০–৩০ মিনিট হাঁটা উপকারী। পরামর্শমতো সুগার মাপুন এবং প্রতিটি ভিজিটে হিসাব নিয়ে আসুন। শুধু খাবারে নিয়ন্ত্রণ না হলে ডাক্তার ওষুধ বা ইনসুলিন দিতে পারেন — ডাক্তারের পরামর্শে দুটোই গর্ভাবস্থায় নিরাপদ।\n\nবেশিরভাগ মায়ের প্রসবের পর সুগার স্বাভাবিক হয়ে যায়, তবে পরে ডায়াবেটিস হওয়ার সম্ভাবনা বেশি থাকে, তাই প্রসবের ৬–১২ সপ্তাহ পর এবং এরপর প্রতি বছর পরীক্ষা করুন।",
            ),
        ],
    },
    {
        slug: "pregnancy-high-blood-pressure",
        category: "pregnancy",
        title: L("High blood pressure in pregnancy", "গর্ভাবস্থায় উচ্চ রক্তচাপ"),
        excerpt: L(
            "Checking blood pressure at every visit catches pre-eclampsia early. Know the warning signs that need care the same day.",
            "প্রতিটি ভিজিটে রক্তচাপ মাপলে প্রি-এক্লাম্পসিয়া আগেভাগে ধরা পড়ে। যে লক্ষণ দেখলে সেদিনই চিকিৎসা দরকার, তা জেনে রাখুন।",
        ),
        image: "/uploads/facilities/ward.webp",
        readMinutes: 3,
        publishedAt: "2026-10-21",
        sections: [
            S(
                "Why it matters",
                "কেন গুরুত্বপূর্ণ",
                "Blood pressure of 140/90 or higher in pregnancy needs attention. In some women it comes with protein in the urine — pre-eclampsia — which can affect the mother's kidneys, liver and brain and the baby's growth.",
                "গর্ভাবস্থায় রক্তচাপ ১৪০/৯০ বা তার বেশি হলে মনোযোগ দরকার। কিছু মায়ের ক্ষেত্রে এর সাথে প্রস্রাবে প্রোটিন যায় — একে প্রি-এক্লাম্পসিয়া বলে, যা মায়ের কিডনি, লিভার ও মস্তিষ্ক এবং শিশুর বৃদ্ধিতে প্রভাব ফেলতে পারে।",
            ),
            S(
                "Warning signs — come to emergency the same day",
                "সতর্ক সংকেত — সেদিনই জরুরি বিভাগে আসুন",
                "Severe headache that won't go, blurred vision or flashing lights, pain under the ribs on the right, sudden swelling of the face and hands, breathlessness, fits (convulsions), or the baby moving less than usual.",
                "না সারা তীব্র মাথাব্যথা, চোখে ঝাপসা দেখা বা আলোর ঝলকানি, ডান পাঁজরের নিচে ব্যথা, হঠাৎ মুখ ও হাত ফুলে যাওয়া, শ্বাসকষ্ট, খিঁচুনি, বা শিশুর নড়াচড়া স্বাভাবিকের চেয়ে কমে যাওয়া।",
            ),
            S(
                "Care and prevention",
                "চিকিৎসা ও প্রতিরোধ",
                "Attend every antenatal check-up so blood pressure and urine are tested. Some women at higher risk are advised low-dose aspirin from early pregnancy — only take it if your doctor prescribes it. If blood pressure is high you may need medicine, closer monitoring and a planned delivery at the right time.",
                "প্রতিটি গর্ভকালীন চেকআপে আসুন, যাতে রক্তচাপ ও প্রস্রাব পরীক্ষা করা যায়। ঝুঁকি বেশি থাকলে কিছু মাকে গর্ভাবস্থার শুরু থেকে কম মাত্রার অ্যাসপিরিন দেওয়া হয় — শুধু ডাক্তার দিলে তবেই খাবেন। রক্তচাপ বেশি হলে ওষুধ, ঘন ঘন পর্যবেক্ষণ এবং সঠিক সময়ে পরিকল্পিত ডেলিভারি লাগতে পারে।",
            ),
        ],
    },
    {
        slug: "thalassaemia",
        category: "pregnancy",
        title: L(
            "Thalassaemia: why a simple test before marriage matters",
            "থ্যালাসেমিয়া: বিয়ের আগে একটি সহজ পরীক্ষা কেন জরুরি",
        ),
        excerpt: L(
            "Many people in Bangladesh carry thalassaemia without knowing it. If both parents are carriers, each child has a 1 in 4 chance of the disease.",
            "বাংলাদেশে অনেকেই না জেনে থ্যালাসেমিয়ার বাহক। বাবা-মা দুজনই বাহক হলে প্রতিটি সন্তানের এ রোগ হওয়ার সম্ভাবনা ৪ ভাগের ১ ভাগ।",
        ),
        image: "/uploads/facilities/pathology-sample.webp",
        readMinutes: 3,
        publishedAt: "2026-10-21",
        sections: [
            S(
                "Carrier and patient — the difference",
                "বাহক ও রোগী — পার্থক্য",
                "Thalassaemia is an inherited blood disorder. A carrier (trait) is usually healthy and may only have mild anaemia. A child who inherits the gene from both parents can have thalassaemia major and need regular blood transfusions for life.",
                "থ্যালাসেমিয়া বংশগত রক্তের রোগ। বাহক সাধারণত সুস্থ থাকেন, হয়তো সামান্য রক্তস্বল্পতা থাকে। বাবা-মা দুজনের কাছ থেকে জিন পেলে শিশুর থ্যালাসেমিয়া মেজর হতে পারে, তখন সারাজীবন নিয়মিত রক্ত নিতে হয়।",
            ),
            S(
                "The test",
                "পরীক্ষা",
                "A blood count (CBC) and haemoglobin electrophoresis show whether you are a carrier. It is a one-time test — ideally before marriage or before planning a pregnancy.",
                "সিবিসি ও হিমোগ্লোবিন ইলেক্ট্রোফোরেসিস পরীক্ষায় বোঝা যায় আপনি বাহক কি না। এটি একবারের পরীক্ষা — সম্ভব হলে বিয়ের আগে বা গর্ভধারণের পরিকল্পনার আগে।",
            ),
            S(
                "If both partners are carriers",
                "দুজনই বাহক হলে",
                "It is not a reason to panic. Talk to a haematologist or obstetrician: tests during early pregnancy can show whether the baby is affected, so the family can make informed decisions with the doctor's support.",
                "আতঙ্কিত হওয়ার কিছু নেই। হেমাটোলজিস্ট বা গাইনি বিশেষজ্ঞের সাথে কথা বলুন: গর্ভাবস্থার শুরুতে পরীক্ষা করে জানা যায় শিশু আক্রান্ত কি না, তাই ডাক্তারের সহায়তায় পরিবার জেনে-বুঝে সিদ্ধান্ত নিতে পারে।",
            ),
        ],
    },
    {
        slug: "genetic-counselling",
        category: "pregnancy",
        title: L(
            "Genetic counselling before and during pregnancy",
            "গর্ভধারণের আগে ও সময় জেনেটিক কাউন্সেলিং",
        ),
        excerpt: L(
            "A conversation with a specialist about inherited conditions, screening tests and what the results mean for your family.",
            "বংশগত রোগ, স্ক্রিনিং টেস্ট এবং এর ফলাফল আপনার পরিবারের জন্য কী অর্থ বহন করে — এ নিয়ে বিশেষজ্ঞের সাথে আলোচনা।",
        ),
        image: "/uploads/facilities/nicu-care.webp",
        readMinutes: 3,
        publishedAt: "2026-10-21",
        sections: [
            S(
                "Who may benefit",
                "কাদের উপকারে আসে",
                "Couples who are related by blood (cousin marriage), have a family history of an inherited condition such as thalassaemia, had a previous baby with a birth difference, or have had repeated miscarriages. Mothers over 35 may also be offered extra screening.",
                "যেসব দম্পতি রক্তের সম্পর্কে আত্মীয় (যেমন চাচাতো-মামাতো ভাইবোনের বিয়ে), পরিবারে থ্যালাসেমিয়ার মতো বংশগত রোগ আছে, আগের সন্তানের জন্মগত ত্রুটি ছিল বা বারবার গর্ভপাত হয়েছে। ৩৫ বছরের বেশি বয়সী মায়েদেরও বাড়তি স্ক্রিনিংয়ের পরামর্শ দেওয়া হতে পারে।",
            ),
            S(
                "What happens in a session",
                "সেশনে যা হয়",
                "The specialist takes a family history, explains the chances in plain language, and suggests tests if useful — for example carrier tests, first-trimester screening or detailed scans. You decide what to do; the counsellor's job is to inform and support, not to decide for you.",
                "বিশেষজ্ঞ পারিবারিক ইতিহাস নেন, সম্ভাবনাগুলো সহজ ভাষায় বুঝিয়ে বলেন এবং প্রয়োজনে পরীক্ষার পরামর্শ দেন — যেমন বাহক পরীক্ষা, প্রথম তিন মাসের স্ক্রিনিং বা বিস্তারিত স্ক্যান। সিদ্ধান্ত আপনার; কাউন্সেলরের কাজ জানানো ও পাশে থাকা, আপনার হয়ে সিদ্ধান্ত নেওয়া নয়।",
            ),
        ],
    },
    {
        slug: "dengue-warning-signs",
        category: "general",
        title: L(
            "Dengue: warning signs that mean hospital, now",
            "ডেঙ্গু: যে লক্ষণ দেখলে এখনই হাসপাতালে",
        ),
        excerpt: L(
            "Most dengue gets better with rest and fluids — but the dangerous phase often starts as the fever goes down.",
            "বেশিরভাগ ডেঙ্গু বিশ্রাম ও তরল খাবারে সেরে যায় — কিন্তু বিপজ্জনক সময় প্রায়ই শুরু হয় জ্বর কমার সময়।",
        ),
        image: "/uploads/facilities/blood-collection.webp",
        readMinutes: 3,
        publishedAt: "2026-10-21",
        sections: [
            S(
                "At home",
                "বাড়িতে",
                "Rest, drink plenty — water, oral saline, soup, fruit juice — and take paracetamol for fever. Do not take ibuprofen, aspirin or other painkillers, which can increase bleeding. Check a blood count (CBC) as your doctor advises.",
                "বিশ্রাম নিন, প্রচুর তরল খান — পানি, খাবার স্যালাইন, স্যুপ, ফলের রস — আর জ্বরের জন্য প্যারাসিটামল খান। আইবুপ্রোফেন, অ্যাসপিরিন বা অন্য ব্যথানাশক খাবেন না, এতে রক্তক্ষরণ বাড়তে পারে। ডাক্তারের পরামর্শমতো সিবিসি পরীক্ষা করুন।",
            ),
            S(
                "Come to emergency if you notice",
                "এসব দেখলে জরুরি বিভাগে আসুন",
                "Severe abdominal pain, repeated vomiting, bleeding from the gums or nose, black stools, extreme tiredness or restlessness, cold clammy hands and feet, or passing very little urine — especially in the 1–2 days after the fever settles.",
                "পেটে তীব্র ব্যথা, বারবার বমি, দাঁতের মাড়ি বা নাক দিয়ে রক্ত, কালো পায়খানা, অতিরিক্ত ক্লান্তি বা অস্থিরতা, হাত-পা ঠান্ডা ও ঘামে ভেজা, বা খুব কম প্রস্রাব — বিশেষ করে জ্বর কমার পরের ১–২ দিনে।",
            ),
        ],
    },
    {
        slug: "heart-attack-signs",
        category: "general",
        title: L(
            "Heart attack: don't wait to be sure",
            "হার্ট অ্যাটাক: নিশ্চিত হওয়ার অপেক্ষা করবেন না",
        ),
        excerpt: L(
            "Chest pain isn't always dramatic. Minutes matter — know the signs and call for help early.",
            "বুকে ব্যথা সবসময় তীব্র হয় না। প্রতিটি মিনিট গুরুত্বপূর্ণ — লক্ষণ চিনুন, আগেভাগে সাহায্য নিন।",
        ),
        image: "/uploads/facilities/ct-scan-room.webp",
        readMinutes: 2,
        publishedAt: "2026-10-21",
        sections: [
            S(
                "Common signs",
                "সাধারণ লক্ষণ",
                "Pressure, tightness or pain in the chest lasting more than a few minutes, which may spread to the arm, neck, jaw or back; with sweating, breathlessness, nausea or light-headedness. Women, older people and people with diabetes may have milder or unusual symptoms.",
                "কয়েক মিনিটের বেশি বুকে চাপ, আঁটসাঁট ভাব বা ব্যথা, যা হাত, ঘাড়, চোয়াল বা পিঠে ছড়াতে পারে; সাথে ঘাম, শ্বাসকষ্ট, বমি ভাব বা মাথা হালকা লাগা। নারী, বয়স্ক ও ডায়াবেটিস রোগীদের লক্ষণ হালকা বা অস্বাভাবিক হতে পারে।",
            ),
            S(
                "What to do",
                "যা করবেন",
                "Stop what you are doing and sit down. Call the emergency line or come to the nearest emergency unit straight away — don't drive yourself. Bring a list of your medicines and any previous ECG.",
                "যা করছেন থামিয়ে বসে পড়ুন। দেরি না করে জরুরি নম্বরে কল করুন বা নিকটতম জরুরি বিভাগে আসুন — নিজে গাড়ি চালাবেন না। ওষুধের তালিকা ও আগের ইসিজি সাথে আনুন।",
            ),
        ],
    },
];

export const articles = rows.map((a, i) => ({
    _id: `art_${a.slug}`,
    author: null, // doctor id once a byline is agreed
    reviewedBy: null,
    isActive: true,
    order: i + 1,
    createdAt: `${a.publishedAt}T00:00:00.000Z`,
    updatedAt: `${a.publishedAt}T00:00:00.000Z`,
    ...a,
}));
