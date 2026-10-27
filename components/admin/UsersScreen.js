"use client";

import { useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin/api";
import { ROLES, ROLE_LABELS, ROLE_NOTES } from "@/lib/admin/config";
import { fmtAgo, fmtDateTime, passwordProblem, tempPassword } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/Dialog";
import { useAdminGet, useUrlState } from "./hooks";
import { RequirePermission, useSession } from "./session";
import { ABtn, AIcon, CopyButton, Empty, Field, Notice, PageHead, Pager, inputCls } from "./ui";

export function UsersScreen() {
    return (
        <RequirePermission perm="users.manage">
            <Users />
        </RequirePermission>
    );
}

function Users() {
    const { user: me, reload: reloadSession } = useSession();
    const { get, set } = useUrlState();
    const query = useMemo(
        () => ({
            q: get("q") || undefined,
            role: get("role") || undefined,
            active: get("active") || undefined,
            page: Number(get("page")) || 1,
            limit: 50,
        }),
        [get],
    );
    const list = useAdminGet("/admin/users", query);
    const data = list.data ?? list.previous;
    const [dialog, setDialog] = useState(null); // { type: "create" | "edit" | "reset" | "logout", user? }
    const [flash, setFlash] = useState(null);
    const done = (msg) => {
        if (dialog?.user?._id === me._id) reloadSession(); // own name changed → sidebar
        setDialog(null);
        setFlash(msg);
        list.reload();
    };

    return (
        <>
            <PageHead
                eyebrow="Administration"
                title="Staff accounts"
                sub="One account per person — never share a login. Accounts are deactivated, not deleted, so the activity log stays readable."
            >
                <ABtn variant="ink" size="sm" onClick={() => setDialog({ type: "create" })}>
                    <AIcon name="plus" /> Add staff
                </ABtn>
            </PageHead>

            <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem_10rem]">
                <Field label="Search" htmlFor="u-q">
                    <input
                        id="u-q"
                        type="search"
                        defaultValue={get("q")}
                        onKeyDown={(e) =>
                            e.key === "Enter" && set({ q: e.currentTarget.value.trim() })
                        }
                        onBlur={(e) =>
                            e.currentTarget.value.trim() !== get("q") &&
                            set({ q: e.currentTarget.value.trim() })
                        }
                        placeholder="Name or email, then Enter"
                        className={inputCls}
                    />
                </Field>
                <Field label="Role" htmlFor="u-role">
                    <select
                        id="u-role"
                        value={get("role")}
                        onChange={(e) => set({ role: e.target.value })}
                        className={inputCls}
                    >
                        <option value="">All roles</option>
                        {ROLES.map((r) => (
                            <option key={r} value={r}>
                                {ROLE_LABELS[r]}
                            </option>
                        ))}
                    </select>
                </Field>
                <Field label="Status" htmlFor="u-active">
                    <select
                        id="u-active"
                        value={get("active")}
                        onChange={(e) => set({ active: e.target.value })}
                        className={inputCls}
                    >
                        <option value="">All</option>
                        <option value="true">Active</option>
                        <option value="false">Deactivated</option>
                    </select>
                </Field>
            </div>

            {flash ? (
                <Notice tone="info" className="mt-4">
                    {flash}
                </Notice>
            ) : null}
            {list.error ? <Notice className="mt-4">{list.error.message}</Notice> : null}

            <section
                className="mt-5 overflow-hidden rounded-xl border border-line bg-card"
                aria-busy={list.loading}
            >
                <div className="hidden grid-cols-[minmax(0,1.4fr)_10rem_9rem_9rem_auto] gap-4 border-b border-line bg-paper-2/50 px-4 py-2.5 text-[0.72rem] font-semibold tracking-[0.12em] text-ink-3 uppercase md:grid">
                    <span>Person</span>
                    <span>Role</span>
                    <span>Status</span>
                    <span>Last sign-in</span>
                    <span className="sr-only">Actions</span>
                </div>
                {data?.items.length ? (
                    <ul>
                        {data.items.map((u) => {
                            const self = u._id === me._id;
                            return (
                                <li
                                    key={u._id}
                                    className={cn(
                                        "grid gap-x-4 gap-y-2 border-b border-line-soft px-4 py-3 text-[0.9rem] last:border-0 md:grid-cols-[minmax(0,1.4fr)_10rem_9rem_9rem_auto] md:items-center",
                                        !u.isActive && "text-ink-3",
                                    )}
                                >
                                    <span className="min-w-0">
                                        <span className="block truncate font-medium text-ink">
                                            {u.name}{" "}
                                            {self ? (
                                                <span className="text-[0.78rem] font-normal text-ink-3">
                                                    (you)
                                                </span>
                                            ) : null}
                                        </span>
                                        <span className="block truncate text-[0.82rem] text-ink-3">
                                            {u.email}
                                        </span>
                                    </span>
                                    <span>{ROLE_LABELS[u.role] ?? u.role}</span>
                                    <span className="text-[0.84rem]">
                                        {!u.isActive ? (
                                            "Deactivated"
                                        ) : u.mustChangePassword ? (
                                            <span className="text-teal-800">
                                                Awaiting first sign-in
                                            </span>
                                        ) : (
                                            "Active"
                                        )}
                                    </span>
                                    <span
                                        className="text-[0.84rem] text-ink-3"
                                        title={
                                            u.lastLoginAt ? fmtDateTime(u.lastLoginAt) : undefined
                                        }
                                    >
                                        {u.lastLoginAt ? fmtAgo(u.lastLoginAt) : "Never"}
                                    </span>
                                    <span className="flex flex-wrap gap-1 md:justify-end">
                                        <ABtn
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setDialog({ type: "edit", user: u })}
                                        >
                                            <AIcon name="edit" /> Edit
                                        </ABtn>
                                        {!self ? (
                                            <>
                                                <ABtn
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        setDialog({ type: "reset", user: u })
                                                    }
                                                >
                                                    <AIcon name="key" /> Reset password
                                                </ABtn>
                                                <ABtn
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        setDialog({ type: "logout", user: u })
                                                    }
                                                    disabled={!u.isActive}
                                                >
                                                    <AIcon name="logout" /> Sign out
                                                </ABtn>
                                            </>
                                        ) : null}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                ) : data ? (
                    <Empty title="No staff accounts match" />
                ) : (
                    <div className="h-40 animate-pulse bg-paper-2/40" />
                )}
                {data ? (
                    <Pager
                        page={data.page}
                        limit={data.limit}
                        total={data.total}
                        onPage={(p) => set({ page: p })}
                    />
                ) : null}
            </section>

            <Dialog open={!!dialog} onClose={() => setDialog(null)} closeLabel="Close">
                {dialog?.type === "create" ? <CreateUser onDone={done} /> : null}
                {dialog?.type === "edit" ? (
                    <EditUser user={dialog.user} self={dialog.user._id === me._id} onDone={done} />
                ) : null}
                {dialog?.type === "reset" ? (
                    <ResetPassword user={dialog.user} onDone={done} />
                ) : null}
                {dialog?.type === "logout" ? (
                    <ForceLogout
                        user={dialog.user}
                        onDone={done}
                        onCancel={() => setDialog(null)}
                    />
                ) : null}
            </Dialog>
        </>
    );
}

function DialogBody({ title, sub, children }) {
    return (
        <div className="p-6 sm:p-7">
            <h2 className="pr-10 text-xl font-medium">{title}</h2>
            {sub ? <p className="mt-1.5 text-[0.88rem] text-ink-3">{sub}</p> : null}
            <div className="mt-5">{children}</div>
        </div>
    );
}

function RolePicker({ value, onChange, disabled }) {
    return (
        <fieldset disabled={disabled} className="space-y-1.5">
            <legend className="mb-1.5 text-[0.8rem] font-semibold text-ink-2">Role</legend>
            {ROLES.map((r) => (
                <label
                    key={r}
                    className={cn(
                        "flex cursor-pointer gap-3 rounded-lg border px-3 py-2.5 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-teal-600",
                        value === r
                            ? "border-teal-700 bg-teal-50"
                            : "border-line hover:border-ink/30",
                        disabled && "cursor-not-allowed opacity-60",
                    )}
                >
                    <input
                        type="radio"
                        name="role"
                        value={r}
                        checked={value === r}
                        onChange={() => onChange(r)}
                        className="mt-1 accent-teal-700"
                    />
                    <span>
                        <span className="block text-[0.9rem] font-medium">{ROLE_LABELS[r]}</span>
                        <span className="block text-[0.8rem] text-ink-3">{ROLE_NOTES[r]}</span>
                    </span>
                </label>
            ))}
        </fieldset>
    );
}

function TempPasswordField({ value, onChange, error }) {
    return (
        <Field
            label="Temporary password"
            htmlFor="tmp-pw"
            error={error}
            hint="They must change it at first sign-in. Share it in person or by phone — not in a group chat."
        >
            <div className="flex gap-2">
                <input
                    id="tmp-pw"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(inputCls, "font-mono tracking-wide")}
                    autoComplete="off"
                    spellCheck={false}
                    aria-invalid={!!error || undefined}
                />
                <ABtn
                    variant="outline"
                    onClick={() => onChange(tempPassword())}
                    aria-label="Generate a new password"
                >
                    <AIcon name="refresh" />
                </ABtn>
            </div>
        </Field>
    );
}

