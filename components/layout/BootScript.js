"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Inline <head> script that must run before first paint (sets html.js, decides the loader).
 * SSR + hydration render it as-is; a fresh client render of the root layout (e.g. the dev
 * 404 recovery) renders nothing — the script already ran on load, and React would otherwise
 * warn "Encountered a script tag while rendering React component".
 */
export function BootScript({ code }) {
    const fresh = useSyncExternalStore(
        subscribe,
        () => true, // client snapshot (after hydration / fresh client render)
        () => false, // server + hydration snapshot
    );
    if (fresh) return null;
    return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
