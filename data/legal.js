// Mock `pages` documents for legal content (editable from admin → Content).
// Written by STR Solutions as a working draft — the hospital must review before launch.
const stamp = "2026-10-20T00:00:00.000Z";

const s = (id, en, bn, bodyEn, bodyBn) => ({
    id,
    heading: { en, bn },
    body: { en: bodyEn, bn: bodyBn },
});

export const legalPages = [
    {
        _id: "page_terms",
        slug: "terms",
        title: { en: "Terms of use", bn: "ব্যবহারের শর্তাবলি" },
        summary: {
            en: "The rules for using monowarahospital.com, booking through it, and relying on what it says.",
            bn: "monowarahospital.com ব্যবহার, এর মাধ্যমে বুকিং এবং এর তথ্যের ওপর নির্ভর করার নিয়মাবলি।",
        },
        sections: [
            s(
                "about",
                "About this website",
                "এই ওয়েবসাইট সম্পর্কে",
                [
                    "This website is run by Monowara Hospital (Pvt.) Ltd., 54 Siddeshwari Road, Ramna, Dhaka-1217 (“the hospital”, “we”). By using it you agree to these terms. If you do not agree, please do not use the website.",
                ],
                [
                    "এই ওয়েবসাইটটি পরিচালনা করে মনোয়ারা হসপিটাল (প্রা.) লি., ৫৪ সিদ্ধেশ্বরী রোড, রমনা, ঢাকা-১২১৭ (“হাসপাতাল“, “আমরা“)। ওয়েবসাইট ব্যবহার করলে আপনি এই শর্তাবলিতে সম্মত হচ্ছেন। সম্মত না হলে অনুগ্রহ করে ওয়েবসাইটটি ব্যবহার করবেন না।",
                ],
            ),
            s(
                "not-medical-advice",
                "Not medical advice",
                "এটি চিকিৎসা পরামর্শ নয়",
                [
                    "Health information, articles and videos on this website are general and for education only. They are not a diagnosis and do not replace a consultation with a qualified doctor.",
                    "In a medical emergency, call our emergency line or come to the emergency unit straight away — do not wait for a reply online or on WhatsApp.",
                ],
                [
                    "ওয়েবসাইটের স্বাস্থ্য তথ্য, লেখা ও ভিডিও সাধারণ শিক্ষামূলক উদ্দেশ্যে দেওয়া। এগুলো রোগ নির্ণয় নয় এবং যোগ্য ডাক্তারের পরামর্শের বিকল্প নয়।",
                    "জরুরি অবস্থায় সরাসরি আমাদের জরুরি নম্বরে কল করুন বা জরুরি বিভাগে চলে আসুন — অনলাইন বা হোয়াটসঅ্যাপে উত্তরের অপেক্ষা করবেন না।",
                ],
            ),
            s(
                "appointments",
                "Appointments and doctor schedules",
                "অ্যাপয়েন্টমেন্ট ও ডাক্তারের সময়সূচি",
                [
                    "A call, WhatsApp message or form sent through this website is a request. Your appointment is confirmed only when our front desk gives you a serial.",
                    "Chamber days and times are shown in good faith and can change at short notice — for example when a doctor is on leave. We will try to tell you as early as we can.",
                ],
                [
                    "ওয়েবসাইটের মাধ্যমে করা কল, হোয়াটসঅ্যাপ মেসেজ বা ফর্ম একটি অনুরোধ মাত্র। ফ্রন্ট ডেস্ক সিরিয়াল দিলে তবেই অ্যাপয়েন্টমেন্ট নিশ্চিত হয়।",
                    "চেম্বারের দিন ও সময় সরল বিশ্বাসে দেওয়া এবং স্বল্প নোটিশে পরিবর্তন হতে পারে — যেমন ডাক্তার ছুটিতে থাকলে। আমরা যত দ্রুত সম্ভব জানানোর চেষ্টা করব।",
                ],
            ),
            s(
                "prices",
                "Packages and prices",
                "প্যাকেজ ও মূল্য",
                [
                    "Prices are not published on this website; our desk gives the current price on the phone. A package covers what is listed when you are admitted. If your clinical needs change, the final bill may change, and we will explain why.",
                ],
                [
                    "ওয়েবসাইটে মূল্য প্রকাশ করা হয় না; ফোনে আমাদের ডেস্ক সর্বশেষ মূল্য জানায়। ভর্তির সময় যা উল্লেখ করা হয় প্যাকেজে তা-ই অন্তর্ভুক্ত। চিকিৎসার প্রয়োজন বদলালে চূড়ান্ত বিল বদলাতে পারে, এবং আমরা কারণ ব্যাখ্যা করব।",
                ],
            ),
            s(
                "use",
                "Using the website",
                "ওয়েবসাইট ব্যবহার",
                [
                    "Please give accurate details in any form, and do not misuse the website — for example by trying to break its security, overload it, or copy large parts of it automatically.",
                ],
                [
                    "যেকোনো ফর্মে সঠিক তথ্য দিন এবং ওয়েবসাইটের অপব্যবহার করবেন না — যেমন নিরাপত্তা ভাঙার চেষ্টা, অতিরিক্ত চাপ সৃষ্টি বা স্বয়ংক্রিয়ভাবে বড় অংশ কপি করা।",
                ],
            ),
            s(
                "content",
                "Our content",
                "আমাদের কনটেন্ট",
                [
                    "Text, photographs, logos and videos on this website belong to the hospital or are used with permission. Please ask us before reusing them.",
                ],
                [
                    "এই ওয়েবসাইটের লেখা, ছবি, লোগো ও ভিডিও হাসপাতালের নিজস্ব অথবা অনুমতি নিয়ে ব্যবহৃত। পুনরায় ব্যবহারের আগে অনুগ্রহ করে আমাদের অনুমতি নিন।",
                ],
            ),
            s(
                "third-parties",
                "Other services",
                "অন্যান্য সেবা",
                [
                    "WhatsApp, YouTube and Google Maps open under their own terms and privacy policies. We are not responsible for those services.",
                ],
                [
                    "হোয়াটসঅ্যাপ, ইউটিউব ও গুগল ম্যাপ তাদের নিজস্ব শর্ত ও গোপনীয়তা নীতির অধীনে চলে। ওই সেবাগুলোর জন্য আমরা দায়ী নই।",
                ],
            ),
            s(
                "liability",
                "Accuracy and liability",
                "তথ্যের নির্ভুলতা ও দায়",
                [
                    "We work to keep this website accurate and available, but we cannot promise it will always be error-free. To the extent the law allows, we are not liable for loss caused by relying only on the website instead of speaking to our staff.",
                ],
                [
                    "আমরা ওয়েবসাইটটি নির্ভুল ও সচল রাখার চেষ্টা করি, তবে এটি সবসময় ত্রুটিমুক্ত থাকবে এমন নিশ্চয়তা দিতে পারি না। আইনের অনুমোদিত সীমা পর্যন্ত, আমাদের কর্মীদের সাথে কথা না বলে শুধু ওয়েবসাইটের ওপর নির্ভর করে হওয়া ক্ষতির দায় আমরা নেব না।",
                ],
            ),
            s(
                "law",
                "Changes and governing law",
                "পরিবর্তন ও প্রযোজ্য আইন",
                [
                    "We may update these terms; the date at the top shows the latest version. These terms are governed by the laws of Bangladesh.",
                ],
                [
                    "আমরা এই শর্তাবলি হালনাগাদ করতে পারি; ওপরের তারিখটি সর্বশেষ সংস্করণ নির্দেশ করে। এই শর্তাবলি বাংলাদেশের আইন দ্বারা পরিচালিত।",
                ],
            ),
        ],
    },
    {
        _id: "page_privacy",
        slug: "privacy-policy",
        title: { en: "Privacy policy", bn: "গোপনীয়তা নীতি" },
        summary: {
            en: "What information the website collects, why, and how the hospital looks after it.",
            bn: "ওয়েবসাইট কী তথ্য সংগ্রহ করে, কেন করে এবং হাসপাতাল কীভাবে তা সুরক্ষিত রাখে।",
        },
        sections: [
            s(
                "collect",
                "What we collect",
                "আমরা যা সংগ্রহ করি",
                [
                    "Details you choose to send us: your name, phone number, the doctor or department you ask about, your message and — for job applications — your CV.",
                    "Basic technical information such as browser type and the pages visited, used to keep the website working and to understand which pages help patients.",
                ],
                [
                    "আপনি নিজে যা পাঠান: নাম, ফোন নম্বর, যে ডাক্তার বা বিভাগ সম্পর্কে জানতে চান, আপনার বার্তা এবং — চাকরির আবেদনের ক্ষেত্রে — আপনার সিভি।",
                    "ব্রাউজারের ধরন ও দেখা পেজের মতো প্রাথমিক কারিগরি তথ্য, যা ওয়েবসাইট সচল রাখতে এবং কোন পেজ রোগীদের কাজে আসে তা বুঝতে ব্যবহৃত হয়।",
                ],
            ),
            s(
                "use",
                "How we use it",
                "যেভাবে ব্যবহার করি",
                [
                    "To reply to you, arrange appointments, process job applications and improve the website. We do not sell your information.",
                ],
                [
                    "আপনাকে উত্তর দিতে, অ্যাপয়েন্টমেন্ট ঠিক করতে, চাকরির আবেদন বিবেচনা করতে এবং ওয়েবসাইট উন্নত করতে। আমরা আপনার তথ্য বিক্রি করি না।",
                ],
            ),
            s(
                "whatsapp",
                "WhatsApp and phone calls",
                "হোয়াটসঅ্যাপ ও ফোন কল",
                [
                    "When you message us on WhatsApp, the conversation also passes through WhatsApp's service and its privacy policy applies. Please do not send detailed medical records over chat unless our staff ask for them.",
                ],
                [
                    "হোয়াটসঅ্যাপে মেসেজ দিলে কথোপকথন হোয়াটসঅ্যাপের সার্ভিসের মাধ্যমেও যায় এবং তাদের গোপনীয়তা নীতি প্রযোজ্য হয়। কর্মীরা না চাইলে চ্যাটে বিস্তারিত মেডিকেল রেকর্ড পাঠাবেন না।",
                ],
            ),
            s(
                "sharing",
                "Who can see it",
                "কারা দেখতে পারেন",
                [
                    "Only hospital staff who need it to help you, and service providers that run the website or email for us under confidentiality. We share information with authorities only when the law requires it.",
                ],
                [
                    "শুধু হাসপাতালের যেসব কর্মীর আপনাকে সাহায্য করতে প্রয়োজন, এবং গোপনীয়তার শর্তে যারা আমাদের ওয়েবসাইট বা ইমেইল পরিচালনা করে। আইন বাধ্য করলে তবেই কর্তৃপক্ষের সাথে তথ্য শেয়ার করা হয়।",
                ],
            ),
            s(
                "security",
                "Keeping it safe",
                "তথ্যের নিরাপত্তা",
                [
                    "The website uses encrypted connections (HTTPS). Staff access to messages and bookings is limited by role and every change is logged.",
                ],
                [
                    "ওয়েবসাইটে এনক্রিপ্টেড সংযোগ (HTTPS) ব্যবহার করা হয়। বার্তা ও বুকিং দেখার অনুমতি দায়িত্ব অনুযায়ী সীমিত এবং প্রতিটি পরিবর্তন লগ করা হয়।",
                ],
            ),
            s(
                "storage",
                "Cookies and storage",
                "কুকি ও স্টোরেজ",
                [
                    "The website stores a small note in your browser for the current session so the welcome animation plays only once. If we add analytics, this page will say so.",
                ],
                [
                    "স্বাগত অ্যানিমেশন যেন একবারই দেখায়, সেজন্য ওয়েবসাইট চলতি সেশনের জন্য আপনার ব্রাউজারে ছোট একটি নোট রাখে। অ্যানালিটিক্স যুক্ত করলে এই পেজে তা জানানো হবে।",
                ],
            ),
            s(
                "rights",
                "Your choices",
                "আপনার অধিকার",
                [
                    "You can ask to see, correct or delete the details you sent through the website by contacting us. Some records may need to be kept where the law requires.",
                ],
                [
                    "ওয়েবসাইটের মাধ্যমে পাঠানো তথ্য দেখতে, সংশোধন বা মুছে ফেলতে আমাদের সাথে যোগাযোগ করুন। আইনের প্রয়োজনে কিছু রেকর্ড সংরক্ষণ করতে হতে পারে।",
                ],
            ),
        ],
    },
    {
        _id: "page_patient_rights",
        slug: "patient-rights",
        title: { en: "Patient rights & responsibilities", bn: "রোগীর অধিকার ও দায়িত্ব" },
        summary: {
            en: "What every patient at Monowara Hospital can expect from us — and what we ask in return.",
            bn: "মনোয়ারা হসপিটালে প্রতিটি রোগী আমাদের কাছে যা আশা করতে পারেন — এবং আমরা যা অনুরোধ করি।",
        },
        sections: [
            s(
                "respect",
                "Respectful care",
                "সম্মানজনক সেবা",
                [
                    "To be treated with dignity and courtesy, without discrimination, and to have your privacy respected during examinations and treatment.",
                ],
                [
                    "মর্যাদা ও সৌজন্যের সাথে, কোনো বৈষম্য ছাড়া সেবা পাওয়া এবং পরীক্ষা ও চিকিৎসার সময় গোপনীয়তা রক্ষা।",
                ],
            ),
            s(
                "information",
                "Clear information",
                "স্পষ্ট তথ্য",
                [
                    "To know the name of the doctor responsible for your care, and to have your condition, treatment options and likely results explained in a language you understand.",
                ],
                [
                    "আপনার চিকিৎসার দায়িত্বে থাকা ডাক্তারের নাম জানা এবং আপনার অবস্থা, চিকিৎসার বিকল্প ও সম্ভাব্য ফলাফল বোধগম্য ভাষায় জানা।",
                ],
            ),
            s(
                "consent",
                "Consent",
                "সম্মতি",
                [
                    "To give or refuse consent before a procedure or operation, after its benefits and risks have been explained, and to ask for a second opinion.",
                ],
                [
                    "কোনো প্রসিডিউর বা অপারেশনের আগে এর সুবিধা ও ঝুঁকি জেনে সম্মতি দেওয়া বা না দেওয়া এবং দ্বিতীয় মতামত চাওয়া।",
                ],
            ),
            s(
                "confidentiality",
                "Confidentiality",
                "গোপনীয়তা",
                [
                    "Your medical records are confidential and are shared only with the people caring for you, or as the law requires.",
                ],
                [
                    "আপনার মেডিকেল রেকর্ড গোপনীয়; শুধু আপনার চিকিৎসায় যুক্ত ব্যক্তিরা অথবা আইনের প্রয়োজনে তা দেখতে পারেন।",
                ],
            ),
            s(
                "costs",
                "Costs",
                "খরচ",
                [
                    "To be told the expected cost before planned treatment, and to receive an itemised bill.",
                ],
                ["পরিকল্পিত চিকিৎসার আগে সম্ভাব্য খরচ জানা এবং বিস্তারিত বিল পাওয়া।"],
            ),
            s(
                "emergency",
                "Emergency care",
                "জরুরি সেবা",
                ["To receive emergency assessment and stabilising care, at any hour."],
                ["যেকোনো সময় জরুরি মূল্যায়ন ও প্রাথমিক স্থিতিশীল করার চিকিৎসা পাওয়া।"],
            ),
            s(
                "complaints",
                "Feedback and complaints",
                "মতামত ও অভিযোগ",
                [
                    "To raise a concern without it affecting your care. Tell our reception staff or contact us using the details below.",
                ],
                [
                    "চিকিৎসায় কোনো প্রভাব ছাড়াই অভিযোগ জানানো। রিসেপশনে আমাদের কর্মীদের জানান বা নিচের মাধ্যমে যোগাযোগ করুন।",
                ],
            ),
            s(
                "responsibilities",
                "Your responsibilities",
                "আপনার দায়িত্ব",
                [
                    "Give complete and accurate information about your health, and bring previous prescriptions and reports.",
                    "Follow the care plan you agreed to, or tell your doctor if you decide not to.",
                    "Respect staff, other patients and the hospital's visiting rules, and settle bills as agreed.",
                ],
                [
                    "আপনার স্বাস্থ্য সম্পর্কে পূর্ণ ও সঠিক তথ্য দিন এবং আগের প্রেসক্রিপশন ও রিপোর্ট সাথে আনুন।",
                    "সম্মত চিকিৎসা পরিকল্পনা মেনে চলুন, অথবা না মানতে চাইলে ডাক্তারকে জানান।",
                    "কর্মী, অন্য রোগী ও হাসপাতালের দর্শনার্থী নিয়মের প্রতি সম্মান দেখান এবং সম্মত অনুযায়ী বিল পরিশোধ করুন।",
                ],
            ),
        ],
    },
].map((p) => ({ ...p, isDraft: true, isActive: true, createdAt: stamp, updatedAt: stamp }));
