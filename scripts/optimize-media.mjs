#!/usr/bin/env node
// Re-encode page-header photos in public/uploads/media/ to a sane web size (run after adding photos):
//   node --no-warnings scripts/optimize-media.mjs            # dry run: prints what would change
//   node --no-warnings scripts/optimize-media.mjs --write    # overwrite in place
// Header bands are wide (≈3.6:1 desktop, ≈1:1 mobile) and next/image resizes per device anyway,
// so the source only needs to be ≤1920px wide. Portrait sources are cropped to 3:2 around the
// slot's focal point (`position` in data/media.js) — a 2000×3000 photo is wasted bytes in a band.
// Same rules the B1 upload pipeline (multer + sharp) should apply on the server.
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { media } from "../data/media.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const DIR = join(ROOT, "uploads", "media");
const WRITE = process.argv.includes("--write");
const MAX_W = 1920;
const QUALITY = 72;

/** "70% 20%" | "75% center" | "center" → { x: 0..1, y: 0..1 } */
function focal(position = "center") {
    const word = { left: 0, top: 0, center: 0.5, right: 1, bottom: 1 };
    const [a = "center", b = "center"] = position.trim().split(/\s+/);
    const v = (s) => (s.endsWith("%") ? parseFloat(s) / 100 : (word[s] ?? 0.5));
    return { x: v(a), y: v(b) };
}

const bySrc = new Map(media.map((m) => [m.src, m]));
let saved = 0;

for (const file of (await readdir(DIR)).filter((f) => /\.(webp|jpe?g|png)$/i.test(f))) {
    const path = join(DIR, file);
    const input = await readFile(path);
    const meta = await sharp(input).metadata();
    const slot = bySrc.get(`/uploads/media/${file}`);
    const { x, y } = focal(slot?.position);

    let img = sharp(input).rotate();
    let w = meta.width;
    let h = meta.height;
    if (h / w > 2 / 3 + 0.01) {
        // taller than 3:2 → crop height around the focal point
        const ch = Math.round((w * 2) / 3);
        const top = Math.min(Math.max(Math.round(y * h - ch / 2), 0), h - ch);
        img = img.extract({ left: 0, top, width: w, height: ch });
        h = ch;
    }
    if (w > MAX_W) img = img.resize({ width: MAX_W });
    const out = await img.webp({ quality: QUALITY }).toBuffer();
    const before = (await stat(path)).size;

    if (out.length >= before * 0.9) {
        console.log(`  keep  ${file}  ${Math.round(before / 1024)} KB`);
        continue;
    }
    saved += before - out.length;
    console.log(
        `${WRITE ? "write" : "would"} ${file}  ${meta.width}×${meta.height} → ${Math.min(w, MAX_W)}w  ` +
            `${Math.round(before / 1024)} → ${Math.round(out.length / 1024)} KB  (focal ${x},${y})`,
    );
    if (WRITE) await writeFile(path, out);
}
console.log(`\n${WRITE ? "Saved" : "Would save"} ${Math.round(saved / 1024)} KB`);
