import { notFound } from "next/navigation";

// Unknown /admin/* (or a module that isn't built yet) → admin 404 inside the dashboard shell,
// instead of falling through to the public [lang] routes.
export default function Missing() {
    notFound();
}