/** Shown once after create/reset: the only moment the temporary password is visible. */
function Handover({ user, password, onDone, verb }) {
    return (
        <DialogBody title={`${verb} — hand over the password`} sub={`${user.name} · ${user.email}`}>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-paper px-4 py-3">
                <code className="font-mono text-lg tracking-wider">{password}</code>
                <CopyButton text={password} />
            </div>
            <p className="mt-3 text-[0.85rem] text-ink-3">
                This is shown only now. They sign in at <strong>/admin</strong> and choose their own
                password immediately.
            </p>
            <ABtn
                variant="ink"
                className="mt-5"
                onClick={() => onDone(`${user.name}: ${verb.toLowerCase()}.`)}
            >
                Done
            </ABtn>
        </DialogBody>
    );
}

function CreateUser({ onDone }) {
    const [form, setForm] = useState(() => ({
        name: "",
        email: "",
        role: "opd_incharge",
        password: tempPassword(),
    }));
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const [created, setCreated] = useState(null);
    const pwProblem = passwordProblem(form.password);

    if (created)
        return (
            <Handover
                user={created}
                password={form.password}
                onDone={onDone}
                verb="Account created"
            />
        );

    async function submit(e) {
        e.preventDefault();
        setBusy(true);
        setError(null);
        setErrors({});
        try {
            setCreated(
                await adminFetch("/admin/users", {
                    method: "POST",
                    body: { ...form, name: form.name.trim(), email: form.email.trim() },
                }),
            );
        } catch (err) {
            setErrors(err.fieldErrors);
            setError(err.code === "VALIDATION" ? "Check the highlighted fields." : err.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <DialogBody title="Add staff account">
            <form onSubmit={submit} className="space-y-4" noValidate>
                {error ? <Notice>{error}</Notice> : null}
                <Field label="Full name" htmlFor="c-name" error={errors.name}>
                    <input
                        id="c-name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputCls}
                        maxLength={80}
                        autoFocus
                        required
                    />
                </Field>
                <Field label="Work email" htmlFor="c-email" error={errors.email}>
                    <input
                        id="c-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputCls}
                        maxLength={254}
                        required
                    />
                </Field>
                <RolePicker value={form.role} onChange={(role) => setForm({ ...form, role })} />
                <TempPasswordField
                    value={form.password}
                    onChange={(password) => setForm({ ...form, password })}
                    error={errors.password ?? pwProblem}
                />
                <ABtn
                    type="submit"
                    variant="ink"
                    busy={busy}
                    disabled={form.name.trim().length < 2 || !form.email || !!pwProblem}
                >
                    Create account
                </ABtn>
            </form>
        </DialogBody>
    );
}

function EditUser({ user, self, onDone }) {
    const [form, setForm] = useState({ name: user.name, role: user.role, isActive: user.isActive });
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    const body = {};
    if (form.name.trim() !== user.name) body.name = form.name.trim();
    if (form.role !== user.role) body.role = form.role;
    if (form.isActive !== user.isActive) body.isActive = form.isActive;
    const accessChange = "role" in body || "isActive" in body;

    async function submit(e) {
        e.preventDefault();
        if (!Object.keys(body).length) return;
        setBusy(true);
        setError(null);
        try {
            await adminFetch(`/admin/users/${user._id}`, { method: "PATCH", body });
            onDone(
                `${form.name.trim()}: saved.${accessChange ? " They were signed out so the new access applies." : ""}`,
            );
        } catch (err) {
            setError(err.fieldErrors?.name ?? err.message);
            setBusy(false);
        }
    }

    return (
        <DialogBody title="Edit staff account" sub={user.email}>
            <form onSubmit={submit} className="space-y-4" noValidate>
                {error ? <Notice>{error}</Notice> : null}
                <Field label="Full name" htmlFor="e-name">
                    <input
                        id="e-name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputCls}
                        maxLength={80}
                    />
                </Field>
                <RolePicker
                    value={form.role}
                    onChange={(role) => setForm({ ...form, role })}
                    disabled={self}
                />
                <label
                    className={cn("flex items-center gap-3 text-[0.9rem]", self && "opacity-60")}
                >
                    <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                        disabled={self}
                        className="size-4 accent-teal-700"
                    />
                    Account active (can sign in)
                </label>
                {self ? (
                    <p className="text-[0.8rem] text-ink-3">
                        You can&apos;t change your own role or deactivate yourself — another super
                        admin can.
                    </p>
                ) : null}
                {accessChange ? (
                    <Notice tone="info">
                        Saving signs {user.name} out on every device so the new access applies.
                    </Notice>
                ) : null}
                <ABtn
                    type="submit"
                    variant="ink"
                    busy={busy}
                    disabled={!Object.keys(body).length || form.name.trim().length < 2}
                >
                    Save changes
                </ABtn>
            </form>
        </DialogBody>
    );
}

function ResetPassword({ user, onDone }) {
    const [password, setPassword] = useState(() => tempPassword());
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    const [doneUser, setDoneUser] = useState(null);
    const problem = passwordProblem(password);

    if (doneUser)
        return (
            <Handover user={doneUser} password={password} onDone={onDone} verb="Password reset" />
        );

    async function submit(e) {
        e.preventDefault();
        setBusy(true);
        setError(null);
        try {
            setDoneUser(
                await adminFetch(`/admin/users/${user._id}/reset-password`, {
                    method: "POST",
                    body: { password },
                }),
            );
        } catch (err) {
            setError(err.fieldErrors?.password ?? err.message);
            setBusy(false);
        }
    }

    return (
        <DialogBody title="Reset password" sub={`${user.name} · ${user.email}`}>
            <form onSubmit={submit} className="space-y-4" noValidate>
                {error ? <Notice>{error}</Notice> : null}
                <p className="text-[0.9rem] text-ink-2">
                    Sets a temporary password, unlocks the account if it was locked, and signs{" "}
                    {user.name} out everywhere.
                </p>
                <TempPasswordField value={password} onChange={setPassword} error={problem} />
                <ABtn type="submit" variant="ink" busy={busy} disabled={!!problem}>
                    Reset password
                </ABtn>
            </form>
        </DialogBody>
    );
}

function ForceLogout({ user, onDone, onCancel }) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);
    async function go() {
        setBusy(true);
        try {
            await adminFetch(`/admin/users/${user._id}/logout-all`, { method: "POST" });
            onDone(`${user.name} was signed out on every device.`);
        } catch (err) {
            setError(err.message);
            setBusy(false);
        }
    }
    return (
        <DialogBody
            title={`Sign out ${user.name}?`}
            sub="Ends every session of this account right away (lost phone, shared computer). Their password stays the same."
        >
            {error ? <Notice className="mb-4">{error}</Notice> : null}
            <div className="flex gap-2">
                <ABtn variant="danger" busy={busy} onClick={go}>
                    Sign out everywhere
                </ABtn>
                <ABtn variant="ghost" onClick={onCancel}>
                    Cancel
                </ABtn>
            </div>
        </DialogBody>
    );
}
