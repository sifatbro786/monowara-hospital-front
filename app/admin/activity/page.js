import { Suspense } from "react";
import { ActivityScreen } from "@/components/admin/ActivityScreen";

export const metadata = { title: "Activity log" };

export default function Page() {
    return (
        <Suspense fallback={null}>
            <ActivityScreen />
        </Suspense>
    );
}
