import { Container } from "@/components/ui/Layout";
import { Icon, WhatsAppMark } from "@/components/ui/Icon";
import { LangSwitch } from "./LangSwitch";
import { t, digits } from "@/lib/i18n/t";
import { telHref, whatsappLink, formatPhone } from "@/lib/utils";

export function TopBar({ settings, dict, lang }) {
    const wa = settings.primaryWhatsapp;
    return (
        <div className="bg-ink text-paper">
            <Container className="flex h-10 items-center justify-between gap-4 text-[0.8rem]">
                <a
                    href={telHref(settings.emergency)}
                    className="flex min-w-0 items-center gap-2 text-paper/90 hover:text-paper"
                >
                    <span className="relative flex size-2 shrink-0" aria-hidden>
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#ff2d20] opacity-70 motion-reduce:hidden" />
                        <span className="relative inline-flex size-2 rounded-full bg-[#ff2d20]" />
                    </span>
                    <span className="truncate">{dict.topbar.emergency}</span>
                    <span className="hidden font-medium tabular-nums text-paper sm:inline">
                        · {digits(formatPhone(settings.emergency), lang)}
                    </span>
                </a>

                <div className="flex items-center gap-5">
                    <span className="hidden items-center gap-1.5 text-paper/70 lg:flex">
                        <Icon name="pin" size={14} />
                        {t(settings.address, lang)}
                    </span>
                    {wa && (
                        <a
                            href={whatsappLink(wa.number, dict.appointment.message)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden items-center gap-1.5 text-paper/90 hover:text-paper md:flex"
                        >
                            <WhatsAppMark size={15} className="text-[#5fe08f]" />
                            <span className="tabular-nums">
                                {digits(formatPhone(wa.number), lang)}
                            </span>
                        </a>
                    )}
                    <LangSwitch label={dict.topbar.language} />
                </div>
            </Container>
        </div>
    );
}
