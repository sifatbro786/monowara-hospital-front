import { Overview } from "@/components/admin/Overview";

// Rendered behind the client session gate → no prerendered UI to validate (see app/admin/layout.js).
export const instant = false;

export const metadata = { title: "Overview" };

export default function AdminHome() {
    return <Overview />;
}
