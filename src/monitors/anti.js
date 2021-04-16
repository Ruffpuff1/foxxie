const { antiInvitesEnabled } = require('../../lib/settings')
const { moderationCommandWarn } = require('../../lib/structures/database/moderationCommand')
module.exports.antiInvites = async (message) => {
    let anti_inv = await antiInvitesEnabled(message)

    if (!message.guild) return
    if (anti_inv?.antiInvites == false || anti_inv == null) return
    if (message.author.id === message.guild.ownerID) return
    if (message.member.hasPermission('ADMINISTRATOR')) return;
    
    inviteRegex = /(https?:\/\/)?(.*?@)?(www\.)?((discord|invite)\.(gg|li|me|io)|discord(app)?\.com\/invite)\/(\s)?.+/ui;
    //'https://discord.gg/kAbuCpfnCk' - deletes any discord server invite // 761512748898844702

    if (inviteRegex.test(message.content) && message.guild.id === '761512748898844702') {

        let reason = 'Server invite link'
        moderationCommandWarn(message, reason, message.member, message.guild.me)
        message.delete()
    }
    // For other servers
    if (inviteRegex.test(message.content) && message.guild.id !== '761512748898844702') return message.delete();
}