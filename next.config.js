const redirects = require('./redirects');
const path = require('path');
const loaderUtils = require('loader-utils');
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer');

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
                });
            });

        return config;
    },
    reactStrictMode: true,
    trailingSlash: true,
    images: {
        domains: ['reese.cafe', 'lh3.googleusercontent.com']
    },
    rewrites: async () => {
        return [
            {
                source: '/apis/:path*',
                destination: '/api/:path*'
            },
            {
                source: '/images/:slug(.{1,})',
                destination: '/api/cdn/:slug'
            },
            {
                source: '/cdn/:slug(.{1,})',
                destination: '/api/cdn/:slug'
            },
            {
                source: '/intl/en_us',
                destination: '/'
            },
            {
                source: '/intl/en_us/:path*',
                destination: '/:path*'
            },
            {
                source: '/intl/es_mx',
                destination: '/'
            },
            {
                source: '/intl/es_mx/:path*',
                destination: '/:path*'
            }
        ];
    },
    redirects: async () => {
        return redirects;
    }
};

module.exports = withPlugins([withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })], nextConfig);
