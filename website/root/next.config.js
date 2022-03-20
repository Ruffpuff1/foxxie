/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
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
