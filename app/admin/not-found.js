import Link from "next/link";

export default function AdminNotFound() {
    return (
        <div className="py-16">
            <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-teal-700 uppercase">404</p>
            <h1 className="mt-1 text-2xl font-medium">This page isn&apos;t here</h1>
            <p className="mt-2 max-w-md text-[0.92rem] text-ink-3">
                The link may be old, or this section arrives in a later update.
            </p>
            <Link href="/admin" className="mt-5 inline-block text-teal-800 underline underline-offset-2">
                Back to the overview
            </Link>
        </div>
    );
}
