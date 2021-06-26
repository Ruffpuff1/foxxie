const { version } = require('~/package.json');
const host = require('os').hostname();

module.exports = {
    prefix: {
        production: '\\.',
        development: host === 'Foxxie' ? 'd\\.' : 'a\\.'
    },
    version,
    language: 'en-US',
    owners: ['486396074282450946', '749845359689465977', '754598258742919178'],
    contributors: new Set(),
    bans: new Set(),
    communityServer: 'http://ruff.cafe/community',
    supportServer: 'http://foxxie.ruff.cafe/support',
    inviteURL: 'http://foxxie.ruff.cafe/invite',
    topggURL: 'https://is.gd/foxxie_topgg',
    lgbtURL: 'https://api.ravy.lgbt',
    shards: 'auto',
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    typing: true,
    status: [
        { name: `🏳️‍🌈  Happy pride month!`, type: 'PLAYING' },
        { name: `with trans rights!`, type: 'PLAYING' }
    ]
}