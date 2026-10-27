"use client";

import { useState } from "react";
import { ROLE_LABELS } from "@/lib/admin/config";
import { fmtDateTime } from "@/lib/admin/format";
import { PasswordForm } from "./PasswordForm";
import { useSession } from "./session";
import { ABtn, Facts, PageHead } from "./ui";

export function AccountScreen() {
    const { user, signOut } = useSession();
    const [busy, setBusy] = useState(false);

    return (
        <>
            <PageHead eyebrow="My account" title={user.name} sub={user.email} />
            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <section aria-labelledby="acc-pw" className="max-w-md">
                    <h2 id="acc-pw" className="text-lg font-medium">
                        Change password
                    </h2>
                    <p className="mt-1 text-[0.88rem] text-ink-3">Your other devices are signed out when you change it.</p>
                    <PasswordForm className="mt-5" />
                </section>
                <section aria-labelledby="acc-info" className="space-y-6">
                    <div>
                        <h2 id="acc-info" className="mb-3 text-lg font-medium">
                            Account
                        </h2>
                        <Facts
                            rows={[
                                ["Role", ROLE_LABELS[user.role] ?? user.role],
                                ["Last sign-in", fmtDateTime(user.lastLoginAt)],
                                ["Password set", user.passwordChangedAt ? fmtDateTime(user.passwordChangedAt) : "—"],
                            ]}
                        />
                    </div>
                    <div>
                        <h3 className="font-medium">Signed in somewhere else?</h3>
                        <p className="mt-1 mb-3 text-[0.88rem] text-ink-3">
                            Lost phone or a shared computer — end every session of your account, including this one.
                        </p>
                        <ABtn
                            variant="danger"
                            busy={busy}
                            onClick={async () => {
                                setBusy(true);
                                await signOut({ all: true });
                            }}
                        >
                            Sign out on all devices
                        </ABtn>
                    </div>
                </section>
            </div>
        </>
    );
}
