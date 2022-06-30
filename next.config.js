/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    i18n: {
        defaultLocale: 'en_us',
        locales: ['en_us', 'es_mx', 'fr_fr']
    },
    trailingSlash: true,
    images: {
        domains: ['cdn.reese.cafe']
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
                destination: 'https://about.reese.cafe',
                permanent: false
            },
            {
                source: '/contact',
                destination: 'https://about.reese.cafe/contact-me',
                permanent: false
            },
            {
                source: '/projects',
                destination: 'https://about.reese.cafe/projects',
                permanent: false
            },
            {
                source: '/community',
                destination: 'https://discord.gg/ZAZ4yRezC7',
                permanent: false
            },
            {
                source: '/community/disboard',
                destination: 'https://disboard.org/server/761512748898844702',
                permanent: false
            },
            {
                source: '/kofi',
                destination: 'https://ko-fi.com/ruffpuff',
                permanent: false
            },
            {
                source: '/newtab',
                destination: 'https://newtab.reese.cafe',
                permanent: false
            },
            {
                source: '/contact',
                destination: 'https://about.reese.cafe/contact-me',
                permanent: false
            },
            {
                source: '/cdn',
                destination: 'https://cdn.reese.cafe',
                permanent: false
            },
            {
                source: '/kiko',
                destination: 'https://kiko.gg',
                permanent: false
            },
            {
                source: '/celestia',
                destination: 'https://developers.reese.cafe/celestia',
                permanent: false
            }
        ];
    }
};

module.exports = nextConfig;
