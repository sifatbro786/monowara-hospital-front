// Hand-picked inline icons (1.6px stroke, 24 grid). No icon library = no bundle weight.
const paths = {
    phone: (
        <path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 5 5l1.3-2 4 1.6V17a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    ),
    arrow: (
        <>
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </>
    ),
    arrowUpRight: (
        <>
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
        </>
    ),
    menu: (
        <>
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h10" />
        </>
    ),
    close: (
        <>
            <path d="M6 6l12 12" />
            <path d="M18 6 6 18" />
        </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    pin: (
        <>
            <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
            <circle cx="12" cy="9.5" r="2.5" />
        </>
    ),
    clock: (
        <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7.5V12l3 2" />
        </>
    ),
    search: (
        <>
            <circle cx="11" cy="11" r="6.5" />
            <path d="m20 20-4.2-4.2" />
        </>
    ),
    chat: (
        <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-7l-4.5 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
    ),
    mail: (
        <>
            <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
            <path d="m4 7 8 6 8-6" />
        </>
    ),
    pulse: <path d="M3 12h4l2-5 4 10 2-5h6" />,
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    clipboard: (
        <>
            <rect x="5" y="4.5" width="14" height="16" rx="2" />
            <path d="M9 4.5h6v2.5H9z" />
            <path d="M9 12h6M9 15.5h4" />
        </>
    ),
    play: <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none" />,
    calendar: (
        <>
            <rect x="4" y="5.5" width="16" height="14" rx="1.5" />
            <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
        </>
    ),
};

export function Icon({ name, size = 20, className, strokeWidth = 1.6, title }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden={title ? undefined : true}
            role={title ? "img" : undefined}
        >
            {title ? <title>{title}</title> : null}
            {paths[name]}
        </svg>
    );
}

/** Official-style WhatsApp glyph (filled). Keep on white/ink chips, never green-on-teal. */
export function WhatsAppMark({ size = 20, className }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
            <path
                fill="currentColor"
                d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 6.9L3 29l6.5-2a13 13 0 0 0 6.5 1.7c7.2 0 13-5.7 13-12.8S23.2 3 16 3Zm0 23.4c-2.1 0-4.1-.6-5.8-1.6l-.4-.2-3.9 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.7-5.8C5.1 10 10 5.3 16 5.3S26.9 10 26.9 15.8 22 26.4 16 26.4Zm6-7.8c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2l-1 1.3c-.2.2-.4.2-.7.1a8.6 8.6 0 0 1-4.3-3.7c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-1-2.5c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5 2.2.9 3 1 4.1.8.7-.1 2-.8 2.3-1.6.3-.8.3-1.4.2-1.6-.1-.1-.3-.2-.7-.4Z"
            />
        </svg>
    );
}
