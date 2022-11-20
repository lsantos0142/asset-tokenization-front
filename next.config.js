/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        BASE_URL: "http://localhost:3000",
        NEXT_PUBLIC_BACK: "http://localhost:4000",
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/marketplace",
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
