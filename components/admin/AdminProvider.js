"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { authApi, onAuthEvent } from "@/lib/admin/api";
import { LoginScreen } from "./LoginScreen";
import { PasswordForm } from "./PasswordForm";
import { AdminShell } from "./AdminShell";
import { ABtn, Notice } from "./ui";
import { SessionCtx } from "./session";

const REASONS = {
    SESSION_IDLE: "You were signed out after 30 minutes without activity.",
    SESSION_EXPIRED: "Your session has expired. Please sign in again.",
    SESSION_REVOKED: "Your session was ended — signed out elsewhere, or your account was changed.",
    TOKEN_EXPIRED: "Your session has expired. Please sign in again.",
    ELSEWHERE: "You signed out in another tab.",
};

/**
 * Gate for every /admin page. The URL never changes on sign-in: a deep link from an alert email
 * (/admin/bookings/<id>) shows the login form in place, then the same page. The API is the real
 * guard — this only decides what to render.
 */
export function AdminProvider({ children }) {
    const [state, setState] = useState({ status: "loading" });
    const [reason, setReason] = useState(null);
    const channel = useRef(null);

    const fromSession = (s) => ({
        status: s.user.mustChangePassword ? "password" : "ready",
        user: s.user,
        permissions: s.permissions ?? [],
    });

    const load = useCallback(
        () =>
            authApi.me().then(
                (s) => setState(fromSession(s)),
                (err) => setState(err.status === 401 ? { status: "anon" } : { status: "offline", error: err.message }),
            ),
        [],
    );

    useEffect(() => {
        load();
    }, [load]);

    // 401/403 from any request anywhere in the dashboard
    useEffect(
        () =>
            onAuthEvent((type, code) => {
                if (type === "signed-out") {
                    setReason(REASONS[code] ?? null);
                    setState({ status: "anon" });
                } else if (type === "password-required") {
                    setState((s) => ({ ...s, status: "password" }));
                }
            }),
        [],
    );

    // Same browser, other tabs: follow sign-in / sign-out (cookies are shared, UI state is not).
    useEffect(() => {
        if (typeof BroadcastChannel === "undefined") return;
        const bc = new BroadcastChannel("mh-admin-auth");
        bc.onmessage = (e) => {
            if (e.data === "logout") {
                setReason(REASONS.ELSEWHERE);
                setState({ status: "anon" });
            } else if (e.data === "login") load();
        };
        channel.current = bc;
        return () => bc.close();
    }, [load]);

    const value = useMemo(() => {
        const permissions = state.permissions ?? [];
        return {
            ...state,
            permissions,
            can: (p) => permissions.includes(p),
            reload: load,
            signedIn(session) {
                setReason(null);
                setState(fromSession(session));
                channel.current?.postMessage("login");
            },
            async signOut({ all = false } = {}) {
                if (all) await authApi.logoutAll().catch(() => authApi.logout());
                else await authApi.logout();
                setReason(null);
                setState({ status: "anon" });
                channel.current?.postMessage("logout");
            },
        };
    }, [state, load]);

    let body;
    if (state.status === "loading") {
        body = (
            <div className="grid min-h-dvh place-items-center" aria-busy="true">
                <p className="text-[0.85rem] tracking-[0.16em] text-ink-3 uppercase">Monowara · Admin</p>
            </div>
        );
    } else if (state.status === "offline") {
        body = (
            <div className="grid min-h-dvh place-items-center p-6">
                <div className="w-full max-w-sm space-y-4">
                    <Notice>{state.error}</Notice>
                    <ABtn variant="ink" onClick={load}>
                        Try again
                    </ABtn>
                </div>
            </div>
        );
    } else if (state.status === "anon") {
        body = <LoginScreen reason={reason} />;
    } else if (state.status === "password") {
        body = (
            <div className="grid min-h-dvh place-items-center bg-paper p-5">
                <div className="w-full max-w-md rounded-2xl border border-line bg-card p-7 shadow-(--shadow-lift)">
                    <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-teal-700 uppercase">First sign-in</p>
                    <h1 className="mt-1 text-2xl font-medium">Set your own password</h1>
                    <p className="mt-2 text-[0.9rem] text-ink-3">
                        {state.user?.name}, your account was given a temporary password. Choose a new one to continue — only you will
                        know it.
                    </p>
                    <PasswordForm className="mt-6" forced />
                </div>
            </div>
        );
    } else {
        body = <AdminShell>{children}</AdminShell>;
    }

    return <SessionCtx.Provider value={value}>{body}</SessionCtx.Provider>;
}
