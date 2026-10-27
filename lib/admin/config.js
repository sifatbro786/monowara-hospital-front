/**
 * Admin UI config. Permissions only decide what the menu shows — mh-back checks every route
 * (single source of truth: mh-back/src/lib/permissions.js).
 */

export const ROLE_LABELS = {
    super_admin: "Super admin",
    opd_incharge: "OPD in-charge",
    graphics_design: "Graphics & design",
    marketer: "Marketing (SEO)",
};
export const ROLES = Object.keys(ROLE_LABELS);

export const ROLE_NOTES = {
    super_admin: "Everything, including staff accounts, settings and the activity log.",
    opd_incharge: "Doctors & chamber times, departments, packages, Aesthetic/BHRPC, bookings, messages, careers, FAQs.",
    graphics_design: "Hero slider, homepage blocks, images, gallery, health tips, patient stories, notice bar, content pages.",
    marketer: "SEO titles and descriptions.",
};

/**
 * Menu. `ready: false` = module lands in a later B2 step — kept here so the order is fixed once,
 * hidden until its screen exists. `perm: null` = every signed-in user.
 */
export const NAV = [
    { items: [{ href: "/admin", label: "Overview", icon: "home", perm: null, ready: true }] },
    {
        title: "Front desk",
        items: [
            { href: "/admin/bookings", label: "Bookings", icon: "calendar", perm: "bookings.manage", ready: true, badge: "bookings" },
            { href: "/admin/messages", label: "Messages", icon: "inbox", perm: "messages.manage", ready: true, badge: "messages" },
            { href: "/admin/applications", label: "Job applications", icon: "briefcase", perm: "careers.manage", ready: true, badge: "applications" },
        ],
    },
    {
        title: "Hospital",
        items: [
            { href: "/admin/doctors", label: "Doctors", icon: "stethoscope", perm: "doctors.manage", ready: true },
            { href: "/admin/departments", label: "Departments & services", icon: "building", perm: "departments.manage", ready: false },
            { href: "/admin/packages", label: "Packages", icon: "package", perm: "packages.manage", ready: false },
            { href: "/admin/programs", label: "Aesthetic & BHRPC", icon: "sparkle", perm: "programs.manage", ready: false },
            { href: "/admin/jobs", label: "Careers", icon: "briefcase", perm: "careers.manage", ready: false },
            { href: "/admin/faqs", label: "FAQ chatbot", icon: "chat", perm: "faqs.manage", ready: false },
        ],
    },
    {
        title: "Site content",
        items: [
            { href: "/admin/hero", label: "Hero slider", icon: "image", perm: "hero.manage", ready: false },
            { href: "/admin/home", label: "Homepage blocks", icon: "layout", perm: "home.manage", ready: false },
            { href: "/admin/media", label: "Image slots", icon: "image", perm: "media.manage", ready: false },
            { href: "/admin/gallery", label: "Gallery", icon: "image", perm: "gallery.manage", ready: false },
            { href: "/admin/articles", label: "Health tips & news", icon: "file", perm: "articles.manage", ready: false },
            { href: "/admin/stories", label: "Patient stories", icon: "quote", perm: "stories.manage", ready: false },
            { href: "/admin/pages", label: "Pages", icon: "file", perm: "pages.manage", ready: false },
        ],
    },
    {
        title: "Marketing",
        items: [{ href: "/admin/seo", label: "SEO", icon: "search", perm: "seo.manage", ready: false }],
    },
    {
        title: "Administration",
        items: [
            { href: "/admin/settings", label: "Settings", icon: "settings", perm: "settings.manage", ready: false },
            { href: "/admin/users", label: "Staff accounts", icon: "users", perm: "users.manage", ready: true },
            { href: "/admin/activity", label: "Activity log", icon: "history", perm: "activity.read", ready: true },
        ],
    },
];

/** Groups/items the user may see (ready ones only). */
export function navFor(permissions = []) {
    const has = (p) => p === null || permissions.includes(p);
    return NAV.map((g) => ({ ...g, items: g.items.filter((i) => i.ready && has(i.perm)) })).filter((g) => g.items.length);
}

