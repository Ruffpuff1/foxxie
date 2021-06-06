const { regexes: { discord: { invite } } } = require('../../lib/util/constants')
module.exports = {
    name: 'anti-invite',
    type: 'message',
    execute: async(message) => {
        
        if (!message.guild || !await message.guild.settings.get('mod.anti.invite') || message.author.id === message.guild.ownerID || !message.member || message.member.hasPermission('ADMINISTRATOR')) return;
        if (message.member.roles.highest.position > message.guild.me.roles.highest.position) return;

        //'https://discord.gg/kAbuCpfnCk' - deletes any discord server invite // 761512748898844702
        if (invite.test(message.content)) {

            if (message.guild.id === '761512748898844702') await message.client.commands.get("warn").executeWarn({ message, reason: "Server Invite Link", target: message.member, moderator: message.guild.me, channel: message.channel })//auto warns in TCS
            message.delete()
        }
    }
}