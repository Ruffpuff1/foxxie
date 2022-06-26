/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    i18n: {
        defaultLocale: 'en_us',
        locales: ['en_us', 'es_mx', 'fr_fr']
    },
    trailingSlash: true,
    images: {
        domains: ['cdn.reeseharlak.com']
    },
    redirects: async () => {
        return [
            {
                source: '/twitter',
                destination: 'https://twitter.com/reeseharlak',
                permanent: false
            },
            {
                source: '/github',
                destination: 'https://github.com/Ruffpuff1',
                permanent: false
            },
            {
                source: '/about',
                destination: 'https://about.ruffpuff.dev',
                permanent: false
            },
            {
                source: '/contact',
                destination: 'https://about.ruffpuff.dev/contact-me',
                permanent: false
            },
            {
                source: '/projects',
                destination: 'https://about.ruffpuff.dev/projects',
                permanent: false
            },
            {
                source: '/community',
                destination: 'https://discord.gg/ZAZ4yRezC7',
                permanent: false
            },
            {
                source: '/kofi',
                destination: 'https://ko-fi.com/ruffpuff',
                permanent: false
            },
            {
                source: '/newtab',
                destination: 'https://newtab.ruffpuff.dev',
                permanent: false
            },
            {
                source: '/contact',
                destination: 'https://about.ruffpuff.dev/contact-me',
                permanent: false
            },
            {
                source: '/cdn',
                destination: 'https://cdn.ruffpuff.dev',
                permanent: false
            },
            {
                source: '/kiko',
                destination: 'https://kiko.gg',
                permanent: false
            },
            {
                source: '/celestia',
                destination: 'https://celestia.ruffpuff.dev',
                permanent: false
            }
        ];
    }
};

module.exports = nextConfig;
