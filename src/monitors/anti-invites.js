module.exports.anti_invites = (message) => {
    if (message.author.id === message.guild.ownerID) return
    if (message.member.hasPermission('ADMINISTRATOR')) return;
    inviteRegex = /(https?:\/\/)?(.*?@)?(www\.)?((discord|invite)\.(gg|li|me|io)|discord(app)?\.com\/invite)\/(\s)?.+/ui;
    //'https://discord.gg/kAbuCpfnCk' - deletes any discord server invite
    if (inviteRegex.test(message.content)) return message.delete();
}