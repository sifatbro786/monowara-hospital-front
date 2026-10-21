import Image from "next/image";
import Link from "next/link";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { buttonClass } from "@/components/ui/Button";
import { href } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/t";
import { summariseSchedule } from "@/lib/utils/schedule";
import { whatsappLink, cn } from "@/lib/utils";
import { DoctorStatus } from "./DoctorStatus";

/** Doctor card — compact 3:2 portrait (head & shoulders), so a 4-up row fits a laptop screen. */
export function DoctorCard({ doctor, dict, lang, waNumber, className }) {
    const name = t(doctor.name, lang);
    const profile = href(lang, `/doctors/${doctor.slug}`);
    const lines = summariseSchedule(doctor.schedule, lang);
    const msg = dict.appointment.messageWith.replace("{name}", name);

    return (
        <article
            data-track="doctor-card"
            className={cn(
                "group flex h-full flex-col rounded-3xl border border-line bg-card p-4 pb-5",
                className,
            )}
        >
            <Link
                href={profile}
                className="relative block aspect-3/2 overflow-hidden rounded-2xl bg-teal-100"
                tabIndex={-1}
                aria-hidden
            >
                {doctor.photo && (
                    <Image
                        src={doctor.photo}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 17rem, 70vw"
                        className="object-contain object-[50%_15%] transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                    />
                )}
            </Link>
            <div className="mt-3.5 flex flex-1 flex-col px-1">
                <DoctorStatus
                    schedule={doctor.schedule}
                    leave={doctor.leave}
                    labels={{ today: dict.doctor.today, onLeave: dict.doctor.onLeave }}
                    lang={lang}
                    className="mb-2 self-start"
                />
                {doctor.department && (
                    <p className="text-xs font-semibold text-teal-700">
                        {t(doctor.department.name, lang)}
                    </p>
                )}
                <h3 className="mt-1 text-[1.2rem] leading-snug">
                    <Link href={profile} className="hover:text-teal-800">
                        {name}
                    </Link>
                </h3>
                <p className="mt-1 text-[0.8rem] leading-snug text-ink-3">{doctor.degrees}</p>
                {lines.length === 0 && doctor.scheduleNote && (
                    <p className="mt-3 flex gap-1.5 text-[0.8rem] text-ink-2">
                        <Icon name="clock" size={14} className="mt-0.75 shrink-0 text-teal-700" />
                        <span>{t(doctor.scheduleNote, lang)}</span>
                    </p>
                )}
                {lines.length > 0 && (
                    <ul className="mt-3 space-y-1 text-[0.8rem] text-ink-2">
                        {lines.slice(0, 2).map((l) => (
                            <li key={l} className="flex gap-1.5">
                                <Icon
                                    name="clock"
                                    size={14}
                                    className="mt-0.75 shrink-0 text-teal-700"
                                />
                                <span className="tabular-nums">{l}</span>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mt-auto flex gap-2 pt-4">
                    <button
                        type="button"
                        data-appt=""
                        data-appt-context={name}
                        className={buttonClass({
                            variant: "ink",
                            size: "sm",
                            className: "h-10 flex-1",
                        })}
                    >
                        {dict.home.bookDoctor}
                    </button>
                    {waNumber && (
                        <a
                            href={whatsappLink(waNumber, msg)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`WhatsApp — ${name}`}
                            className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-wa hover:border-wa/50"
                        >
                            <WhatsAppMark size={18} />
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}
