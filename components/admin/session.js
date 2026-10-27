"use client";

import { createContext, useContext } from "react";

export const SessionCtx = createContext(null);

/** { status, user, permissions, can(p), signedIn(session), signOut({ all }), reload() } */
export function useSession() {
    return useContext(SessionCtx);
}

/** Screen-level gate: friendly "no access" instead of a wall of 403s (the API still checks). */
export function RequirePermission({ perm, children }) {
    const { can } = useSession();
    if (can(perm)) return children;
    return (
        <div className="py-16">
            <h1 className="text-xl font-medium">No access</h1>
            <p className="mt-2 max-w-md text-[0.92rem] text-ink-3">
                Your role doesn&apos;t include this section. Ask a super admin if you need it.
            </p>
        </div>
    );
}
