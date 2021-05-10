const { moderationCommandWarn } = require('../../lib/structures/ModerationCommand')
const { regexes: { discord: { invite } } } = require('../../lib/util/constants')
module.exports = {
    name: 'anti',
    execute: async(message) => {
        let anti_inv = await message.guild.settings.get('antiInvites')

        if (!message.guild) return
        if (!anti_inv) return
        if (anti_inv == false) return
        if (message.author.id === message.guild.ownerID) return

        if (message.member == null) return;
        if (message.member.hasPermission('ADMINISTRATOR')) return;
        if (message.member.roles.highest.position > message.guild.me.roles.highest.position) return;

        //'https://discord.gg/kAbuCpfnCk' - deletes any discord server invite // 761512748898844702

        if (invite.test(message.content)) {

            if (message.guild.id === '761512748898844702') 
            moderationCommandWarn(message, 'Server invite link', message.member, message.guild.me)//auto warns in TCS
            message.delete()
        }
    }
}