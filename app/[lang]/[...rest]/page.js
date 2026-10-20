import { notFound } from "next/navigation";

// Unmatched URLs under a locale render [lang]/not-found.js inside the site shell.
// 404s never need an instant shell; opting out stops dev-only validation noise on bad URLs.
export const instant = false;

export default function CatchAll() {
    notFound();
}
