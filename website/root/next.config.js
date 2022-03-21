/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: ['cdn.ruffpuff.dev'],
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
