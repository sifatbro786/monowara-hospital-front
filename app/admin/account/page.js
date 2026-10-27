import { AccountScreen } from "@/components/admin/AccountScreen";

// Rendered behind the client session gate → no prerendered UI to validate (see app/admin/layout.js).
export const instant = false;

export const metadata = { title: "My account" };

export default function Page() {
    return <AccountScreen />;
}
