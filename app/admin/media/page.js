import { MediaScreen } from "@/components/admin/MediaScreen";

// Rendered behind the client session gate → no prerendered UI to validate (see app/admin/layout.js).
export const instant = false;

export const metadata = { title: "Image slots" };

export default function Page() {
    return <MediaScreen />;
}
