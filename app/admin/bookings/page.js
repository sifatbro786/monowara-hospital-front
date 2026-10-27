import { Suspense } from "react";
import { InboxScreen } from "@/components/admin/InboxScreen";

export const metadata = { title: "Bookings" };

// Filters live in the URL (useSearchParams) → client-rendered inside Suspense.
export default function Page() {
    return (
        <Suspense fallback={null}>
            <InboxScreen kind="bookings" />
        </Suspense>
    );
}
