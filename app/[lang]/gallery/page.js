import { Container } from "@/components/ui/Layout";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMedia } from "@/lib/api/media";
import { GalleryGrid } from "@/components/content/GalleryGrid";
import { getDictionary } from "@/lib/i18n/getDictionary";
import { getGallery } from "@/lib/api/content";
import { t } from "@/lib/i18n/t";
import { pageMeta } from "@/lib/seo/metadata";

export async function generateMetadata({ params }) {
    const { lang } = await params;
    const g = (await getDictionary(lang)).gallery;
    return pageMeta({
        lang,
        path: "/gallery",
        title: g.eyebrow,
        description: g.metaDescription,
    });
}

export default async function GalleryPage({ params }) {
    const { lang } = await params;
    const media = await getMedia();
    const [dict, items] = await Promise.all([getDictionary(lang), getGallery()]);
    const g = dict.gallery;
    return (
        <>
            <PageHeader
                eyebrow={g.eyebrow}
                title=<>{g.title}</>
                lead={g.lead}
                media={media["header.gallery"]}
                lang={lang}
            />
            <section className="bg-paper py-12 lg:py-16">
                <Container>
                    <GalleryGrid
                        items={items.map((x) => ({ ...x, caption: t(x.caption, lang) }))}
                        categories={g.categories}
                        labels={{ all: g.all, close: g.close, prev: g.prev, next: g.next }}
                    />
                </Container>
            </section>
        </>
    );
}
