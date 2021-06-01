const { emojis: { } } = require('../../../lib/util/constants')
module.exports = {
    name: 'stafflog',
    aliases: ['stafflogs'],
    usage: 'fox stafflog (member|userId)',
    permissions: 'MANAGE_MESSAGES',
    category: 'moderation',
    execute: async(props) => {

        let { message, args, language } = props

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const loading = await message.responder.loading();

        let desc1 = []
        let desc2 = []
        let modCounts = await member.user.settings.get(`servers.${message.guild.id}.modStats`)
        if (!modCounts) { loading.delete(); return message.responder.error('COMMAND_STAFFLOG_NONE')}

        if (modCounts.ban) desc1.push(language.get('COMMAND_STAFFLOG_BAN', modCounts.ban))
        if (modCounts.kick) desc1.push(language.get('COMMAND_STAFFLOG_KICK', modCounts.kick))
        if (modCounts.warn) desc1.push(language.get('COMMAND_STAFFLOG_WARN', modCounts.warn))
        if (modCounts.jail) desc1.push(language.get('COMMAND_STAFFLOG_JAIL', modCounts.jail))
        if (modCounts.mute) desc1.push(language.get('COMMAND_STAFFLOG_MUTE', modCounts.mute))

        if (modCounts.slowmode) desc2.push(language.get('COMMAND_STAFFLOG_SLOWMODE', modCounts.slowmode))
        if (modCounts.lock) desc2.push(language.get('COMMAND_STAFFLOG_LOCK', modCounts.lock))
        if (modCounts.unlock) desc2.push(language.get('COMMAND_STAFFLOG_UNLOCK', modCounts.unlock))
        if (modCounts.nuke) desc2.push(language.get('COMMAND_STAFFLOG_NUKE', modCounts.nuke))
        if (modCounts.purge) desc2.push(language.get('COMMAND_STAFFLOG_PURGE', modCounts.purge, modCounts.purgeTotal))
       
        let arr = [
            desc1.filter(i => !!i).join('\n'),
            desc2.filter(i => !!i).join('\n')
        ].filter(i => !!i).join('\n\n');

        loading.delete()
        message.channel.send(`${arr.length ? language.get('COMMAND_STAFFLOG_TITLE', member.user.tag) : language.get('COMMAND_STAFFLOG_NONE') }${arr}`)
    } 
}