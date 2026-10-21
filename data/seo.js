// Mock `seo` collection — per-page Google title/description overrides (proposal §5.4 "Settings & SEO":
// "Google title and description for every page"). Keyed by the locale-less path, so one admin table
// covers index pages ("/doctors") and detail pages ("/doctors/dr-nasima-begum") alike.
// Empty fields fall back to the page's own title/description. Admin save → revalidateTag("seo").
// Shape: { _id, path, title: { en, bn }, description: { en, bn }, image?, isActive, createdAt, updatedAt }
export const seo = [];
