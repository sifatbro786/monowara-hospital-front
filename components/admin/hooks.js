"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/api";

/**
 * Filters live in the URL (shareable, survive reload, back button works).
 * set({ q: "x" }) → replaces the URL; empty values are removed; any change resets `page`
 * unless the patch sets it.
 */
export function useUrlState() {
    const sp = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const get = useCallback((k) => sp.get(k) ?? "", [sp]);
    const set = useCallback(
        (patch, { path = pathname } = {}) => {
            const p = new URLSearchParams(sp);
            for (const [k, v] of Object.entries(patch)) {
                if (v === undefined || v === null || v === "") p.delete(k);
                else p.set(k, String(v));
            }
            if (!("page" in patch)) p.delete("page");
            const qs = p.toString();
            router.replace(qs ? `${path}?${qs}` : path, { scroll: false });
        },
        [sp, router, pathname],
    );
    return { get, set, params: sp };
}

/**
 * GET with abort on change. `key` = JSON of the request → `loading` is derived (no setState in the
 * effect body), stale responses are dropped. `reload()` re-runs the same request.
 */
export function useAdminGet(path, query, { enabled = true } = {}) {
    const key = enabled && path ? JSON.stringify([path, query]) : null;
    const [tick, setTick] = useState(0);
    const [res, setRes] = useState({ key: null, tick: -1, data: null, error: null });

    useEffect(() => {
        if (!key) return;
        const [p, q] = JSON.parse(key);
        const ac = new AbortController();
        adminFetch(p, { query: q, signal: ac.signal }).then(
            (data) => setRes({ key, tick, data, error: null }),
            (error) => {
                if (error?.name !== "AbortError") setRes((r) => ({ key, tick, data: r.key === key ? r.data : null, error }));
            },
        );
        return () => ac.abort();
    }, [key, tick]);

    const fresh = res.key === key;
    return {
        data: fresh ? res.data : null,
        // keep the previous page on screen while the next one loads (no flash of empty table)
        previous: res.data,
        error: fresh ? res.error : null,
        loading: !!key && (!fresh || res.tick !== tick),
        reload: useCallback(() => setTick((t) => t + 1), []),
        /** optimistic local edit of the cached response */
        mutate: useCallback((fn) => setRes((r) => ({ ...r, data: fn(r.data) })), []),
    };
}

/** Debounced copy of a value (search box → URL). */
export function useDebounced(value, ms = 350) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setV(value), ms);
        return () => clearTimeout(t);
    }, [value, ms]);
    return v;
}
