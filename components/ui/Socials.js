import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa6";

/** One source for social icons (Footer + TopBar). URLs come from settings.socials; empty = hidden. */
export const SOCIALS = {
    facebook: { label: "Facebook", Icon: FaFacebookF },
    instagram: { label: "Instagram", Icon: FaInstagram },
    youtube: { label: "YouTube", Icon: FaYoutube },
    linkedin: { label: "LinkedIn", Icon: FaLinkedinIn },
};

/** [[key, url], …] for the socials that have a URL and a known icon, in SOCIALS order. */
export const activeSocials = (socials = {}) =>
    Object.keys(SOCIALS)
        .filter((k) => socials?.[k])
        .map((k) => [k, socials[k]]);
