const { serverSettings } = require('../../lib/settings')
const { moderationCommandWarn } = require('../../lib/structures/ModerationCommand')
module.exports = {
    name: 'anti',
    execute: async(message) => {
    let anti_inv = await serverSettings(message)

    if (!message.guild) return
    if (anti_inv == null) return
    if (anti_inv.antiInvites == false || anti_inv == null) return
    if (message.author.id === message.guild.ownerID) return

    if (message.member == null) return;

    if (message.member.hasPermission('ADMINISTRATOR')) return;
    if (message.member.roles.highest.position > message.guild.me.roles.highest.position) return;
    
    inviteRegex = /(https?:\/\/)?(.*?@)?(www\.)?((discord|invite)\.(gg|li|me|io)|discord(app)?\.com\/invite)\/(\s).+/ui;
    //'https://discord.gg/kAbuCpfnCk' - deletes any discord server invite // 761512748898844702

    if (inviteRegex.test(message.content) && message.guild.id === '761512748898844702') {

        moderationCommandWarn(message, 'Server invite link', message.member, message.guild.me)//auto warns in TCS
        message.delete()
    }
    // For other servers
    if (inviteRegex.test(message.content) && message.guild.id !== '761512748898844702') return message.delete(); // deletes
    }
}