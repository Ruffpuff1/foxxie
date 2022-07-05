const redirects = require('./redirects');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    i18n: {
        defaultLocale: 'en_us',
        locales: ['en_us', 'es_mx']
    },
    trailingSlash: true,
    images: {
        domains: ['reese.cafe', 'cdn.reese.cafe']
    },
    rewrites: async () => {
        return [
            {
                source: '/images/:slug(.{1,}\\.[A-z]{1,})',
                destination: 'https://cdn.reese.cafe/:slug'
            }
        ];
    },
    redirects: async () => {
        return redirects;
    }
};

module.exports = nextConfig;
