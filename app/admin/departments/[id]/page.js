import { Suspense } from "react";
import { ServiceEditor } from "@/components/admin/services/ServiceEditor";

// Rendered behind the client session gate → no prerendered UI to validate (see app/admin/layout.js).
export const instant = false;

export const metadata = { title: "Departments" };

// /admin/departments/new → create, /admin/departments/<id> → edit
export default function Page() {
    return (
        <Suspense fallback={null}>
            <ServiceEditor kind="departments" />
        </Suspense>
    );
}
