import { Suspense } from "react";
import { UsersScreen } from "@/components/admin/UsersScreen";

// Rendered behind the client session gate → no prerendered UI to validate (see app/admin/layout.js).
export const instant = false;

export const metadata = { title: "Staff accounts" };

export default function Page() {
    return (
        <Suspense fallback={null}>
            <UsersScreen />
        </Suspense>
    );
}
