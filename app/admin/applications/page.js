import { Suspense } from "react";
import { InboxScreen } from "@/components/admin/InboxScreen";

// Rendered behind the client session gate → no prerendered UI to validate (see app/admin/layout.js).
export const instant = false;

export const metadata = { title: "Job applications" };

// Filters live in the URL (useSearchParams) → client-rendered inside Suspense.
export default function Page() {
    return (
        <Suspense fallback={null}>
            <InboxScreen kind="applications" />
        </Suspense>
    );
}
