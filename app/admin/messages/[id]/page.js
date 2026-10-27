import { Suspense } from "react";
import { InboxScreen } from "@/components/admin/InboxScreen";

export const metadata = { title: "Messages" };

// Deep link from the alert email (ADMIN_URL/admin/messages/<id>): the list with that entry open.
export default function Page() {
    return (
        <Suspense fallback={null}>
            <InboxScreen kind="messages" />
        </Suspense>
    );
}
