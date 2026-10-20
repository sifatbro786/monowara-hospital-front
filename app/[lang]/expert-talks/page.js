import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMedia } from "@/lib/api/media";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Emphasis } from "@/components/ui/Emphasis";
import { LiteYouTube } from "@/components/home/LiteYouTube";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getSettings } from "@/lib/api/settings";
import { getHomeContent } from "@/lib/api/content";
import { href } from "@/lib/i18n/config";
import { t } from "@/lib/i18n/t";

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const x = (await getDictionary(lang)).talks;
    return {
        title: x.eyebrow,
        description: x.metaDescription,
        alternates: { canonical: href(lang, "/expert-talks") },
    };
}

/** Expert talks — click-to-load YouTube (thumbnail only until play). Talks are the same
 *  admin-managed list as the homepage section. */
export default async function TalksPage({ params }) {
    const { lang } = await params;
    const media = await getMedia();
    const [dict, settings, home] = await Promise.all([
        getDictionary(lang),
        getSettings(),
        getHomeContent(),
    ]);
    const x = dict.talks;
    return (
        <>
            <PageHeader
                eyebrow={x.eyebrow}
                title=<Emphasis text={x.title} />
                lead={x.lead}
                media={media["header.talks"]}
                lang={lang}
            >
                {settings.socials?.youtube && (
                    <Button href={settings.socials.youtube} variant="light" className="mt-8">
                        {x.channel}
                        <Icon name="arrowUpRight" size={16} />
                    </Button>
                )}
            </PageHeader>
            <section className="bg-paper py-12 lg:py-16">
                <Container>
                    <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2">
                        {home.talks.map((v) => (
                            <li key={v._id}>
                                <LiteYouTube
                                    id={v.youtubeId}
                                    title={t(v.title, lang)}
                                    playLabel={dict.home.play}
                                />
                                <p lang="bn" className="mt-4 font-display text-xl leading-snug">
                                    {v.title.bn}
                                </p>
                                {lang !== "bn" && v.title.en && (
                                    <p className="mt-1 text-sm text-ink-2">{v.title.en}</p>
                                )}
                                <p className="mt-1 text-sm text-ink-3">{t(v.speaker, lang)}</p>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>
        </>
    );
}
