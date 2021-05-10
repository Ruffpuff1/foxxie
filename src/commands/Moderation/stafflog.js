const { emojis: { perms: { notSpecified } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'stafflog',
    aliases: ['stafflogs'],
    usage: 'fox stafflog (member|userId)',
    permissions: 'MANAGE_MESSAGES',
    category: 'moderation',
    execute: async(props) => {

        let { message, args, lang, language } = props

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const loading = await message.channel.send(language.get("MESSAGE_LOADING", lang));

        let desc1 = []
        let desc2 = []
        let servers = await member.user.settings.get('servers')
        if (!servers[0][message.guild.id]) { loading.delete(); return message.channel.send(language.get('COMMAND_STAFFLOG_NONE', lang)) }
        let modCounts = servers[0][message.guild.id].modStats
        if (!modCounts) { loading.delete(); return message.channel.send(language.get('COMMAND_STAFFLOG_NONE', lang)) }

        if (modCounts.ban) desc1.push(language.get('COMMAND_STAFFLOG_BAN', lang, modCounts.ban))
        if (modCounts.kick) desc1.push(language.get('COMMAND_STAFFLOG_KICK', lang, modCounts.kick))
        if (modCounts.warn) desc1.push(language.get('COMMAND_STAFFLOG_WARN', lang, modCounts.warn))
        if (modCounts.jail) desc1.push(language.get('COMMAND_STAFFLOG_JAIL', lang, modCounts.jail))
        if (modCounts.mute) desc1.push(language.get('COMMAND_STAFFLOG_MUTE'))

        if (modCounts.slowmode) desc2.push(language.get('COMMAND_STAFFLOG_SLOWMODE', lang, modCounts.slowmode))
        if (modCounts.lock) desc2.push(language.get('COMMAND_STAFFLOG_LOCK', lang, modCounts.lock))
        if (modCounts.unlock) desc2.push(language.get('COMMAND_STAFFLOG_UNLOCK', lang, modCounts.unlock))
        if (modCounts.nuke) desc2.push(language.get('COMMAND_STAFFLOG_NUKE', lang, modCounts.nuke))
        if (modCounts.purge) desc2.push(language.get('COMMAND_STAFFLOG_PURGE', lang, modCounts.purge, modCounts.purgeTotal))
       
        let arr = [
            desc1.filter(i => !!i).join('\n'),
            desc2.filter(i => !!i).join('\n')
        ].filter(i => !!i).join('\n\n');

        loading.delete()
        message.channel.send(`${arr.length ? language.get('COMMAND_STAFFLOG_TITLE', lang, member.user.tag) : language.get('COMMAND_STAFFLOG_NONE', lang) }${arr}`)
    } 
}