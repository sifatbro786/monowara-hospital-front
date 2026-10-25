#!/usr/bin/env node
// Download the placeholder stock photos listed in data/media.js and data/hero.js (source.type "unsplash")
// into public/uploads/media/ — run locally (the build sandbox can't reach Unsplash):
//   node --no-warnings scripts/fetch-stock-images.mjs           # skip files that exist
//   node --no-warnings scripts/fetch-stock-images.mjs --force   # re-download all
// Saved as WebP, max 2000px wide, q72 (header bands sit under a teal wash, so this is plenty).
// Unsplash licence: free to use, no permission needed; credit kept in data/media.js `source.url`.
// Replace with the hospital's own photos later via Admin → Media management.
import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FORCE = process.argv.includes("--force");
const { media } = await import(new URL("../data/media.js", import.meta.url));
const { heroSlides } = await import(new URL("../data/hero.js", import.meta.url));

let sharp = null;
try {
    sharp = (await import("sharp")).default;
} catch {
    console.warn("sharp not available — saving the original JPEGs.");
}
const exists = (p) =>
    access(p).then(
        () => true,
        () => false,
    );

// media slots + hero slider photos (data/hero.js `image.source`)
const heroImages = heroSlides.map((s) => ({ key: `hero.${s.slug}`, ...s.image }));
const jobs = [...media, ...heroImages].filter(
    (m) => m.source?.type === "unsplash" && m.source.download,
);
let ok = 0,
    skip = 0;
const failed = [];
for (const m of jobs) {
    const out = join(ROOT, "public", m.src);
    if (!FORCE && (await exists(out))) {
        skip++;
        continue;
    }
    try {
        const res = await fetch(m.source.download);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        let buf = Buffer.from(await res.arrayBuffer());
        if (sharp)
            buf = await sharp(buf)
                .rotate()
                .resize({ width: 2000, withoutEnlargement: true })
                .webp({ quality: 72 })
                .toBuffer();
        await mkdir(dirname(out), { recursive: true });
        await writeFile(out, buf);
        ok++;
        console.log("✓", m.key, "→", m.src);
    } catch (e) {
        failed.push(`${m.key}  ${m.source.download}  (${e.message})`);
        console.error("✗", m.key, e.message);
    }
}
console.log(`\nDone: ${ok} downloaded, ${skip} already there, ${failed.length} failed.`);
if (failed.length) process.exitCode = 1;
