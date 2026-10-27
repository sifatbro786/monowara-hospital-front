"use client";

import { useRef, useState } from "react";
import { adminFetch } from "@/lib/admin/api";
import { cn } from "@/lib/utils";
import { ABtn, AIcon, abtn } from "./ui";

/**
 * Upload → POST /api/admin/uploads/:folder → value = "/uploads/<folder>/<name>.webp".
 * Plain <img> preview: next/image doesn't know files uploaded after the server started.
 */
export function ImageUpload({ id, folder, value, onChange, error, aspect = "aspect-[3/2]", width = "w-72", hint }) {
    const input = useRef(null);
    const [busy, setBusy] = useState(false);
    const [problem, setProblem] = useState(null);

    async function upload(file) {
        if (!file) return;
        setBusy(true);
        setProblem(null);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const out = await adminFetch(`/admin/uploads/${folder}`, { method: "POST", body: fd });
            onChange(out.src);
            if (out.warnings?.length) setProblem(out.warnings.join(" "));
        } catch (err) {
            setProblem(err.message);
        } finally {
            setBusy(false);
            if (input.current) input.current.value = "";
        }
    }

    return (
        <div className="flex flex-wrap items-end gap-5">
            <div className={cn(aspect, width, "max-w-full overflow-hidden rounded-xl border border-line bg-paper-2")}>
                {value ? (
                    // eslint-disable-next-line @next/next/no-img-element -- fresh uploads aren't known to next/image
                    <img src={value} alt="" onError={(e) => (e.currentTarget.style.visibility = "hidden")} className="size-full object-cover" />
                ) : (
                    <span className="grid size-full place-items-center text-ink-3">
                        <AIcon name="image" className="size-6" />
                    </span>
                )}
            </div>
            <div className="space-y-2">
                <input ref={input} id={id} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} />
                <label htmlFor={id} className={cn(abtn({ size: "sm" }), "cursor-pointer", busy && "pointer-events-none opacity-50")}>
                    <AIcon name={busy ? "refresh" : "image"} className={busy ? "animate-spin" : ""} />
                    {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
                </label>
                {value ? (
                    <ABtn size="sm" variant="ghost" onClick={() => onChange(null)}>
                        Remove
                    </ABtn>
                ) : null}
                {problem || error ? (
                    <p className="max-w-xs text-[0.8rem] text-emergency-ink">{problem || error}</p>
                ) : hint ? (
                    <p className="max-w-xs text-[0.78rem] text-ink-3">{hint}</p>
                ) : null}
            </div>
        </div>
    );
}
