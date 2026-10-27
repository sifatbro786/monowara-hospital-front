import "../globals.css";
import { fontVariables } from "@/lib/fonts";
import { AdminProvider } from "@/components/admin/AdminProvider";

// Staff dashboard — its own root layout: no site Loader/TopBar/Header, not localised, never indexed.
// Everything below is client-rendered behind the session gate; mh-back authorises every request.
export const metadata = {
    title: { default: "Dashboard · Monowara Hospital", template: "%s · MH Admin" },
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
    referrer: "same-origin",
};

// The dashboard is a client-side app behind a session gate: its pages render only after /auth/me,
// so there is no prerendered page UI for Next's instant-navigation validation to inspect (dev error
// "Could not validate that a segment … has instant navigation"). `instant = false` here and on every
// admin page.js (the flag is per segment, a layout's false doesn't cover its pages) opts only /admin out
// — the public site keeps validation. Docs: route-segment-config/instant.md.
export const instant = false;

export const viewport = {
    themeColor: "#f6f3ec",
};

export default function AdminLayout({ children }) {
    return (
        // suppressHydrationWarning: browser extensions (ColorZilla's cz-shortcut-listen, Grammarly…)
        // add attributes to <html>/<body> before React hydrates — same as the public [lang] layout.
        <html lang="en" className={fontVariables} suppressHydrationWarning>
            <body className="min-h-dvh text-[0.95rem] antialiased" suppressHydrationWarning>
                <AdminProvider>{children}</AdminProvider>
            </body>
        </html>
    );
}
