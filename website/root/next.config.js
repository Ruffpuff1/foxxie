/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['cdn.ruffpuff.dev']
    },
    rewrites: async () => {
        return [
            {
                source: '/',
                destination: '/foxxie'
            }
        ];
    }
};

module.exports = nextConfig;
