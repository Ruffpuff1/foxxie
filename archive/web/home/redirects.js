const subdomains = ['newtab'].map(subdomainRedirect);

function subdomainRedirect(key) {
    return {
        source: `/${key}`,
        destination: `https://${key}.rsehrk.com`,
        permanent: false
    };
}

module.exports = [
    ...subdomains,
    {
        source: '/about',
        destination: '/about-me',
        permanent: false
    },
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
        source: '/todo',
        destination: '/cdn?panel=todo',
        permanent: false
    },
    {
        source: '/contact',
        destination: 'https://about.rsehrk.com/contact-me',
        permanent: false
    },
    {
        source: '/projects',
        destination: 'https://rsehrk.com/my-work',
        permanent: false
    },
    {
        source: '/tcs',
        destination: 'https://discord.gg/YAze6hAvEV',
        permanent: false
    },
    {
        source: '/the-corner-store/join',
        destination: 'https://discord.gg/YAze6hAvEV',
        permanent: false
    },
    {
        source: '/the-corner-store/disboard',
        destination: 'https://disboard.org/server/761512748898844702',
        permanent: false
    },
    {
        source: '/kofi',
        destination: 'https://ko-fi.com/ruffpuff',
        permanent: false
    },
    {
        source: '/foxxie',
        destination: '/foxxie/about',
        permanent: false
    }
];