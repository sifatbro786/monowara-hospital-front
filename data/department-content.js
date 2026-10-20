// Long-form content for `departments` (merged in data/departments.js → same Mongo doc).
// Written by STR Solutions in Phase 4 — the old site's specialist pages had only generic copy.
// General, accurate patient information; no invented figures (beds, machines). Client to review.
// Shape: description{en,bn} (paragraphs split by a blank line), services[{en,bn}], conditions[{en,bn}]
const L = (en, bn) => ({ en, bn });

export const departmentContent = {
    "gynaecology-obstetrics": {
        description: L(
            "For more than three decades, families in Dhaka have trusted Monowara Hospital with their pregnancies. Our obstetric and gynaecology team follows you from the first antenatal visit to delivery and the weeks after, with the labour room, operation theatres and NICU in the same building.\n\nAlongside maternity care, our gynaecologists treat menstrual problems, fibroids and ovarian cysts, infertility and menopause, and perform laparoscopic and hysteroscopic surgery. Gynae-oncology specialists see women with suspected cancers of the cervix, uterus and ovaries.",
            "তিন দশকেরও বেশি সময় ধরে ঢাকার পরিবারগুলো তাদের গর্ভকালীন সময়ে মনোয়ারা হসপিটালের ওপর ভরসা করে আসছে। প্রথম চেকআপ থেকে ডেলিভারি এবং পরবর্তী সপ্তাহগুলো পর্যন্ত আমাদের প্রসূতি ও স্ত্রীরোগ টিম আপনার পাশে থাকে — লেবার রুম, অপারেশন থিয়েটার ও এনআইসিইউ একই ভবনে।\n\nমাতৃসেবার পাশাপাশি আমাদের গাইনি বিশেষজ্ঞরা মাসিকের সমস্যা, ফাইব্রয়েড ও ওভারিয়ান সিস্ট, বন্ধ্যাত্ব ও মেনোপজের চিকিৎসা করেন এবং ল্যাপারোস্কোপিক ও হিস্টেরোস্কোপিক সার্জারি করেন। জরায়ুমুখ, জরায়ু ও ডিম্বাশয়ের ক্যান্সার সন্দেহে গাইনি-অনকোলজি বিশেষজ্ঞরা পরামর্শ দেন।",
        ),
        services: [
            L("Antenatal check-ups and pregnancy scans", "গর্ভকালীন চেকআপ ও আল্ট্রাসনোগ্রাফি"),
            L("Normal delivery and caesarean section", "নরমাল ডেলিভারি ও সিজারিয়ান"),
            L("High-risk and feto-maternal care", "ঝুঁকিপূর্ণ গর্ভাবস্থা ও ফিটো-ম্যাটার্নাল সেবা"),
            L("Infertility evaluation and treatment", "বন্ধ্যাত্ব নির্ণয় ও চিকিৎসা"),
            L(
                "Laparoscopic and hysteroscopic surgery",
                "ল্যাপারোস্কোপিক ও হিস্টেরোস্কোপিক সার্জারি",
            ),
            L("Gynae-oncology consultations and colposcopy", "গাইনি-অনকোলজি পরামর্শ ও কলপোস্কপি"),
            L("Postnatal and family-planning advice", "প্রসব-পরবর্তী সেবা ও পরিবার পরিকল্পনা"),
        ],
        conditions: [
            L("Irregular or heavy periods", "অনিয়মিত বা অতিরিক্ত মাসিক"),
            L("Fibroids and ovarian cysts", "ফাইব্রয়েড ও ওভারিয়ান সিস্ট"),
            L("PCOS and hormonal problems", "পিসিওএস ও হরমোনজনিত সমস্যা"),
            L(
                "Diabetes or high blood pressure in pregnancy",
                "গর্ভাবস্থায় ডায়াবেটিস বা উচ্চ রক্তচাপ",
            ),
            L("Difficulty conceiving", "গর্ভধারণে সমস্যা"),
            L("Menopause symptoms", "মেনোপজের উপসর্গ"),
        ],
    },
    "general-laparoscopic-surgery": {
        description: L(
            "Our general surgeons operate in the hospital's own theatres, with anaesthesia, recovery and inpatient wards on site. Wherever it is safe, we use laparoscopic (keyhole) techniques, which usually mean smaller scars, less pain and a quicker return home.\n\nCommon procedures include gallbladder removal, hernia repair, appendicectomy, breast lumps and minor procedures. Before any operation the surgeon explains the plan, the expected stay and the recovery, and the desk can quote a package on the phone.",
            "আমাদের জেনারেল সার্জনরা হাসপাতালের নিজস্ব থিয়েটারে অপারেশন করেন — অ্যানেসথেসিয়া, রিকভারি ও ওয়ার্ড একই ভবনে। নিরাপদ হলে আমরা ল্যাপারোস্কোপিক (কি-হোল) পদ্ধতি ব্যবহার করি, এতে সাধারণত দাগ ছোট হয়, ব্যথা কম হয় এবং দ্রুত বাড়ি ফেরা যায়।\n\nসাধারণ অপারেশনের মধ্যে আছে পিত্তথলির পাথর অপসারণ, হার্নিয়া, অ্যাপেন্ডিক্স, স্তনের চাকা ও ছোট অপারেশন। অপারেশনের আগে সার্জন পরিকল্পনা, কতদিন থাকতে হবে ও সেরে ওঠার বিষয়ে বুঝিয়ে বলেন; প্যাকেজের দাম ফোনে জানানো হয়।",
        ),
        services: [
            L("Laparoscopic gallbladder removal", "ল্যাপারোস্কোপিক পিত্তথলি অপারেশন"),
            L(
                "Hernia repair (open and laparoscopic)",
                "হার্নিয়া অপারেশন (ওপেন ও ল্যাপারোস্কোপিক)",
            ),
            L("Appendix surgery", "অ্যাপেন্ডিক্স অপারেশন"),
            L("Breast lump assessment and surgery", "স্তনের চাকা পরীক্ষা ও অপারেশন"),
            L("Piles, fissure and fistula treatment", "পাইলস, ফিশার ও ফিস্টুলার চিকিৎসা"),
            L("Circumcision (musolmani) and minor procedures", "মুসলমানি ও ছোট অপারেশন"),
        ],
        conditions: [
            L("Gallstones", "পিত্তথলির পাথর"),
            L("Inguinal and umbilical hernia", "ইনগুইনাল ও নাভির হার্নিয়া"),
            L("Appendicitis", "অ্যাপেন্ডিসাইটিস"),
            L("Lumps and cysts", "চাকা ও সিস্ট"),
            L("Piles and anal fissure", "পাইলস ও ফিশার"),
            L("Wounds and abscesses", "ক্ষত ও ফোড়া"),
        ],
    },
    cardiology: {
        description: L(
            "Heart problems often start quietly — breathlessness on the stairs, chest discomfort, palpitations or high blood pressure that never quite settles. Our cardiologists assess these symptoms and plan treatment and follow-up with you.\n\nECG, exercise stress test (ETT), echocardiography and Holter monitoring are done in the hospital, so most patients can see the doctor and finish their heart tests in one visit.",
            "হৃদরোগ অনেক সময় নীরবে শুরু হয় — সিঁড়িতে উঠতে শ্বাসকষ্ট, বুকে অস্বস্তি, বুক ধড়ফড় বা কিছুতেই না কমা উচ্চ রক্তচাপ। আমাদের কার্ডিওলজিস্টরা এসব উপসর্গ পরীক্ষা করে চিকিৎসা ও ফলো-আপ পরিকল্পনা করেন।\n\nইসিজি, ইটিটি, ইকোকার্ডিওগ্রাফি ও হল্টার মনিটরিং হাসপাতালেই হয়, তাই বেশিরভাগ রোগী এক ভিজিটেই ডাক্তার দেখানো ও হার্টের পরীক্ষা শেষ করতে পারেন।",
        ),
        services: [
            L("Cardiology consultation and follow-up", "হৃদরোগ পরামর্শ ও ফলো-আপ"),
            L("ECG and exercise stress test (ETT)", "ইসিজি ও ইটিটি"),
            L("Echocardiography", "ইকোকার্ডিওগ্রাফি"),
            L("24-hour Holter monitoring", "২৪ ঘণ্টার হল্টার মনিটরিং"),
            L("Blood pressure and cholesterol management", "রক্তচাপ ও কোলেস্টেরল নিয়ন্ত্রণ"),
            L("Pre-operative heart assessment", "অপারেশনের আগে হার্ট পরীক্ষা"),
        ],
        conditions: [
            L("Chest pain and angina", "বুকে ব্যথা ও অ্যানজাইনা"),
            L("High blood pressure", "উচ্চ রক্তচাপ"),
            L("Palpitations and irregular heartbeat", "বুক ধড়ফড় ও অনিয়মিত হৃদস্পন্দন"),
            L("Heart failure and breathlessness", "হার্ট ফেইলিউর ও শ্বাসকষ্ট"),
            L("Valve disease", "হার্টের ভাল্বের রোগ"),
            L("Follow-up after a heart attack", "হার্ট অ্যাটাকের পর ফলো-আপ"),
        ],
    },
    "dermatology-venereology": {
        description: L(
            "Our dermatologists treat conditions of the skin, hair and nails, as well as sexually transmitted infections, in private consultations. Many skin problems look alike, so a proper diagnosis comes first; treatment may be medicines, procedures or a combination.\n\nFor cosmetic and aesthetic treatments — laser, peels, PRP and similar — our sub-brand MH Aesthetic & Wellness has its own desk and opening hours.",
            "আমাদের চর্মরোগ বিশেষজ্ঞরা ত্বক, চুল ও নখের রোগ এবং যৌনবাহিত সংক্রমণের চিকিৎসা গোপনীয়তা রক্ষা করে করেন। অনেক চর্মরোগ দেখতে একই রকম, তাই আগে সঠিক রোগনির্ণয়; এরপর ওষুধ, প্রসিডিউর বা দুটোই।\n\nকসমেটিক ও অ্যাসথেটিক ট্রিটমেন্টের জন্য — লেজার, পিল, পিআরপি ইত্যাদি — আমাদের এমএইচ অ্যাসথেটিক অ্যান্ড ওয়েলনেসের আলাদা ডেস্ক ও সময়সূচি আছে।",
        ),
        services: [
            L("Skin, hair and nail consultations", "ত্বক, চুল ও নখের পরামর্শ"),
            L("Acne and acne-scar treatment", "ব্রণ ও ব্রণের দাগের চিকিৎসা"),
            L("Eczema, psoriasis and allergy care", "একজিমা, সোরিয়াসিস ও অ্যালার্জি"),
            L("Fungal and bacterial skin infections", "ছত্রাক ও ব্যাকটেরিয়াজনিত চর্মরোগ"),
            L(
                "Confidential STI diagnosis and treatment",
                "গোপনীয়তার সাথে যৌনরোগ নির্ণয় ও চিকিৎসা",
            ),
            L("Minor skin procedures", "ত্বকের ছোট প্রসিডিউর"),
        ],
        conditions: [
            L("Acne and pigmentation", "ব্রণ ও মেছতা"),
            L("Eczema and urticaria", "একজিমা ও আমবাত"),
            L("Psoriasis", "সোরিয়াসিস"),
            L("Hair loss", "চুল পড়া"),
            L("Ringworm and scabies", "দাদ ও খোসপাঁচড়া"),
            L("Sexually transmitted infections", "যৌনবাহিত সংক্রমণ"),
        ],
    },
    medicine: {
        description: L(
            "Internal medicine is often the right first stop when you are unwell and not sure which specialist you need. Our medicine specialists diagnose and treat a wide range of adult illnesses and coordinate tests and referrals within the hospital.\n\nMany of our patients live with long-term conditions such as diabetes, high blood pressure or thyroid disease. We help keep these under control with regular reviews, clear medicine plans and advice you can follow at home.",
            "কোন বিশেষজ্ঞ দেখাবেন বুঝতে না পারলে মেডিসিন বিশেষজ্ঞই সাধারণত প্রথম সঠিক জায়গা। আমাদের মেডিসিন বিশেষজ্ঞরা প্রাপ্তবয়স্কদের নানা রোগ নির্ণয় ও চিকিৎসা করেন এবং হাসপাতালের ভেতরেই প্রয়োজনীয় পরীক্ষা ও রেফারেল সমন্বয় করেন।\n\nআমাদের অনেক রোগী ডায়াবেটিস, উচ্চ রক্তচাপ বা থাইরয়েডের মতো দীর্ঘমেয়াদি রোগ নিয়ে থাকেন। নিয়মিত ফলো-আপ, পরিষ্কার ওষুধের পরিকল্পনা ও ঘরে মেনে চলার মতো পরামর্শ দিয়ে আমরা এগুলো নিয়ন্ত্রণে রাখতে সাহায্য করি।",
        ),
        services: [
            L("Adult medicine consultations", "প্রাপ্তবয়স্কদের মেডিসিন পরামর্শ"),
            L("Fever and infection work-up", "জ্বর ও সংক্রমণের পরীক্ষা-নিরীক্ষা"),
            L("Diabetes and blood pressure reviews", "ডায়াবেটিস ও রক্তচাপের নিয়মিত ফলো-আপ"),
            L("Health check-ups for adults", "প্রাপ্তবয়স্কদের হেলথ চেকআপ"),
            L("Inpatient care under a physician", "ফিজিশিয়ানের তত্ত্বাবধানে ভর্তি চিকিৎসা"),
            L("Sleep-medicine advice", "ঘুমের সমস্যার পরামর্শ"),
        ],
        conditions: [
            L("Fever, dengue and typhoid", "জ্বর, ডেঙ্গু ও টাইফয়েড"),
            L("Diabetes", "ডায়াবেটিস"),
            L("High blood pressure", "উচ্চ রক্তচাপ"),
            L("Thyroid problems", "থাইরয়েডের সমস্যা"),
            L("Joint and rheumatic pain", "জয়েন্ট ও বাতের ব্যথা"),
            L("Insomnia and sleep apnoea", "অনিদ্রা ও স্লিপ অ্যাপনিয়া"),
        ],
    },
    "paediatrics-neonatology": {
        description: L(
            "Children are not small adults — they need doctors who understand how they grow, how illness shows up at different ages and how to talk to worried parents. Our paediatricians include senior professors with long experience in child and newborn care.\n\nBabies who need extra help after birth are looked after in our NICU, right next to the maternity ward, so mothers can stay close.",
            "শিশুরা ছোট আকারের বড় মানুষ নয় — তাদের দরকার এমন ডাক্তার, যিনি বোঝেন শিশু কীভাবে বেড়ে ওঠে, বিভিন্ন বয়সে রোগ কীভাবে দেখা দেয় এবং চিন্তিত বাবা-মায়ের সাথে কীভাবে কথা বলতে হয়। আমাদের শিশু বিশেষজ্ঞদের মধ্যে শিশু ও নবজাতক চিকিৎসায় দীর্ঘ অভিজ্ঞ অধ্যাপকরা আছেন।\n\nজন্মের পর যেসব শিশুর বাড়তি যত্ন লাগে, তাদের দেখাশোনা হয় মাতৃসেবা ওয়ার্ডের পাশের এনআইসিইউতে, তাই মা কাছেই থাকতে পারেন।",
        ),
        services: [
            L("Child and newborn consultations", "শিশু ও নবজাতকের পরামর্শ"),
            L("Growth and development checks", "বৃদ্ধি ও বিকাশ পরীক্ষা"),
            L("Vaccination advice", "টিকা বিষয়ক পরামর্শ"),
            L(
                "NICU care for premature and unwell babies",
                "প্রিম্যাচিউর ও অসুস্থ নবজাতকের এনআইসিইউ সেবা",
            ),
            L("Child kidney (paediatric nephrology) clinic", "শিশু কিডনি রোগের পরামর্শ"),
            L("Inpatient care for children", "শিশুদের ভর্তি চিকিৎসা"),
        ],
        conditions: [
            L("Fever, cough and cold", "জ্বর, কাশি ও ঠান্ডা"),
            L("Diarrhoea and dehydration", "ডায়রিয়া ও পানিশূন্যতা"),
            L("Asthma and wheezing", "অ্যাজমা ও শ্বাসে শোঁ শোঁ শব্দ"),
            L("Newborn jaundice", "নবজাতকের জন্ডিস"),
            L("Poor weight gain", "ওজন না বাড়া"),
            L("Kidney problems in children", "শিশুর কিডনির সমস্যা"),
        ],
    },
    oncology: {
        description: L(
            "Hearing the word cancer is frightening. Our oncology consultants — clinical, medical and surgical oncologists from the National Institute of Cancer Research & Hospital and other leading centres — see patients in chamber here, explain the diagnosis and the options, and plan treatment step by step.\n\nThey help with second opinions, reviewing biopsy and scan reports, planning chemotherapy, radiotherapy or surgery, and follow-up after treatment.",
            "ক্যান্সার শব্দটি শুনলেই ভয় লাগে। জাতীয় ক্যান্সার গবেষণা ইনস্টিটিউটসহ শীর্ষ প্রতিষ্ঠানের ক্লিনিক্যাল, মেডিক্যাল ও সার্জিক্যাল অনকোলজিস্টরা এখানে চেম্বার করেন — রোগ ও চিকিৎসার উপায় বুঝিয়ে বলেন এবং ধাপে ধাপে চিকিৎসার পরিকল্পনা করেন।\n\nদ্বিতীয় মতামত, বায়োপসি ও স্ক্যান রিপোর্ট পর্যালোচনা, কেমোথেরাপি, রেডিওথেরাপি বা সার্জারির পরিকল্পনা এবং চিকিৎসা-পরবর্তী ফলো-আপে তারা সহায়তা করেন।",
        ),
        services: [
            L("Oncology consultations and second opinions", "অনকোলজি পরামর্শ ও দ্বিতীয় মতামত"),
            L("Review of biopsy and scan reports", "বায়োপসি ও স্ক্যান রিপোর্ট পর্যালোচনা"),
            L("Chemotherapy and radiotherapy planning", "কেমোথেরাপি ও রেডিওথেরাপির পরিকল্পনা"),
            L("Surgical oncology opinion", "সার্জিক্যাল অনকোলজি পরামর্শ"),
            L("Follow-up after cancer treatment", "ক্যান্সার চিকিৎসার পর ফলো-আপ"),
        ],
        conditions: [
            L("Breast cancer", "স্তন ক্যান্সার"),
            L("Cervical and ovarian cancer", "জরায়ুমুখ ও ডিম্বাশয়ের ক্যান্সার"),
            L("Lung cancer", "ফুসফুসের ক্যান্সার"),
            L("Stomach and bowel cancer", "পাকস্থলী ও অন্ত্রের ক্যান্সার"),
            L("Head and neck cancer", "মাথা ও গলার ক্যান্সার"),
            L("Unexplained lumps or weight loss", "অজানা চাকা বা ওজন কমে যাওয়া"),
        ],
    },
    "diabetes-endocrinology": {
        description: L(
            "Diabetes and thyroid problems are common in Bangladesh and are best managed with a steady plan rather than quick fixes. Our endocrinologists and diabetologists review your sugar readings and reports, adjust medicines or insulin and set realistic targets with you.\n\nDiet makes a big difference, so we work closely with our nutrition team on meal plans that fit Bangladeshi food and family life.",
            "বাংলাদেশে ডায়াবেটিস ও থাইরয়েডের সমস্যা খুবই সাধারণ, আর এগুলো তাড়াহুড়োর সমাধানে নয়, স্থির পরিকল্পনায় সবচেয়ে ভালো নিয়ন্ত্রণে থাকে। আমাদের এন্ডোক্রাইনোলজিস্ট ও ডায়াবেটোলজিস্টরা আপনার সুগারের হিসাব ও রিপোর্ট দেখে ওষুধ বা ইনসুলিন ঠিক করেন এবং আপনার সাথে বাস্তবসম্মত লক্ষ্য ঠিক করেন।\n\nখাবার বড় পার্থক্য গড়ে দেয়, তাই আমাদের পুষ্টি টিমের সাথে মিলে বাংলাদেশি খাবার ও পারিবারিক জীবনের সাথে মানানসই ডায়েট প্ল্যান করা হয়।",
        ),
        services: [
            L(
                "Diabetes consultation and insulin planning",
                "ডায়াবেটিস পরামর্শ ও ইনসুলিন পরিকল্পনা",
            ),
            L("Thyroid disorders", "থাইরয়েডের রোগ"),
            L("Diabetes in pregnancy", "গর্ভকালীন ডায়াবেটিস"),
            L("Diabetic foot and complication screening", "ডায়াবেটিক ফুট ও জটিলতা স্ক্রিনিং"),
            L("Hormone and weight problems", "হরমোন ও ওজনের সমস্যা"),
            L("Diet planning with our dietitians", "ডায়েটিশিয়ানের সাথে খাদ্য পরিকল্পনা"),
        ],
        conditions: [
            L("Type 1 and type 2 diabetes", "টাইপ ১ ও টাইপ ২ ডায়াবেটিস"),
            L("Hypothyroidism and hyperthyroidism", "হাইপোথাইরয়েডিজম ও হাইপারথাইরয়েডিজম"),
            L("Goitre and thyroid nodules", "গলগণ্ড ও থাইরয়েড নডিউল"),
            L("PCOS", "পিসিওএস"),
            L("Obesity", "স্থূলতা"),
            L("High cholesterol", "উচ্চ কোলেস্টেরল"),
        ],
    },
    "gastroenterology-liver": {
        description: L(
            "Acidity, abdominal pain, change in bowel habit or a liver report that worries you — our gastroenterology and liver specialists see these problems every day. They decide which tests are needed and explain the results in plain language.\n\nEndoscopy and colonoscopy are done in the hospital, so a camera test can often be arranged soon after your consultation.",
            "অ্যাসিডিটি, পেটব্যথা, পায়খানার ধরনে পরিবর্তন বা চিন্তার মতো লিভার রিপোর্ট — আমাদের গ্যাস্ট্রো ও লিভার বিশেষজ্ঞরা প্রতিদিন এসব সমস্যা দেখেন। কোন পরীক্ষা লাগবে তারা ঠিক করেন এবং ফলাফল সহজ ভাষায় বুঝিয়ে দেন।\n\nএন্ডোস্কপি ও কোলোনোস্কপি হাসপাতালেই হয়, তাই পরামর্শের পর অনেক সময় দ্রুতই ক্যামেরা পরীক্ষার ব্যবস্থা করা যায়।",
        ),
        services: [
            L("Gastro and liver consultations", "গ্যাস্ট্রো ও লিভার পরামর্শ"),
            L("Upper GI endoscopy", "আপার জিআই এন্ডোস্কপি"),
            L("Colonoscopy", "কোলোনোস্কপি"),
            L("Hepatitis B and C management", "হেপাটাইটিস বি ও সি চিকিৎসা"),
            L("Fatty liver assessment", "ফ্যাটি লিভার পরীক্ষা"),
        ],
        conditions: [
            L("Acidity, gastritis and ulcers", "অ্যাসিডিটি, গ্যাস্ট্রাইটিস ও আলসার"),
            L("IBS and chronic diarrhoea", "আইবিএস ও দীর্ঘমেয়াদি ডায়রিয়া"),
            L("Fatty liver and hepatitis", "ফ্যাটি লিভার ও হেপাটাইটিস"),
            L("Jaundice", "জন্ডিস"),
            L("Blood in stool", "পায়খানার সাথে রক্ত"),
            L("Difficulty swallowing", "খাবার গিলতে কষ্ট"),
        ],
    },
    haematology: {
        description: L(
            "Haematologists look after disorders of the blood and bone marrow — from anaemia that doesn't improve with iron, to bleeding problems, thalassaemia and blood cancers. Diagnosis usually starts with blood tests in our own laboratory.\n\nFamilies planning a pregnancy can also ask about thalassaemia carrier testing and what the results mean for their children.",
            "রক্ত ও অস্থিমজ্জার রোগের চিকিৎসা করেন হেমাটোলজিস্টরা — আয়রন খেয়েও না সারা রক্তস্বল্পতা থেকে শুরু করে রক্তক্ষরণের সমস্যা, থ্যালাসেমিয়া ও রক্তের ক্যান্সার পর্যন্ত। রোগনির্ণয় সাধারণত শুরু হয় আমাদের নিজস্ব ল্যাবের রক্ত পরীক্ষা দিয়ে।\n\nসন্তান নিতে চাওয়া দম্পতিরা থ্যালাসেমিয়া বাহক পরীক্ষা এবং এর ফলাফল সন্তানের জন্য কী অর্থ বহন করে, সে বিষয়েও পরামর্শ নিতে পারেন।",
        ),
        services: [
            L("Haematology consultations", "রক্তরোগ পরামর্শ"),
            L("Anaemia work-up", "রক্তস্বল্পতার কারণ নির্ণয়"),
            L("Thalassaemia care and carrier counselling", "থ্যালাসেমিয়া চিকিৎসা ও বাহক পরামর্শ"),
            L("Bleeding and clotting disorders", "রক্তক্ষরণ ও রক্ত জমাট বাঁধার সমস্যা"),
            L("Blood cancer follow-up", "রক্তের ক্যান্সারের ফলো-আপ"),
        ],
        conditions: [
            L("Iron-deficiency and other anaemias", "আয়রনের অভাবজনিত ও অন্যান্য রক্তস্বল্পতা"),
            L("Thalassaemia", "থ্যালাসেমিয়া"),
            L("Low platelets", "প্লাটিলেট কমে যাওয়া"),
            L("Easy bruising or bleeding", "সহজে কালশিটে বা রক্তক্ষরণ"),
            L("Leukaemia and lymphoma", "লিউকেমিয়া ও লিম্ফোমা"),
        ],
    },
    nephrology: {
        description: L(
            "Kidney disease often has no symptoms until it is advanced, which is why people with diabetes or high blood pressure need regular kidney checks. Our nephrologists interpret creatinine and urine reports, slow kidney damage where possible and plan dialysis when it is needed.\n\nHaemodialysis is available in the hospital's own dialysis unit.",
            "কিডনি রোগ অনেক সময় অনেক দূর না যাওয়া পর্যন্ত কোনো উপসর্গ দেখায় না, তাই ডায়াবেটিস বা উচ্চ রক্তচাপের রোগীদের নিয়মিত কিডনি পরীক্ষা দরকার। আমাদের নেফ্রোলজিস্টরা ক্রিয়েটিনিন ও প্রস্রাবের রিপোর্ট ব্যাখ্যা করেন, সম্ভব হলে কিডনির ক্ষতি ধীর করেন এবং প্রয়োজনে ডায়ালাইসিসের পরিকল্পনা করেন।\n\nহাসপাতালের নিজস্ব ডায়ালাইসিস ইউনিটে হিমোডায়ালাইসিসের ব্যবস্থা আছে।",
        ),
        services: [
            L("Kidney consultations", "কিডনি রোগ পরামর্শ"),
            L("Chronic kidney disease management", "দীর্ঘমেয়াদি কিডনি রোগের চিকিৎসা"),
            L("Dialysis planning and sessions", "ডায়ালাইসিস পরিকল্পনা ও সেশন"),
            L("Kidney care in diabetes and hypertension", "ডায়াবেটিস ও উচ্চ রক্তচাপে কিডনির যত্ন"),
            L("Urine and kidney-function test review", "প্রস্রাব ও কিডনি ফাংশন টেস্ট পর্যালোচনা"),
        ],
        conditions: [
            L("Rising creatinine", "ক্রিয়েটিনিন বেড়ে যাওয়া"),
            L("Protein or blood in urine", "প্রস্রাবে প্রোটিন বা রক্ত"),
            L("Swelling of legs and face", "পা ও মুখ ফুলে যাওয়া"),
            L("Kidney failure", "কিডনি বিকল"),
            L("Urinary tract infection", "মূত্রনালির সংক্রমণ"),
        ],
    },
    neurology: {
        description: L(
            "Our neurology team includes neurologists, who treat conditions of the brain and nerves with medicines and follow-up, and neurosurgeons, who operate on the brain and spine when surgery is the right answer.\n\nIf you notice sudden weakness of the face, arm or leg, or sudden difficulty speaking, treat it as a stroke — call the emergency line or come straight to the emergency unit.",
            "আমাদের নিউরোলজি টিমে আছেন নিউরোলজিস্ট, যারা ওষুধ ও ফলো-আপের মাধ্যমে মস্তিষ্ক ও স্নায়ুর রোগের চিকিৎসা করেন, এবং নিউরোসার্জন, যারা প্রয়োজন হলে মস্তিষ্ক ও মেরুদণ্ডের অপারেশন করেন।\n\nহঠাৎ মুখ, হাত বা পা দুর্বল হয়ে গেলে বা কথা বলতে কষ্ট হলে এটিকে স্ট্রোক ধরে নিন — জরুরি নম্বরে কল করুন বা সরাসরি জরুরি বিভাগে আসুন।",
        ),
        services: [
            L("Neurology consultations", "নিউরোলজি পরামর্শ"),
            L(
                "Brain and spine neurosurgery opinion",
                "মস্তিষ্ক ও মেরুদণ্ডের নিউরোসার্জারি পরামর্শ",
            ),
            L("Stroke follow-up and prevention", "স্ট্রোক-পরবর্তী ফলো-আপ ও প্রতিরোধ"),
            L("Headache and migraine care", "মাথাব্যথা ও মাইগ্রেনের চিকিৎসা"),
            L("Epilepsy management", "মৃগীরোগের চিকিৎসা"),
        ],
        conditions: [
            L("Stroke", "স্ট্রোক"),
            L("Headache and migraine", "মাথাব্যথা ও মাইগ্রেন"),
            L("Epilepsy and seizures", "মৃগী ও খিঁচুনি"),
            L("Back and neck pain with nerve symptoms", "স্নায়ুর উপসর্গসহ কোমর ও ঘাড়ব্যথা"),
            L("Numbness and tingling", "অবশ ভাব ও ঝিনঝিন"),
            L("Head and spine injury", "মাথা ও মেরুদণ্ডের আঘাত"),
        ],
    },
    ent: {
        description: L(
            "Ear, nose and throat problems affect sleep, hearing and everyday comfort. Our ENT surgeons — including specialists from the National Institute of ENT — examine you in chamber, arrange hearing and imaging tests where needed and perform ENT and head-neck surgery.",
            "নাক, কান ও গলার সমস্যা ঘুম, শোনা ও দৈনন্দিন স্বস্তিতে প্রভাব ফেলে। জাতীয় নাক-কান-গলা ইনস্টিটিউটের বিশেষজ্ঞসহ আমাদের ইএনটি সার্জনরা চেম্বারে পরীক্ষা করেন, প্রয়োজনে শ্রবণ ও ইমেজিং পরীক্ষার ব্যবস্থা করেন এবং নাক-কান-গলা ও হেড-নেক সার্জারি করেন।",
        ),
        services: [
            L("ENT consultations for adults and children", "বড় ও শিশুদের ইএনটি পরামর্শ"),
            L("Tonsil and adenoid surgery", "টনসিল ও এডিনয়েড অপারেশন"),
            L("Endoscopic sinus surgery", "এন্ডোস্কোপিক সাইনাস সার্জারি"),
            L("Ear microsurgery", "কানের মাইক্রোসার্জারি"),
            L("Head and neck lumps", "মাথা ও গলার চাকা"),
        ],
        conditions: [
            L("Sinusitis and nasal blockage", "সাইনুসাইটিস ও নাক বন্ধ"),
            L("Ear infection and discharge", "কানে সংক্রমণ ও পুঁজ"),
            L("Hearing loss", "কানে কম শোনা"),
            L("Tonsillitis", "টনসিলাইটিস"),
            L("Snoring", "নাক ডাকা"),
            L("Hoarse voice", "গলা ভাঙা"),
        ],
    },
    orthopaedics: {
        description: L(
            "Our orthopaedic surgeons treat injuries and problems of the bones, joints and spine — from fractures after a fall or road accident to knee pain that limits walking. Treatment may be a plaster, physiotherapy, medicines or surgery, and the surgeon explains which suits you.\n\nPhysical medicine and physiotherapy in the same hospital help you recover strength and movement afterwards.",
            "আমাদের অর্থোপেডিক সার্জনরা হাড়, জয়েন্ট ও মেরুদণ্ডের আঘাত ও সমস্যার চিকিৎসা করেন — পড়ে গিয়ে বা সড়ক দুর্ঘটনায় হাড় ভাঙা থেকে শুরু করে হাঁটতে কষ্ট দেওয়া হাঁটুব্যথা পর্যন্ত। চিকিৎসা হতে পারে প্লাস্টার, ফিজিওথেরাপি, ওষুধ বা অপারেশন — কোনটি আপনার জন্য উপযুক্ত, সার্জন বুঝিয়ে বলেন।\n\nএকই হাসপাতালে ফিজিক্যাল মেডিসিন ও ফিজিওথেরাপি থাকায় পরে শক্তি ও চলাফেরা ফিরে পেতে সুবিধা হয়।",
        ),
        services: [
            L("Fracture and trauma care", "হাড় ভাঙা ও ট্রমা চিকিৎসা"),
            L("Knee and hip pain treatment", "হাঁটু ও কোমরের জয়েন্টের ব্যথার চিকিৎসা"),
            L("Joint replacement opinion", "জয়েন্ট রিপ্লেসমেন্ট পরামর্শ"),
            L("Spine problems", "মেরুদণ্ডের সমস্যা"),
            L("Sports and ligament injuries", "খেলাধুলা ও লিগামেন্টের আঘাত"),
        ],
        conditions: [
            L("Fractures and dislocations", "হাড় ভাঙা ও জয়েন্ট সরে যাওয়া"),
            L("Knee osteoarthritis", "হাঁটুর অস্টিওআর্থ্রাইটিস"),
            L("Back pain and disc problems", "কোমরব্যথা ও ডিস্কের সমস্যা"),
            L("Frozen shoulder", "ফ্রোজেন শোল্ডার"),
            L("Ligament tears", "লিগামেন্ট ছিঁড়ে যাওয়া"),
        ],
    },
    "paediatric-cardiology": {
        description: L(
            "Some babies are born with heart problems, and some are found only when a doctor hears a murmur during a routine check. Our paediatric cardiologist examines children of all ages, performs echocardiography — including fetal echo during pregnancy — and plans follow-up or referral for surgery when it is needed.",
            "কিছু শিশু জন্মগত হৃদরোগ নিয়ে জন্মায়, আবার কিছু ধরা পড়ে নিয়মিত চেকআপে ডাক্তার মার্মার শুনলে। আমাদের শিশু হৃদরোগ বিশেষজ্ঞ সব বয়সের শিশুকে পরীক্ষা করেন, ইকোকার্ডিওগ্রাফি করেন — গর্ভাবস্থায় ফিটাল ইকোসহ — এবং প্রয়োজনে ফলো-আপ বা অপারেশনের জন্য রেফারেলের পরিকল্পনা করেন।",
        ),
        services: [
            L("Child heart consultations", "শিশুর হৃদরোগ পরামর্শ"),
            L("Paediatric and fetal echocardiography", "শিশু ও ফিটাল ইকোকার্ডিওগ্রাফি"),
            L("Congenital heart disease follow-up", "জন্মগত হৃদরোগের ফলো-আপ"),
            L("Newborn heart screening", "নবজাতকের হার্ট স্ক্রিনিং"),
        ],
        conditions: [
            L("Heart murmur", "হার্ট মার্মার"),
            L("Hole in the heart (ASD, VSD)", "হার্টে ছিদ্র (এএসডি, ভিএসডি)"),
            L("Blue spells or breathlessness in babies", "শিশুর নীল হয়ে যাওয়া বা শ্বাসকষ্ট"),
            L("Poor feeding and weight gain", "খেতে না পারা ও ওজন না বাড়া"),
        ],
    },
    "physical-medicine": {
        description: L(
            "Physical medicine and rehabilitation specialists treat pain and loss of movement without surgery wherever possible. They combine medicines, injections, therapeutic exercise and physiotherapy to help you get back to work and daily life after injury, stroke or long-standing arthritis.",
            "ফিজিক্যাল মেডিসিন ও রিহ্যাবিলিটেশন বিশেষজ্ঞরা যতটা সম্ভব অপারেশন ছাড়াই ব্যথা ও চলাফেরার সমস্যার চিকিৎসা করেন। আঘাত, স্ট্রোক বা দীর্ঘদিনের বাতের পর কাজ ও দৈনন্দিন জীবনে ফিরতে তারা ওষুধ, ইনজেকশন, থেরাপিউটিক ব্যায়াম ও ফিজিওথেরাপি একসাথে ব্যবহার করেন।",
        ),
        services: [
            L("Pain and rehabilitation consultations", "ব্যথা ও রিহ্যাবিলিটেশন পরামর্শ"),
            L("Arthritis management", "বাতের চিকিৎসা"),
            L("Stroke and paralysis rehabilitation", "স্ট্রোক ও প্যারালাইসিসের রিহ্যাবিলিটেশন"),
            L("Back and neck pain programmes", "কোমর ও ঘাড়ব্যথার চিকিৎসা পরিকল্পনা"),
        ],
        conditions: [
            L("Back and neck pain", "কোমর ও ঘাড়ব্যথা"),
            L("Arthritis", "বাত"),
            L("Paralysis after stroke", "স্ট্রোকের পর প্যারালাইসিস"),
            L("Frozen shoulder", "ফ্রোজেন শোল্ডার"),
            L("Sports injuries", "খেলাধুলার আঘাত"),
        ],
    },
    physiotherapy: {
        description: L(
            "Our physiotherapists work with you one-to-one on exercises and treatments that reduce pain and rebuild strength — after an operation, a fracture, a stroke or simply years of back pain. Sessions run morning and evening, so they can fit around work.",
            "আমাদের ফিজিওথেরাপিস্টরা আপনার সাথে আলাদাভাবে কাজ করেন — অপারেশন, হাড় ভাঙা, স্ট্রোক বা বছরের পর বছর কোমরব্যথার পর ব্যথা কমাতে ও শক্তি ফেরাতে ব্যায়াম ও চিকিৎসা দেন। সকাল ও সন্ধ্যা দুই বেলাতেই সেশন হয়, তাই কাজের ফাঁকে করা যায়।",
        ),
        services: [
            L("Exercise therapy", "ব্যায়াম থেরাপি"),
            L(
                "Post-operative and post-fracture rehabilitation",
                "অপারেশন ও হাড় ভাঙার পর রিহ্যাবিলিটেশন",
            ),
            L("Stroke rehabilitation", "স্ট্রোক রিহ্যাবিলিটেশন"),
            L("Pain management", "ব্যথা ব্যবস্থাপনা"),
        ],
        conditions: [
            L("Back and neck pain", "কোমর ও ঘাড়ব্যথা"),
            L("Knee pain", "হাঁটুব্যথা"),
            L("Stiffness after surgery", "অপারেশনের পর জড়তা"),
            L("Weakness after stroke", "স্ট্রোকের পর দুর্বলতা"),
        ],
    },
    "plastic-surgery": {
        description: L(
            "Plastic surgery restores form and function — after burns, injuries, cancer surgery or birth differences — as well as offering cosmetic procedures. Our plastic surgeons include specialists from the national burn and plastic surgery institute.\n\nCosmetic consultations can also be arranged through MH Aesthetic & Wellness.",
            "প্লাস্টিক সার্জারি পোড়া, আঘাত, ক্যান্সার সার্জারি বা জন্মগত ত্রুটির পর শরীরের গঠন ও কার্যক্ষমতা ফিরিয়ে আনে, পাশাপাশি কসমেটিক প্রসিডিউরও করা হয়। আমাদের প্লাস্টিক সার্জনদের মধ্যে জাতীয় বার্ন ও প্লাস্টিক সার্জারি ইনস্টিটিউটের বিশেষজ্ঞরা আছেন।\n\nকসমেটিক পরামর্শ এমএইচ অ্যাসথেটিক অ্যান্ড ওয়েলনেসের মাধ্যমেও নেওয়া যায়।",
        ),
        services: [
            L("Burn care and scar revision", "পোড়ার চিকিৎসা ও দাগ সংশোধন"),
            L("Reconstructive surgery", "রিকনস্ট্রাকটিভ সার্জারি"),
            L("Hand surgery", "হ্যান্ড সার্জারি"),
            L("Breast surgery", "ব্রেস্ট সার্জারি"),
            L("Cosmetic procedures", "কসমেটিক প্রসিডিউর"),
        ],
        conditions: [
            L("Burn scars and contractures", "পোড়ার দাগ ও টান"),
            L("Cleft lip and palate", "ঠোঁট ও তালুকাটা"),
            L("Hand injuries", "হাতের আঘাত"),
            L("Skin lesions", "ত্বকের ক্ষত"),
        ],
    },
    "thoracic-surgery": {
        description: L(
            "Thoracic surgeons operate on the chest — the lungs, the chest wall and the space around them. Patients are usually referred by a chest physician or after a chest X-ray or CT shows something that needs a surgeon's opinion.\n\nCall the desk to check current chamber days for thoracic surgery.",
            "থোরাসিক সার্জনরা বুকের অপারেশন করেন — ফুসফুস, বুকের খাঁচা ও এর আশপাশের অংশ। সাধারণত বক্ষব্যাধি বিশেষজ্ঞের রেফারেলে বা বুকের এক্স-রে বা সিটি স্ক্যানে সার্জনের মতামত দরকার এমন কিছু ধরা পড়লে রোগীরা আসেন।\n\nথোরাসিক সার্জারির বর্তমান চেম্বারের দিন জানতে ডেস্কে কল করুন।",
        ),
        services: [
            L("Thoracic surgery consultations", "থোরাসিক সার্জারি পরামর্শ"),
            L("Chest drain and fluid management", "চেস্ট ড্রেন ও বুকে পানি জমার চিকিৎসা"),
            L("Chest injury care", "বুকের আঘাতের চিকিৎসা"),
        ],
        conditions: [
            L("Fluid or air around the lung", "ফুসফুসের চারপাশে পানি বা বাতাস"),
            L("Chest injuries", "বুকের আঘাত"),
            L("Lung masses", "ফুসফুসে চাকা"),
        ],
    },
    urology: {
        description: L(
            "Urologists treat problems of the kidneys, bladder, prostate and male reproductive system. Many of these can be handled with keyhole (endo-urology) techniques that need no cut on the skin.\n\nBlood in the urine should always be checked by a doctor, even if it happens only once.",
            "ইউরোলজিস্টরা কিডনি, মূত্রথলি, প্রোস্টেট ও পুরুষের প্রজননতন্ত্রের সমস্যার চিকিৎসা করেন। এর অনেকগুলোই ত্বকে কাটা ছাড়া এন্ডো-ইউরোলজি পদ্ধতিতে করা যায়।\n\nপ্রস্রাবে রক্ত একবার দেখা গেলেও অবশ্যই ডাক্তার দেখানো উচিত।",
        ),
        services: [
            L("Urology consultations", "ইউরোলজি পরামর্শ"),
            L("Kidney and ureteric stone treatment", "কিডনি ও মূত্রনালির পাথরের চিকিৎসা"),
            L("Prostate care", "প্রোস্টেটের চিকিৎসা"),
            L("Endo-urology and laparoscopic urology", "এন্ডো-ইউরোলজি ও ল্যাপারোস্কোপিক ইউরোলজি"),
            L("Uro-oncology", "ইউরো-অনকোলজি"),
            L("Andrology (men's health)", "অ্যান্ড্রোলজি (পুরুষের স্বাস্থ্য)"),
        ],
        conditions: [
            L("Kidney stones", "কিডনিতে পাথর"),
            L("Enlarged prostate", "প্রোস্টেট বড় হওয়া"),
            L("Blood in urine", "প্রস্রাবে রক্ত"),
            L("Urinary infections", "প্রস্রাবের সংক্রমণ"),
            L("Difficulty passing urine", "প্রস্রাবে কষ্ট"),
        ],
    },
    "chest-medicine": {
        description: L(
            "A cough that won't go away, wheezing, breathlessness or a worrying chest X-ray — our chest physicians, including former faculty of the National Institute of Diseases of the Chest & Hospital (NIDCH), diagnose and treat lung conditions and long-term breathing problems.\n\nThey also advise on inhaler technique, which makes a real difference to asthma and COPD control.",
            "না সারা কাশি, শ্বাসে শোঁ শোঁ শব্দ, শ্বাসকষ্ট বা চিন্তার মতো বুকের এক্স-রে — জাতীয় বক্ষব্যাধি ইনস্টিটিউটের (এনআইডিসিএইচ) সাবেক শিক্ষকসহ আমাদের বক্ষব্যাধি বিশেষজ্ঞরা ফুসফুসের রোগ ও দীর্ঘমেয়াদি শ্বাসকষ্টের চিকিৎসা করেন।\n\nইনহেলার ব্যবহারের সঠিক নিয়মও তারা শেখান — অ্যাজমা ও সিওপিডি নিয়ন্ত্রণে যা সত্যিই বড় পার্থক্য আনে।",
        ),
        services: [
            L("Chest and lung consultations", "বক্ষব্যাধি ও ফুসফুস পরামর্শ"),
            L("Asthma and COPD management", "অ্যাজমা ও সিওপিডি চিকিৎসা"),
            L("Tuberculosis diagnosis and treatment", "যক্ষ্মা নির্ণয় ও চিকিৎসা"),
            L("Allergy advice", "অ্যালার্জি পরামর্শ"),
            L("Inhaler technique training", "ইনহেলার ব্যবহারের প্রশিক্ষণ"),
        ],
        conditions: [
            L("Asthma", "অ্যাজমা"),
            L("COPD", "সিওপিডি"),
            L("Chronic cough", "দীর্ঘমেয়াদি কাশি"),
            L("Tuberculosis", "যক্ষ্মা"),
            L("Pneumonia", "নিউমোনিয়া"),
            L("Allergic rhinitis", "অ্যালার্জিক রাইনাইটিস"),
        ],
    },
    "nutrition-diet": {
        description: L(
            "What you eat affects blood sugar, blood pressure, weight, pregnancy and recovery from illness. Our nutritionists and dietitians build plans around the food your family already cooks, so changes are realistic and last.",
            "আপনি কী খান তা রক্তে সুগার, রক্তচাপ, ওজন, গর্ভাবস্থা ও অসুস্থতা থেকে সেরে ওঠায় প্রভাব ফেলে। আমাদের পুষ্টিবিদ ও ডায়েটিশিয়ানরা আপনার পরিবারে যা রান্না হয় তা ঘিরেই পরিকল্পনা করেন, যাতে পরিবর্তনগুলো বাস্তবসম্মত ও টেকসই হয়।",
        ),
        services: [
            L(
                "Diet plans for diabetes and blood pressure",
                "ডায়াবেটিস ও রক্তচাপের ডায়েট প্ল্যান",
            ),
            L("Weight management", "ওজন নিয়ন্ত্রণ"),
            L("Pregnancy and breastfeeding nutrition", "গর্ভাবস্থা ও স্তন্যদানকালীন পুষ্টি"),
            L("Child nutrition", "শিশুর পুষ্টি"),
            L("Diet for kidney and liver disease", "কিডনি ও লিভার রোগের ডায়েট"),
        ],
        conditions: [
            L("Overweight and obesity", "অতিরিক্ত ওজন ও স্থূলতা"),
            L("Diabetes", "ডায়াবেটিস"),
            L("High cholesterol", "উচ্চ কোলেস্টেরল"),
            L("Underweight", "কম ওজন"),
        ],
    },
};
