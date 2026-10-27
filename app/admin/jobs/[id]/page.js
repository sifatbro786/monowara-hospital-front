import { Suspense } from "react";
import { CollectionEditor } from "@/components/admin/collection/CollectionEditor";

// Rendered behind the client session gate → no prerendered UI to validate (see app/admin/layout.js).
export const instant = false;

export const metadata = { title: "Careers" };

// /admin/jobs/new → create, /admin/jobs/<id> → edit
export default function Page() {
    return (
        <Suspense fallback={null}>
            <CollectionEditor name="jobs" />
        </Suspense>
    );
}
