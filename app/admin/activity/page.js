import { Suspense } from "react";
import { ActivityScreen } from "@/components/admin/ActivityScreen";

// Rendered behind the client session gate → no prerendered UI to validate (see app/admin/layout.js).
export const instant = false;

export const metadata = { title: "Activity log" };

export default function Page() {
    return (
        <Suspense fallback={null}>
            <ActivityScreen />
        </Suspense>
    );
}
