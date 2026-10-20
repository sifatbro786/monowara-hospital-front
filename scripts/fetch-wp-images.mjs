#!/usr/bin/env node
// Phase 2 — download the old site's photos into public/uploads/ (run once, locally):
//   node scripts/fetch-wp-images.mjs            # skip files that already exist
//   node scripts/fetch-wp-images.mjs --force    # re-download everything
// Doctor portraits are centre-cropped to 4:5 at 600×750 and saved as WebP (q82) with sharp
// (already installed as a Next.js dependency). Smaller sources are never upscaled.
// Other images keep their aspect ratio, max 1200px wide. If sharp can't load, the original
// bytes are saved as-is (still served fine; re-run later to optimise).
// Failures are listed at the end and written to scripts/fetch-wp-images.log — nothing aborts.
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const FORCE = process.argv.includes("--force");
const CONCURRENCY = 4;

/** [{ src: old URL, dest: path under public/, replace? }] — generated from data/*.js in Phase 2 */
const MANIFEST = [
    // Homepage doctors: the copies in public/ were the old site's 230×230 thumbnails → replace with
    // the full-size originals (`replace: true` re-downloads even if the file exists).
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Nasima-Begum.webp",
        dest: "/uploads/doctors/dr-nasima-begum.webp",
        replace: true,
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Amiruzzaman-Khan.webp",
        dest: "/uploads/doctors/dr-amiruzzaman-khan.webp",
        replace: true,
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Debashish-Saha-1.webp",
        dest: "/uploads/doctors/dr-debashish-saha.webp",
        replace: true,
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-ISHRAT-JABEEN.webp",
        dest: "/uploads/doctors/dr-ishrat-jabeen.webp",
        replace: true,
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Mohammad-Hanif.webp",
        dest: "/uploads/doctors/dr-mohammad-hanif.webp",
        replace: true,
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Roys-Uddin.webp",
        dest: "/uploads/doctors/dr-royes-uddin.webp",
        replace: true,
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/02/Khaleada-Akter.webp",
        dest: "/uploads/doctors/dr-khaleda-akter-bhuiyan.webp",
        replace: true,
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/Dr.-Mahfuza-Asma.webp",
        dest: "/uploads/doctors/dr-mahfuja-asma.webp",
        replace: true,
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Noor-E-Ferdous-Nimmi.webp",
        dest: "/uploads/doctors/dr-noor-e-ferdous-nimmi.webp",
        replace: true,
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-28-at-17.55.44_0bf60348.jpg",
        dest: "/uploads/aesthetic/skin-analyzer.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/Hydra-fecial-img.webp",
        dest: "/uploads/aesthetic/hydrafacial.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/Laser-img-1.webp",
        dest: "/uploads/aesthetic/laser.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/prp-img-1.webp",
        dest: "/uploads/aesthetic/prp.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/filler-jpg.webp",
        dest: "/uploads/aesthetic/fillers.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/Glutahine-img.webp",
        dest: "/uploads/aesthetic/glutathione.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/breast-treatment-img.webp",
        dest: "/uploads/aesthetic/breast-treatment.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/plustic-surgery.webp",
        dest: "/uploads/aesthetic/plastic-burn-surgery.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Prof.-Dr.-Nasrin-Akhter.webp",
        dest: "/uploads/doctors/dr-nasrin-akhter.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/04/Professor-Dr.-Roshan-Ara-Begum.webp",
        dest: "/uploads/doctors/dr-rowshan-ara-begum.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/04/Professor-Dr.-Anwara-Begum.webp",
        dest: "/uploads/doctors/dr-anwara-begum.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Mehrose-Alam-Chowdhury.webp",
        dest: "/uploads/doctors/dr-mehrose-alam-chowdhury.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Shamsun-Nahar-Moni.webp",
        dest: "/uploads/doctors/dr-shamsun-nahar-moni.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/Arifa-Sharmin.webp",
        dest: "/uploads/doctors/dr-arifa-sharmin.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/Dina-Layla-Hossain.webp",
        dest: "/uploads/doctors/dr-dina-layla-hossain.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/Tajmira-Sultana.webp",
        dest: "/uploads/doctors/dr-tajmira-sultana.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/Sanjida-Mahmud.webp",
        dest: "/uploads/doctors/dr-sanjida-mahmud.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/Raunak-Jahan.webp",
        dest: "/uploads/doctors/dr-raunak-jahan.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/Rajshree-Debnath.webp",
        dest: "/uploads/doctors/dr-rajshree-debnath.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Prof.-Dr.-Mustafizur-Rahman-1.webp",
        dest: "/uploads/doctors/dr-md-mustafizur-rahman.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Professor-Syed-Mahbubul-Alam.webp",
        dest: "/uploads/doctors/dr-syed-mahbubul-alam.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Prof.-Dr.-Laila-Shireen.webp",
        dest: "/uploads/doctors/dr-laila-shireen.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Sadia-Armin-Khan.webp",
        dest: "/uploads/doctors/dr-sadia-armin-khan.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Munni-Mumtaz.webp",
        dest: "/uploads/doctors/dr-munny-momotaz.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Masroor-ur-Rahman-Abir.webp",
        dest: "/uploads/doctors/dr-masroor-ur-rahman-abir.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Sajol-Krisno-Benarji.webp",
        dest: "/uploads/doctors/dr-sajal-krisno-banerjee.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Assoc.-Prof.-Dr.-Sakhawat-Alam.webp",
        dest: "/uploads/doctors/dr-shakhawat-alam.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/PROF.-S.-K.-BANIK.webp",
        dest: "/uploads/doctors/dr-gobinda-chandra-banik.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-P.K.-Datta-Ponkaj.webp",
        dest: "/uploads/doctors/dr-pk-datta-ponkaj.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Prof.-Dr.-Moniruzzaman-Ahmed.webp",
        dest: "/uploads/doctors/dr-moniruzzaman-ahmed.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/kashem-dr.webp",
        dest: "/uploads/doctors/dr-abul-kashem-khandaker.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2026/04/bk.jpg",
        dest: "/uploads/doctors/dr-bk-biswas.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Sharmin-Afroz.webp",
        dest: "/uploads/doctors/dr-sharmin-afroz.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Sultana-Rehana-Akther.webp",
        dest: "/uploads/doctors/dr-sultana-rehana-akhtar.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Chinmoy-Saha.webp",
        dest: "/uploads/doctors/dr-chinmoy-saha.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2026/05/AFANOOR.jpg",
        dest: "/uploads/doctors/dr-afanur-rahman-adnan.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Mohammad-Fakhrul-Islam.webp",
        dest: "/uploads/doctors/dr-md-fakhrul-islam.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Professor-Syed-Hasan-Imam-Al-Masoom.webp",
        dest: "/uploads/doctors/dr-syed-hasan-imam-al-masoom.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Professor-Dr.-A.-K.-M.-Ishaq-.webp",
        dest: "/uploads/doctors/dr-akm-ishaq.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Prof.-Dr.-Dulal-Chandra-Datta.webp",
        dest: "/uploads/doctors/dr-dulal-chandra-datta.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2026/05/kamruzzaman-noyon.jpg",
        dest: "/uploads/doctors/dr-md-kamruzzaman-nayan.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/PROF.-DR.-M.M.-ABU-SAYED-MONTU.webp",
        dest: "/uploads/doctors/dr-mm-abu-sayed-montu.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Prof.-Dr.-Swapan-Kumar-Bandyopadhyaa.webp",
        dest: "/uploads/doctors/dr-swapan-bandyopadhyay.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2025/04/Dr.-Arif-Oncologist.png",
        dest: "/uploads/doctors/dr-md-arif-hossain.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Md.-Nahid-Hossain.webp",
        dest: "/uploads/doctors/dr-md-nahid-hossain.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Tanvir-Ahmed-Chowdhury.webp",
        dest: "/uploads/doctors/dr-tanvir-ahmed-chowdhury.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/02/Farukh-Hossain.webp",
        dest: "/uploads/doctors/dr-md-faruk-hossain-sheikh.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Munshi-Akid-Mostofa.webp",
        dest: "/uploads/doctors/dr-munshi-akid-mostofa.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Sadia-Binte-Momen-1.webp",
        dest: "/uploads/doctors/dr-sadia-binte-momen.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/S-K-Banik.webp",
        dest: "/uploads/doctors/dr-sk-banik.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/PROF.-DR.-L.-E.-FATMI.webp",
        dest: "/uploads/doctors/dr-le-fatmi.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Professor-Md.-Abid-Hossain-Mollah.webp",
        dest: "/uploads/doctors/dr-abid-hossain-mollah.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Prof.-Dr.-Afroza-Begum.webp",
        dest: "/uploads/doctors/dr-afroza-begum.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Prof.-Tahmina-Begum.webp",
        dest: "/uploads/doctors/dr-tahmina-begum.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Lillian-Catherine-Gomez.webp",
        dest: "/uploads/doctors/dr-lillian-catherine-gomez.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Nazmul-Hasan-1.webp",
        dest: "/uploads/doctors/nazmul-hasan-pt.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/Dr.-Ummy-Salma-Munni.webp",
        dest: "/uploads/doctors/dr-umme-salma-munni.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/Humaira-Nabi-Nutritionist.webp",
        dest: "/uploads/doctors/humayra-nabi.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/A-K-M-Rezaul-Karim-Dermatology-e1778767172613.webp",
        dest: "/uploads/doctors/dr-akm-rezaul-karim.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/09/Dr-Sathi-5-2.webp",
        dest: "/uploads/doctors/dr-farzana-rahman-shathi.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/drrr.webp",
        dest: "/uploads/doctors/dr-ahmed-ali.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/08/dr-mehzaben.webp",
        dest: "/uploads/doctors/dr-mehzabeen.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/1.webp",
        dest: "/uploads/departments/gynaecology-obstetrics.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/5.webp",
        dest: "/uploads/departments/general-laparoscopic-surgery.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/15.webp",
        dest: "/uploads/departments/cardiology.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/18.webp",
        dest: "/uploads/departments/dermatology-venereology.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/3-medi.webp",
        dest: "/uploads/departments/medicine.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/4.webp",
        dest: "/uploads/departments/paediatrics-neonatology.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/17-cancer.webp",
        dest: "/uploads/departments/oncology.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/7-dia.webp",
        dest: "/uploads/departments/diabetes-endocrinology.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/10-ges.webp",
        dest: "/uploads/departments/gastroenterology-liver.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/21-Hematology-Specialist.webp",
        dest: "/uploads/departments/haematology.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/11-kidy.webp",
        dest: "/uploads/departments/nephrology.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/9.webp",
        dest: "/uploads/departments/neurology.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/14-nose.webp",
        dest: "/uploads/departments/ent.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/8-ortho.webp",
        dest: "/uploads/departments/orthopaedics.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/16-p.webp",
        dest: "/uploads/departments/paediatric-cardiology.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/13-phy.webp",
        dest: "/uploads/departments/physical-medicine.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/20-ph.webp",
        dest: "/uploads/departments/physiotherapy.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/6-plastic.webp",
        dest: "/uploads/departments/plastic-surgery.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/12.webp",
        dest: "/uploads/departments/thoracic-surgery.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/2-Urology-Specialist.webp",
        dest: "/uploads/departments/urology.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/07/19.webp",
        dest: "/uploads/departments/nutrition-diet.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/02/24-emergency.webp",
        dest: "/uploads/facilities/emergency.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/02/icu.webp",
        dest: "/uploads/facilities/icu.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/02/Pharmecy.webp",
        dest: "/uploads/facilities/pharmacy.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/02/blood-bank.webp",
        dest: "/uploads/facilities/blood-bank.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/02/Dr.-Chember.webp",
        dest: "/uploads/facilities/opd-chambers.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2018/11/24-receiption-copy.webp",
        dest: "/uploads/facilities/reception.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/02/ecg.webp",
        dest: "/uploads/facilities/ecg.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/02/holter-moni.webp",
        dest: "/uploads/facilities/holter.webp",
    },
    {
        src: "https://monowarahospital.com/wp-content/uploads/2024/02/colonos.webp",
        dest: "/uploads/facilities/colonoscopy.webp",
    },
];

