import localFont from "next/font/local";

// Self-hosted (OFL, from @fontsource) — no Google Fonts call at build or runtime,
// so builds work offline/CI and the VPS has no third-party font dependency.
//
// Latin: Newsreader (editorial serif, display) + Hanken Grotesk (quiet grotesk, UI/body).
// Bangla: Hind Siliguri (UI/body) + Tiro Bangla (display, Bangla-as-graphic).
// Bangla faces carry a unicode-range and are not preloaded: the browser only fetches
// them when Bangla glyphs are painted, so EN pages don't pay for them.
// Bangla unicode-range (inlined below — next/font options must be literals).

export const newsreader = localFont({
    src: [
        {
            path: "../app/fonts/newsreader-latin-wght-normal.woff2",
            weight: "200 800",
            style: "normal",
        },
        {
            path: "../app/fonts/newsreader-latin-wght-italic.woff2",
            weight: "200 800",
            style: "italic",
        },
    ],
    variable: "--font-newsreader",
    display: "swap",
    fallback: ["Georgia", "serif"],
});

export const hanken = localFont({
    src: [
        {
            path: "../app/fonts/hanken-grotesk-latin-wght-normal.woff2",
            weight: "100 900",
            style: "normal",
        },
    ],
    variable: "--font-hanken",
    display: "swap",
    fallback: ["system-ui", "Arial", "sans-serif"],
});

export const hind = localFont({
    src: [
        {
            path: "../app/fonts/hind-siliguri-bengali-400-normal.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../app/fonts/hind-siliguri-bengali-500-normal.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "../app/fonts/hind-siliguri-bengali-600-normal.woff2",
            weight: "600",
            style: "normal",
        },
    ],
    variable: "--font-hind",
    display: "swap",
    preload: false,
    adjustFontFallback: false,
    declarations: [
        {
            prop: "unicode-range",
            value: "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CE1,U+1CEA,U+1CED,U+1CF2,U+1CF5-1CF7,U+200C-200D,U+20B9,U+25CC,U+A8F1",
        },
    ],
});

export const tiro = localFont({
    src: [
        {
            path: "../app/fonts/tiro-bangla-bengali-400-normal.woff2",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-tiro",
    display: "swap",
    preload: false,
    adjustFontFallback: false,
    declarations: [
        {
            prop: "unicode-range",
            value: "U+0951-0952,U+0964-0965,U+0980-09FE,U+1CD0,U+1CD2,U+1CD5-1CD6,U+1CD8,U+1CE1,U+1CEA,U+1CED,U+1CF2,U+1CF5-1CF7,U+200C-200D,U+20B9,U+25CC,U+A8F1",
        },
    ],
});

export const fontVariables = [
    newsreader.variable,
    hanken.variable,
    hind.variable,
    tiro.variable,
].join(" ");
