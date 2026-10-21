import localFont from "next/font/local";

// Self-hosted (OFL, from @fontsource) — no Google Fonts call at build or runtime,
// so builds work offline/CI and the VPS has no third-party font dependency.
//
// Latin: Newsreader (editorial serif, display) + Hanken Grotesk (quiet grotesk, UI/body).
// Bangla: Hind Siliguri (UI/body) + Tiro Bangla (display, Bangla-as-graphic).
// Bangla faces carry a unicode-range: the browser only fetches them when Bangla glyphs are
// painted, so EN pages don't pay for them (see the note above `fontVariables`).

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

// Bangla faces (Hind Siliguri, Tiro Bangla) are declared in app/globals.css from /public/fonts/bn
// with stable URLs, so the [lang] layout can preload them on BN pages only (next/font preloads per
// route, and EN + BN share one route — preloading there would cost every EN visit ~150 KB).

export const fontVariables = [newsreader.variable, hanken.variable].join(" ");
