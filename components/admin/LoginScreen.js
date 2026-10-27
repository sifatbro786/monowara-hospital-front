"use client";

import Image from "next/image";
import { useState } from "react";
import { authApi } from "@/lib/admin/api";
import { useSession } from "./session";
import { ABtn, Field, Notice, PasswordInput, inputCls } from "./ui";

/**
 * Staff sign-in. No "forgot password" link on purpose: there is no public reset flow —
 * a super admin resets it (Staff accounts) or `npm run create-admin -- --reset` on the server.
 */
export function LoginScreen({ reason }) {
    const { signedIn } = useSession();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    async function submit(e) {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setError(null);
        try {
            signedIn(await authApi.login(email.trim(), password));
        } catch (err) {
            setPassword("");
            setError(
                err.code === "VALIDATION"
                    ? "Enter your work email and password."
                    : err.code === "RATE_LIMITED"
                      ? "Too many attempts from this network. Wait a few minutes and try again."
                      : err.message,
            );
            setBusy(false);
        }
    }

    return (
        <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            {/* Brand side — Bangla wordmark as the graphic, no stock photo */}
            <aside className="paper-grain-dark relative hidden overflow-hidden bg-teal-950 text-paper lg:flex lg:flex-col lg:justify-between lg:p-12">
                <p className="text-[0.72rem] font-semibold tracking-[0.2em] text-teal-200 uppercase">Staff dashboard</p>
                <div>
                    <p lang="bn" className="text-[clamp(3.5rem,6vw,5.75rem)] leading-[1.05] font-semibold text-paper/95">
                        মনোয়ারা
                        <br />
                        হসপিটাল
                    </p>
                    <div className="mt-8 h-px w-24 bg-teal-400" />
                    <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-teal-100/80">
                        Bookings, messages, doctors and site content for monowarahospital.com — one place, one sign-in per person.
                    </p>
                </div>
                <p className="text-[0.8rem] text-teal-200/60">54 Siddeshwari Road, Ramna, Dhaka-1217</p>
                {/* thin arch, echoing the logo's doorway */}
                <svg
                    aria-hidden="true"
                    viewBox="0 0 200 260"
                    className="pointer-events-none absolute -right-16 -bottom-10 h-[70%] text-teal-700/40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                >
                    <path d="M20 260V100a80 80 0 0 1 160 0v160" />
                    <path d="M45 260V104a55 55 0 0 1 110 0v156" />
                </svg>
            </aside>

            <main className="flex items-center justify-center bg-paper px-5 py-12">
                <form onSubmit={submit} className="w-full max-w-sm" noValidate>
                    <Image src="/logo.png" alt="Monowara Hospital" width={300} height={64} className="h-10 w-auto" loading="eager" />
                    <h1 className="mt-10 text-[1.9rem] leading-tight font-medium tracking-[-0.02em]">Sign in</h1>
                    <p className="mt-1.5 text-[0.92rem] text-ink-3">Use the account a super admin created for you.</p>

                    <div className="mt-7 space-y-4">
                        {reason && !error ? <Notice tone="info">{reason}</Notice> : null}
                        {error ? <Notice>{error}</Notice> : null}
                        <Field label="Work email" htmlFor="login-email">
                            <input
                                id="login-email"
                                type="email"
                                inputMode="email"
                                autoComplete="username"
                                required
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputCls}
                            />
                        </Field>
                        <Field label="Password" htmlFor="login-password">
                            <PasswordInput
                                id="login-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Field>
                        <ABtn type="submit" variant="ink" size="lg" busy={busy} className="w-full" disabled={!email || !password}>
                            Sign in
                        </ABtn>
                    </div>
                    <p className="mt-8 text-[0.8rem] leading-relaxed text-ink-3">
                        Forgot your password? Ask a super admin to reset it. Five wrong tries lock the account for 15 minutes.
                    </p>
                </form>
            </main>
        </div>
    );
}
