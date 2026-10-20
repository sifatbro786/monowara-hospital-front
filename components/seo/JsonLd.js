// Server-rendered JSON-LD. `<` is escaped so data can never close the script tag.
export function JsonLd({ data }) {
    const items = (Array.isArray(data) ? data : [data]).filter(Boolean);
    if (!items.length) return null;
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(items.length === 1 ? items[0] : items).replace(
                    /</g,
                    "\\u003c",
                ),
            }}
        />
    );
}
