/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
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
