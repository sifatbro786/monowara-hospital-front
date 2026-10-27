import { Suspense } from "react";
import { CollectionList } from "@/components/admin/collection/CollectionList";

// Rendered behind the client session gate → no prerendered UI to validate (see app/admin/layout.js).
export const instant = false;

export const metadata = { title: "Health tips & news" };

export default function Page() {
    return (
        <Suspense fallback={null}>
            <CollectionList name="articles" />
        </Suspense>
    );
}
