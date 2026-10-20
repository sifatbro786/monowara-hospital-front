"use client";

import { useSearchParams } from "next/navigation";
import { AppointmentPanel } from "./AppointmentPanel";

/** Reads ?for= (doctor / package / department) so the WhatsApp message is prefilled. */
export function AppointmentFromQuery(props) {
    const params = useSearchParams();
    const context = (params.get("for") || "").slice(0, 120);
    const kind = params.get("kind") === "package" ? "package" : "doctor";
    return <AppointmentPanel {...props} context={context} kind={kind} />;
}
