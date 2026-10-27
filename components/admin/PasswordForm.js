"use client";

import { useState } from "react";
import { authApi } from "@/lib/admin/api";
import { passwordProblem } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { useSession } from "./session";
import { ABtn, Field, Notice, PasswordInput } from "./ui";

/** Change own password. `forced` = first sign-in / after a reset (the only way past the gate). */
export function PasswordForm({ forced = false, className }) {
    const { signedIn, signOut } = useSession();
    const [current, setCurrent] = useState("");
    const [next, setNext] = useState("");
    const [confirm, setConfirm] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [done, setDone] = useState(false);

    const problem = next ? passwordProblem(next) : null;
    const mismatch = confirm && confirm !== next;

    async function submit(e) {
        e.preventDefault();
        if (busy || problem || mismatch || !current || !next) return;
        setBusy(true);
        setError(null);
        try {
            const session = await authApi.changePassword(current, next);
            setCurrent("");
            setNext("");
            setConfirm("");
            setDone(true);
            signedIn(session); // forced → leaves the gate; voluntary → same screen, success note
        } catch (err) {
            setError(err.fieldErrors?.newPassword ?? err.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <form onSubmit={submit} className={cn("space-y-4", className)} noValidate>
            {error ? <Notice>{error}</Notice> : null}
            {done && !forced ? (
                <Notice tone="info">Password changed. Other devices were signed out.</Notice>
            ) : null}
            <Field label={forced ? "Temporary password" : "Current password"} htmlFor="pw-current">
                <PasswordInput
                    id="pw-current"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    required
                />
            </Field>
            <Field
                label="New password"
                htmlFor="pw-new"
                error={problem}
                hint="At least 10 characters with a letter and a number. A short sentence is easiest to remember."
            >
                <PasswordInput
                    id="pw-new"
                    autoComplete="new-password"
                    value={next}
                    onChange={(e) => setNext(e.target.value)}
                    invalid={!!problem}
                    required
                />
            </Field>
            <Field
                label="Repeat new password"
                htmlFor="pw-confirm"
                error={mismatch ? "Doesn't match." : null}
            >
                <PasswordInput
                    id="pw-confirm"
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    invalid={!!mismatch}
                    required
                />
            </Field>
            <div className="flex flex-wrap items-center gap-3 pt-1">
                <ABtn
                    type="submit"
                    variant="ink"
                    busy={busy}
                    disabled={!current || !next || !confirm || !!problem || !!mismatch}
                >
                    {forced ? "Save and continue" : "Change password"}
                </ABtn>
                {forced ? (
                    <ABtn variant="ghost" onClick={() => signOut()}>
                        Sign out
                    </ABtn>
                ) : null}
            </div>
        </form>
    );
}
