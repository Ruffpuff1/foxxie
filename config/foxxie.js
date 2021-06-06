const { version } = require('../package.json')

module.exports = {
    prefix: {
        production: '.',
        development: 'f.'
    },
    version,
    owners: ['486396074282450946', '749845359689465977', '754598258742919178'],
    commands: '100',
    aliases: '207',
    communityServer: 'http://ruff.cafe/community',
    supportServer: 'http://foxxie.ruff.cafe/support',
    inviteURL: 'http://foxxie.ruff.cafe/invite',
    topggURL: 'http://foxxie.ruff.cafe/vote',
    shards: 'auto', 
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
}