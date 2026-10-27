import { Suspense } from "react";
import { ServicesScreen } from "@/components/admin/services/ServicesScreen";

// Rendered behind the client session gate → no prerendered UI to validate (see app/admin/layout.js).
export const instant = false;

export const metadata = { title: "Diagnostics" };

export default function Page() {
    return (
        <Suspense fallback={null}>
            <ServicesScreen kind="diagnostics" />
        </Suspense>
    );
}
