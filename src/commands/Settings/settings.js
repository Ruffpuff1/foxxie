const { emojis: { perms: { granted, denied } } } = require('../../../lib/util/constants')
const { serverSettings } = require('../../../lib/settings')
module.exports = {
    name: 'settings',
    aliases: ['set', 'setting'],
    usage: 'fox settings',
    permissions: 'MANAGE_MESSAGES',
    category: 'settings',
    execute: async(lang, message, args) => {

        const loading = await message.channel.send(lang.COMMAND_MESSAGE_LOADING);

        let desc1 = []
        let desc2 = []
        let desc3 = []
        let settings = await serverSettings(message)

        let blk = []
        if (settings != null && settings.blockedUsers != null) for (let user of settings.blockedUsers){
            let u = message.guild.members.cache.get(user[0])
            blk.push(`**${u.user.tag}**`)
        }
      
        if (settings != null && settings.prefix != null) desc1.push(`${granted} Prefix **enabled** (\`${settings.prefix}\`)`)
        // `${notSpecified} Language **not enabled**`,
        if (settings != null && settings.welcomeChannel != null) desc1.push(`${granted} Welcomes **enabled** (in <#${settings.welcomeChannel}>)`)
        if (settings != null && settings.goodbyeChannel != null) desc1.push(`${granted} Goodbyes **enabled** (in <#${settings.goodbyeChannel}>)`)
        if (settings != null && settings.modChannel != null) desc1.push(`${granted} Modlogs **enabled** (in <#${settings.modChannel}>)`)
        if (settings != null && settings.editChannel != null) desc1.push(`${granted} Edit logging **enabled** (in <#${settings.editChannel}>)`)
        if (settings != null && settings.deleteChannel != null) desc1.push(`${granted} Delete logging **enabled** (in <#${settings.deleteChannel}>)`)
        if (settings != null && settings.disboardChannel != null) desc1.push(`${granted} Disboard **enabled** (in <#${settings.disboardChannel}>)`)

        if (settings != null && settings.antiInvite != null) desc2.push(`${granted} Anti invites **enabled**`)

        if (settings != null && settings.blockedUsers.length != 0) desc3.push(`${denied} Blacklisted user${settings.blockedUsers.length > 1 ? 's' : ''} **${settings.blockedUsers.length}** (${blk.join(", ")})`)

        let arr = [
            desc1.filter(i => !!i).join('\n'),
            desc2.filter(i => !!i).join('\n'),
            desc3.filter(i => !!i).join('\n')
        ].filter(i => !!i).join('\n\n');

        loading.delete()
        message.channel.send(`${arr.length ? `__Foxxie's settings in **${message.guild.name}**:__\n\n` : `This server currently has **no settings** set.`}${arr}`)
    } 
}