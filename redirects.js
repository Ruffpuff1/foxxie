const subdomains = ['about', 'apis', 'celestia', 'cdn', 'developers', 'newtab'].map(subdomainRedirect);

function subdomainRedirect(key) {
    return {
        source: `/${key}`,
        destination: `https://${key}.reese.cafe`,
        permanent: false
    };
}

module.exports = [
    ...subdomains,
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
    }
];
