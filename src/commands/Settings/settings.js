const { emojis: { perms: { granted, denied } } } = require('../../../lib/util/constants')
const { getWelcomeChannel, getGuildModChannel, getDisboardChannel, antiInvitesEnabled, getGoodbyeChannel } = require('../../../lib/settings')
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
        let welcomes = await getWelcomeChannel(message.guild)
        let goodbyes = await getGoodbyeChannel(message.guild)
        let modlogs = await getGuildModChannel(message)
        let disboard = await getDisboardChannel(message)
        let anti_inv = await antiInvitesEnabled(message)



        // `${notSpecified} Custom prefix **not enabled**`,
        // `${notSpecified} Language **not enabled**`,
        // `${notSpecified} Bot channel **not enabled**`,
        if (welcomes !== null) desc1.push(`${granted} Welcomes **enabled** (in <#${welcomes?.welcomeChannel}>)`)
        if (goodbyes !== null) desc1.push(`${granted} Goodbyes **enabled** (in <#${goodbyes?.goodbyeChannel}>)`)
        if (modlogs !== null) desc1.push(`${granted} Modlogs **enabled** (in <#${modlogs?.channelId}>)`)
        //`${notSpecified} Message logs **not enabled**`,
        if (disboard !== null) desc1.push(`${granted} Disboard **enabled** (in <#${disboard?.disboardChannel}>)`)

        //`${notSpecified} Ignored channels **none**`,
        //`${notSpecified} Disabled commands **none**`,
        //`${notSpecified} Disabled sections **none**`,
        if (anti_inv !== null) desc2.push(`${granted} Anti invites **enabled**`)

        //`${notSpecified} Blacklisted users **none**`

        let arr = [
            desc1.filter(i => !!i).join('\n'),
            desc2.filter(i => !!i).join('\n')
        ].filter(i => !!i).join('\n\n');

        loading.delete()
        message.channel.send(`${arr.length ? `__Foxxie's settings in **${message.guild.name}**:__\n\n` : `This server currently has **no settings** set.`}${arr}`)
    } 
}