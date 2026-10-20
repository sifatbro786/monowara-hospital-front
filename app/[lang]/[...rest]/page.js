import { notFound } from "next/navigation";

// Unmatched URLs under a locale render [lang]/not-found.js inside the site shell.
export default function CatchAll() {
    notFound();
}
