import { Suspense } from "react";
import { InboxScreen } from "@/components/admin/InboxScreen";

export const metadata = { title: "Job applications" };

// Deep link from the alert email (ADMIN_URL/admin/applications/<id>): the list with that entry open.
export default function Page() {
    return (
        <Suspense fallback={null}>
            <InboxScreen kind="applications" />
        </Suspense>
    );
}
