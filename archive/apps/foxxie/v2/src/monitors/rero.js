module.exports.rero = async (reaction, user, act) => {

    const member = reaction.message.guild ? await reaction.message.guild.members.fetch(user).catch(() => null) : null;

    // Asteri Announcement ping rero
    if (reaction.emoji.id === '824751934539825232' && reaction.message.id === '833960900477714462') {
        if (member) {
            let announcementPing = reaction.message.guild.roles.cache.find(r => r.id === '833964155849277461')
            if (act === 'add') member.roles.add(announcementPing)
            if (act === 'remove') member.roles.remove(announcementPing)
        }
    }
}