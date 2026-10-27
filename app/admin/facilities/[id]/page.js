import { Suspense } from "react";
import { ServiceEditor } from "@/components/admin/services/ServiceEditor";

// Rendered behind the client session gate → no prerendered UI to validate (see app/admin/layout.js).
export const instant = false;

export const metadata = { title: "Facilities" };

// /admin/facilities/new → create, /admin/facilities/<id> → edit
export default function Page() {
    return (
        <Suspense fallback={null}>
            <ServiceEditor kind="facilities" />
        </Suspense>
    );
}
