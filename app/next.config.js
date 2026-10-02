/** @type {import('next').NextConfig} */

const allowedOrigin = process.env.NEXT_PUBLIC_HOST_URL || "http://localhost:3000";
const allowedOriginHostname = (() => {
    try {
        return new URL(allowedOrigin).hostname;
    } catch {
        return null;
    }
})();
const imageDomains = ["localhost", "ho.nm-forum.de", "humans-only.de"];
if (allowedOriginHostname && !imageDomains.includes(allowedOriginHostname)) {
    imageDomains.push(allowedOriginHostname);
}

const devOrigins = [];
if (process.env.BASE44_PUBLIC_HOST_SUFFIX) {
    devOrigins.push('3000-' + process.env.BASE44_PUBLIC_HOST_SUFFIX);
}

const nextConfig = {
    allowedDevOrigins: devOrigins.length ? devOrigins : undefined,
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb',
        },
    },
    images: {
        domains: imageDomains,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: allowedOrigin },
                    { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
