import { SettingsScreen } from "@/components/admin/settings/SettingsScreen";

// Rendered behind the client session gate → no prerendered UI to validate (see app/admin/layout.js).
export const instant = false;

export const metadata = { title: "Settings" };

export default function Page() {
    return <SettingsScreen />;
}
