const redirects = require('./redirects');
const path = require('path');
const loaderUtils = require('loader-utils');

// based on https://github.com/vercel/next.js/blob/0af3b526408bae26d6b3f8cab75c4229998bf7cb/packages/next/build/webpack/config/blocks/css/loaders/getCssModuleLocalIdent.ts
const hashOnlyIdent = (context, _, exportName) =>
    loaderUtils
        .getHashDigest(
            Buffer.from(`filePath:${path.relative(context.rootContext, context.resourcePath).replace(/\\+/g, '/')}#className:${exportName}`),
            'md4',
            'base64',
            7
        )
        .replace(/^(-?\d|--)/, 'd')
        .replace(/\+/g, 'p')
        .replace(/\//g, '\\/');

/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config, { dev }) {
        const rules = config.module.rules.find(rule => typeof rule.oneOf === 'object').oneOf.filter(rule => Array.isArray(rule.use));

        if (!dev)
            rules.forEach(rule => {
                rule.use.forEach(moduleLoader => {
                    if (moduleLoader.loader?.includes('css-loader') && !moduleLoader.loader?.includes('postcss-loader'))
                        moduleLoader.options.modules.getLocalIdent = hashOnlyIdent;

                    // earlier below statements were sufficient:
                    // delete moduleLoader.options.modules.getLocalIdent;
                    // moduleLoader.options.modules.localIdentName = '[hash:base64:6]';
                });
            });

        return config;
    },
    reactStrictMode: true,
    i18n: {
        defaultLocale: 'en_us',
        locales: ['en_us', 'es_mx']
    },
    trailingSlash: true,
    images: {
        domains: ['reese.cafe', 'lh3.googleusercontent.com']
    },
    rewrites: async () => {
        return [
            {
                source: '/images/:slug(.{1,})',
                destination: '/api/cdn/:slug'
            },
            {
                source: '/cdn/:slug(.{1,})',
                destination: '/api/cdn/:slug'
            },
            {
                source: '/arts-and-culture/:path*',
                destination: '/404'
            }
        ];
    },
    redirects: async () => {
        return redirects;
    }
};

module.exports = nextConfig;
