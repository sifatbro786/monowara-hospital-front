import { legacyRedirects } from "./data/redirects.mjs";

/** @type {import('next').NextConfig} */
const securityHeaders = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
];

const mediaOrigin = process.env.MEDIA_ORIGIN ? new URL(process.env.MEDIA_ORIGIN) : null;

const nextConfig = {
    // experimental.agentFeedback removed (master plan §1: not for production)
    cacheComponents: true,
    partialPrefetching: true,
    reactCompiler: true,
    poweredByHeader: false,
    images: {
        formats: ["image/avif", "image/webp"],
        qualities: [60, 75, 85],
        // Expert-talk thumbnails (click-to-load YouTube)
        remotePatterns: [
            { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
            // API mode: admin uploads are served by Nginx at MEDIA_ORIGIN/uploads (see lib/api/client.js)
            ...(mediaOrigin
                ? [
                      {
                          protocol: mediaOrigin.protocol.replace(":", ""),
                          hostname: mediaOrigin.hostname,
                          ...(mediaOrigin.port && { port: mediaOrigin.port }),
                          pathname: "/uploads/**",
                      },
                  ]
                : []),
        ],
    },
    async headers() {
        return [
            { source: "/:path*", headers: securityHeaders },
            // Versioned self-hosted Bangla fonts (public/fonts/bn/*.v1.woff2) — bump the version to bust.
            {
                source: "/fonts/:path*",
                headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
            },
        ];
    },
    // Old WordPress URLs → new routes (308). Runs before proxy.js, so /bn is unaffected.
    async redirects() {
        return legacyRedirects.map(([source, destination]) => ({
            source,
            destination,
            permanent: true,
        }));
    },
    turbopack: {
        rules: {
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },
};

export default nextConfig;
