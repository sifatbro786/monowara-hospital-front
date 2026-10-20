// Brand ornaments drawn from the logo: the keystone lens and fine contour lines
// (the same thin curves used on the hospital's existing slider artwork).

export function Keystone({ className }) {
    return (
        <svg viewBox="0 0 120 44" className={className} aria-hidden>
            <path d="M4 22C30-1 90-1 116 22 90 45 30 45 4 22Z" fill="#009ea6" />
            <path
                d="M4 22C30-1 90-1 116 22 90 45 30 45 4 22Z"
                fill="none"
                stroke="#a1dadd"
                strokeOpacity=".55"
                strokeWidth="1.2"
            />
            <circle cx="60" cy="22" r="8.5" fill="#eaf6f6" />
            <circle cx="36" cy="22" r="4.2" fill="#cfeced" />
            <circle cx="84" cy="22" r="4.2" fill="#cfeced" />
        </svg>
    );
}

export function ContourLines({ className, count = 14 }) {
    const lines = Array.from({ length: count }, (_, i) => {
        const o = i * 22;
        return `M-20 ${520 - o * 0.4}C220 ${470 - o} 420 ${300 - o * 0.6} 980 ${120 - o * 0.9}`;
    });
    return (
        <svg
            viewBox="0 0 960 600"
            fill="none"
            preserveAspectRatio="none"
            className={className}
            aria-hidden
        >
            {lines.map((d, i) => (
                <path
                    key={i}
                    d={d}
                    stroke="currentColor"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                />
            ))}
        </svg>
    );
}
