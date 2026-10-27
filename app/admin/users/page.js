import { Suspense } from "react";
import { UsersScreen } from "@/components/admin/UsersScreen";

export const metadata = { title: "Staff accounts" };

export default function Page() {
    return (
        <Suspense fallback={null}>
            <UsersScreen />
        </Suspense>
    );
}
