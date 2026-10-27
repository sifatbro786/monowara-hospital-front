import { Suspense } from "react";
import { DoctorsScreen } from "@/components/admin/doctors/DoctorsScreen";

// Rendered behind the client session gate → no prerendered UI to validate (see app/admin/layout.js).
export const instant = false;

export const metadata = { title: "Doctors" };

export default function Page() {
    return (
        <Suspense fallback={null}>
            <DoctorsScreen />
        </Suspense>
    );
}
