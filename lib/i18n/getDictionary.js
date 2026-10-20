import "server-only";
import { hasLocale, defaultLocale } from "./config";

const dictionaries = {
    en: () => import("./dictionaries/en.json").then((m) => m.default),
    bn: () => import("./dictionaries/bn.json").then((m) => m.default),
};

export async function getDictionary(lang) {
    return dictionaries[hasLocale(lang) ? lang : defaultLocale]();
}

/** "Hello {name}" + { name: "X" } -> "Hello X" */
export function format(template = "", vars = {}) {
    return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}