/** Everything the role will be able to manage (ready or not) — "Your access" on the overview. */
export function areasFor(permissions = []) {
    return NAV.flatMap((g) => g.items).filter((i) => i.perm && permissions.includes(i.perm));
}

// ── Inboxes ───────────────────────────────────────────────────────────────────────────────────────
export const INBOXES = {
    bookings: {
        path: "/admin/bookings", // dashboard route
        api: "/admin/bookings", // mh-back route (under /api)
        perm: "bookings.manage",
        title: "Bookings",
        noun: "booking",
        statuses: ["new", "confirmed", "completed", "cancelled", "no_show"],
        statusLabels: { new: "New", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled", no_show: "No-show" },
        searchHint: "Patient, phone, doctor…",
        empty: "No booking requests here. Online booking only collects requests while Settings → booking mode is “form” or “both”.",
    },
    messages: {
        path: "/admin/messages", // dashboard route
        api: "/admin/messages", // mh-back route (under /api)
        perm: "messages.manage",
        title: "Messages",
        noun: "message",
        statuses: ["new", "read", "replied", "archived"],
        statusLabels: { new: "New", read: "Read", replied: "Replied", archived: "Archived" },
        searchHint: "Name, phone, email, text…",
        empty: "No messages here yet. They arrive from the Contact page form.",
    },
    applications: {
        path: "/admin/applications", // dashboard route
        api: "/admin/applications", // mh-back route (under /api)
        perm: "careers.manage",
        title: "Job applications",
        noun: "application",
        statuses: ["new", "reviewed", "shortlisted", "rejected", "hired"],
        statusLabels: { new: "New", reviewed: "Reviewed", shortlisted: "Shortlisted", rejected: "Rejected", hired: "Hired" },
        searchHint: "Name, phone, email, position…",
        empty: "No applications here yet. They arrive from Careers → Apply.",
    },
};

/** Tone per status → StatusChip colour. */
export const STATUS_TONE = {
    new: "fresh",
    read: "muted",
    replied: "done",
    archived: "muted",
    confirmed: "good",
    completed: "done",
    cancelled: "bad",
    no_show: "bad",
    reviewed: "muted",
    shortlisted: "good",
    rejected: "bad",
    hired: "done",
};

// ── Activity log ──────────────────────────────────────────────────────────────────────────────────
export const ACTIVITY_GROUPS = [
    { value: "", label: "All activity" },
    { value: "auth.*", label: "Sign-ins & security" },
    { value: "users.*", label: "Staff accounts" },
    { value: "bookings.*", label: "Bookings" },
    { value: "messages.*", label: "Messages" },
    { value: "applications.*", label: "Applications" },
    { value: "doctors.*", label: "Doctors" },
    { value: "uploads.*", label: "Uploads" },
];

const ACTION_LABELS = {
    "auth.login": "Signed in",
    "auth.login_failed": "Failed sign-in",
    "auth.login_locked": "Account locked (too many attempts)",
    "auth.logout": "Signed out",
    "auth.logout_all": "Signed out everywhere",
    "auth.refresh_reuse": "Old session token reused — session revoked",
    "auth.password_change": "Changed password",
    "users.create": "Created staff account",
    "users.update": "Updated staff account",
    "users.reset_password": "Reset password",
    "users.force_logout": "Forced sign-out",
    "bookings.update": "Updated booking",
    "bookings.export": "Exported bookings",
    "messages.update": "Updated message",
    "messages.export": "Exported messages",
    "applications.update": "Updated application",
    "applications.export": "Exported applications",
    "applications.cv_download": "Downloaded CV",
    "uploads.create": "Uploaded image",
    "doctors.create": "Added doctor",
    "doctors.update": "Updated doctor",
    "doctors.delete": "Deleted doctor",
};
export const actionLabel = (a) => ACTION_LABELS[a] ?? a.replace(/[._]/g, " ");
export const isAlertAction = (a) => /login_failed|locked|reuse/.test(a);

// ── Doctors ───────────────────────────────────────────────────────────────────────────────────────
export const DAYS = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"]; // BD week, same as mh-back
export const DAY_LABELS = { sat: "Saturday", sun: "Sunday", mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday" };
export const DAY_SHORT = { sat: "Sat", sun: "Sun", mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri" };
