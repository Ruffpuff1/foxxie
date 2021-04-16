const { emojis: { perms: { granted, denied, notSpecified } } } = require('../../../lib/util/constants')
const { getModCount } = require('../../tasks/modCountAdd')
module.exports = {
    name: 'stafflog',
    aliases: ['sl', 'stafflogs'],
    usage: 'fox stafflog (member)',
    permissions: 'MANAGE_MESSAGES',
    category: 'moderation',
    execute: async(lang, message, args) => {

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const loading = await message.channel.send(lang.COMMAND_MESSAGE_LOADING);

        let desc1 = []
        let desc2 = []
        let modCounts = await getModCount(message, member)

        if (modCounts != null && modCounts?.bans != null) desc1.push(`${notSpecified} Issued ${modCounts?.bans?.toLocaleString()} **ban${modCounts?.bans>1?`s`:``}**`)
        if (modCounts != null && modCounts?.kicks != null) desc1.push(`${notSpecified} Issued ${modCounts?.kicks?.toLocaleString()} **kick${modCounts?.kicks>1?`s`:``}**`)
        if (modCounts != null && modCounts?.warns != null) desc1.push(`${notSpecified} Issued ${modCounts?.warns?.toLocaleString()} **warn${modCounts?.warns>1?`s`:``}**`)
        if (modCounts != null && modCounts?.jails != null) desc1.push(`${notSpecified} Issued ${modCounts?.jails?.toLocaleString()} **jail${modCounts?.jails>1?`s`:``}**`)
        if (modCounts != null && modCounts?.mutes != null) desc1.push(`${notSpecified} Issued ${modCounts?.mutes?.toLocaleString()} **mute${modCounts?.mutes>1?`s`:``}**`)

        if (modCounts != null && modCounts?.slowmodes != null) desc2.push(`${notSpecified} Performed ${modCounts?.slowmodes?.toLocaleString()} **slowmode${modCounts?.slowmodes>1?`s`:``}**`)
        if (modCounts != null && modCounts?.locks != null) desc2.push(`${notSpecified} Performed ${modCounts?.locks?.toLocaleString()} **lock${modCounts?.locks>1?`s`:``}**`)
        if (modCounts != null && modCounts?.unlocks != null) desc2.push(`${notSpecified} Performed ${modCounts?.unlocks?.toLocaleString()} **unlock${modCounts?.unlocks>1?`s`:``}**`)
        if (modCounts != null && modCounts?.nukes != null) desc2.push(`${notSpecified} Performed ${modCounts?.nukes?.toLocaleString()} **nuke${modCounts?.nukes>1?`s`:``}**`)
        if (modCounts != null && modCounts?.purges != null) desc2.push(`${notSpecified} Performed ${modCounts?.purges?.toLocaleString()} **purge${modCounts?.purges>1?`s`:``}** (**${modCounts?.purgeTotal.toLocaleString()}** message${modCounts?.purgeTotal>1?`s`:``})`)
       
        let arr = [
            desc1.filter(i => !!i).join('\n'),
            desc2.filter(i => !!i).join('\n')
        ].filter(i => !!i).join('\n\n');

        loading.delete()
        message.channel.send(`${arr.length ? `__Moderation logs for **${member.user.tag}**:__\n\n` : `This user has **not** performed any moderation actions in this server.`}${arr}`)
    } 
}