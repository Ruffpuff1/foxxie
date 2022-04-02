/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['cdn.ruffpuff.dev']
    },
    async rewrites() {
        return [{ source: '/users/:id*', destination: '/api/users/:id*' }];
    }
};

module.exports = nextConfig;
