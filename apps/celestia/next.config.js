/* eslint-disable */
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    trailingSlash: true,
    images: {
        domains: ['rsehrk.com', 'lh3.googleusercontent.com']
    }
};

module.exports = withPlugins([withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })], nextConfig);
