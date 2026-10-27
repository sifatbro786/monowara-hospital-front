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

export const viewport = {
    themeColor: "#f6f3ec",
};

export default function AdminLayout({ children }) {
    return (
        <html lang="en" className={fontVariables}>
            <body className="min-h-dvh text-[0.95rem] antialiased">
                <AdminProvider>{children}</AdminProvider>
            </body>
        </html>
    );
}
