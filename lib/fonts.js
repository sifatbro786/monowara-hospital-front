import localFont from "next/font/local";

// Self-hosted (OFL, from @fontsource-variable/google-sans) — no Google Fonts call at build or
// runtime, so builds work offline/CI and the VPS has no third-party font dependency.
//
// Latin: Google Sans (variable 400–700) for everything — UI, body and headings. One family set
// with weight + tracking, instead of the serif-display + grotesk pairing.
// Bangla: Hind Siliguri (UI/body) + Tiro Bangla (display) — see the note above `fontVariables`.

export const googleSans = localFont({
    src: [
        {
            path: "../app/fonts/google-sans-latin-wght-normal.woff2",
            weight: "400 700",
            style: "normal",
        },
        {
            path: "../app/fonts/google-sans-latin-wght-italic.woff2",
            weight: "400 700",
            style: "italic",
        },
    ],
    variable: "--font-gsans",
    display: "swap",
    fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

// Bangla faces (Hind Siliguri, Tiro Bangla) are declared in app/globals.css from /public/fonts/bn
// with stable URLs, so the [lang] layout can preload them on BN pages only (next/font preloads per
// route, and EN + BN share one route — preloading there would cost every EN visit ~150 KB).

export const fontVariables = googleSans.variable;
