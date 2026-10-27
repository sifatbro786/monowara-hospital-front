import { notFound } from "next/navigation";

// Rendered behind the client session gate → no prerendered UI to validate (see app/admin/layout.js).
export const instant = false;

// Unknown /admin/* (or a module that isn't built yet) → admin 404 inside the dashboard shell,
// instead of falling through to the public [lang] routes.
export default function Missing() {
    notFound();
}