let sharp = null;
try {
    sharp = (await import("sharp")).default;
} catch {
    console.warn("sharp not available — saving original files without resizing.");
}

const exists = (p) =>
    access(p).then(
        () => true,
        () => false,
    );

async function one({ src, dest, replace }) {
    const out = join(ROOT, dest);
    if (!FORCE && !replace && (await exists(out))) return "skip";
    const res = await fetch(src, { headers: { "User-Agent": "mh-migration/1.0" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const input = Buffer.from(await res.arrayBuffer());
    let buf = input;
    if (sharp) {
        const img = sharp(input, { failOn: "none" }).rotate();
        buf = dest.startsWith("/uploads/doctors/")
            ? await img
                  .resize(600, 750, {
                      fit: "cover",
                      position: "north",
                      withoutEnlargement: true,
                  })
                  .webp({ quality: 82 })
                  .toBuffer()
            : await img
                  .resize({ width: 1200, withoutEnlargement: true })
                  .webp({ quality: 80 })
                  .toBuffer();
    }
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, buf);
    return "ok";
}

const queue = [...MANIFEST];
const tally = { ok: 0, skip: 0 };
const failed = [];
await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
        for (let job; (job = queue.shift()); ) {
            try {
                const r = await one(job);
                tally[r]++;
                if (r === "ok") console.log("✓", job.dest);
            } catch (e) {
                failed.push(`${job.dest}  ←  ${job.src}  (${e.message})`);
                console.error("✗", job.dest, e.message);
            }
        }
    }),
);

console.log(
    `\nDone: ${tally.ok} downloaded, ${tally.skip} already there, ${failed.length} failed.`,
);
if (failed.length) {
    await writeFile(join(ROOT, "..", "scripts", "fetch-wp-images.log"), failed.join("\n") + "\n");
    console.log("Failures written to scripts/fetch-wp-images.log");
    process.exitCode = 1;
}
