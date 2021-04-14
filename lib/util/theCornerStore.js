const { timezone, format, clockchannel, updateinterval } = require('../../lib/config');
const moment = require('moment')
const tz = require('moment-timezone')
module.exports.mimuPick = (message) => {
    if (message.guild.id === '761512748898844702' && message.content.toLowerCase() === '.pick')
    return message.channel.send('**Darlin\'** I\'m flattered you want to pick me but again mimu\'s prefix is \`?\`.')
}

module.exports.memberCount = (client) => {
    const updateMembers = (guild) => {
        const channel = client.channels.cache.get('812226377717645332')
        if (channel == undefined) return
        channel.setName(`🥤 ┇𝐌𝐞𝐦𝐛𝐞𝐫𝐬・ ${guild.memberCount.toLocaleString()}`)
    }

    client.on('guildMemberAdd', (member) => updateMembers(member.guild))
    client.on('guildMemberRemove', (member) => updateMembers(member.guild))

    const guild = client.guilds.cache.get('761512748898844702')

    updateMembers(guild)
}

module.exports.clock = (client) => {
    const timeNow = moment().tz(timezone).format(format)
    const clockChannel = client.channels.cache.get(clockchannel)

    if (clockChannel === undefined) return

    clockChannel.edit({ name: `🏪 ┋𝐒𝐭𝐨𝐫𝐞 𝐓𝐢𝐦𝐞・${timeNow}` }, 'Clock update')
    .catch(console.error)

    setInterval(() => {
        const timeNowUpdate = moment().tz(timezone).format(format)
        clockChannel.edit({ name: `🏪 ┋𝐒𝐭𝐨𝐫𝐞 𝐓𝐢𝐦𝐞・${timeNowUpdate}` }, 'Clock update')
        .catch(console.error)

    }, updateinterval)
}