const { antiInvitesEnabled } = require('../../lib/settings')
module.exports.antiInvites = async (message) => {
    let anti_inv = await antiInvitesEnabled(message)

    if (anti_inv?.antiInvites == false || anti_inv == null) return
    if (message.author.id === message.guild.ownerID) return
    if (message.member.hasPermission('ADMINISTRATOR')) return;
    
    inviteRegex = /(https?:\/\/)?(.*?@)?(www\.)?((discord|invite)\.(gg|li|me|io)|discord(app)?\.com\/invite)\/(\s)?.+/ui;
    //'https://discord.gg/kAbuCpfnCk' - deletes any discord server invite
    if (inviteRegex.test(message.content)) return message.delete();
}