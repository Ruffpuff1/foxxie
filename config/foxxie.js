const { version } = require('../package.json')

module.exports = {
    prefix: {
        production: '\\.',
        development: 'a\\.'
    },
    version,
    development: true,
    language: 'en-US',
    owners: ['486396074282450946', '749845359689465977', '754598258742919178'],
    contributors: new Set(),
    bans: new Set(),
    communityServer: 'http://ruff.cafe/community',
    supportServer: 'http://foxxie.ruff.cafe/support',
    inviteURL: 'http://foxxie.ruff.cafe/invite',
    topggURL: 'http://foxxie.ruff.cafe/vote',
    shards: 'auto',
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    typing: false,
    status: [
        { name: `🏳️‍🌈  Happy pride month!`, type: 'PLAYING' },
        { name: `with trans rights!`, type: 'PLAYING' }
    ]
}