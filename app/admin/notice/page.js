import { NoticeScreen } from "@/components/admin/settings/SettingsScreen";

// Rendered behind the client session gate → no prerendered UI to validate (see app/admin/layout.js).
export const instant = false;

export const metadata = { title: "Notice bar" };

export default function Page() {
    return <NoticeScreen />;
}
