import { Suspense } from "react";
import { DoctorEditor } from "@/components/admin/doctors/DoctorEditor";

// Rendered behind the client session gate → no prerendered UI to validate (see app/admin/layout.js).
export const instant = false;

export const metadata = { title: "Doctor" };

// /admin/doctors/new → create, /admin/doctors/<id> → edit (DoctorEditor reads the id client-side).
export default function Page() {
    return (
        <Suspense fallback={null}>
            <DoctorEditor />
        </Suspense>
    );
}
