"use client";

import { useEffect, useRef } from "react";

const KEY = "mh-loader-seen";

/**
 * Brand intro (master plan §5): arch draws in → keystone lens → ECG pulse runs
 * through the doorway → wordmark settles → the arch opens as a mask revealing the page.
 *
 * Pure CSS animation (zero animation JS shipped). The inline head script in the root
 * layout decides whether it shows (first visit per session, not /emergency, not
 * ?ref=call, not reduced-motion) by setting html[data-loader] before first paint.
 * SSR content renders underneath, so SEO/LCP markup is never blocked. CSS hides it at
 * 3.5s and a failsafe at 4.2s even if this component never hydrates.
 */
export function Loader({ skipLabel = "Skip", wordBn, wordEn }) {
    const ref = useRef(null);

    useEffect(() => {
        const html = document.documentElement;
        if (!html.hasAttribute("data-loader")) return;
        try {
            sessionStorage.setItem(KEY, "1");
        } catch {}
        const el = ref.current;
        const done = (e) => {
            if (!e || e.target === el) html.removeAttribute("data-loader");
        };
        el?.addEventListener("animationend", done);
        const t = setTimeout(done, 4600);
        return () => {
            el?.removeEventListener("animationend", done);
            clearTimeout(t);
        };
    }, []);

    function skip() {
        const el = ref.current;
        el?.classList.add("is-skipping");
        setTimeout(() => document.documentElement.removeAttribute("data-loader"), 260);
    }

    return (
        <div id="mh-loader" ref={ref} aria-hidden="true">
            <div className="mh-loader-stage">
                <svg className="mh-loader-mark" viewBox="0 0 320 250" fill="none">
                    {/* doorway arch */}
                    <path
                        className="mh-l-arch"
                        pathLength="1"
                        d="M100 232V100a60 60 0 0 1 120 0v132"
                        stroke="#837e80"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    <path
                        className="mh-l-base"
                        pathLength="1"
                        d="M92 232h136"
                        stroke="#837e80"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                    {/* keystone lens (from the logo) */}
                    <g className="mh-l-lens">
                        <path d="M124 44c20-17 52-17 72 0-20 17-52 17-72 0Z" fill="#009ea6" />
                        <circle cx="160" cy="44" r="7" fill="#eaf6f6" />
                        <circle cx="142" cy="44" r="3.5" fill="#cfeced" />
                        <circle cx="178" cy="44" r="3.5" fill="#cfeced" />
                    </g>
                    {/* ECG pulse through the doorway */}
                    <path
                        className="mh-l-ecg"
                        pathLength="1"
                        d="M20 168h104l9-20 12 46 13-74 12 62 8-14h122"
                        stroke="#009ea6"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <div className="mh-loader-word">
                    <span lang="bn" className="mh-loader-bn">
                        {wordBn}
                    </span>
                    <span className="mh-loader-en">{wordEn}</span>
                </div>
            </div>
            <button type="button" onClick={skip} className="mh-loader-skip" tabIndex={-1}>
                {skipLabel}
            </button>
        </div>
    );
}
