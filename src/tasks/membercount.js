module.exports = client => {
    const updateMembers = guild => {
        const channel = client.channels.cache.get('812226377717645332')
        if (channel == undefined) return
        channel.setName(`🥤 ┇𝐌𝐞𝐦𝐛𝐞𝐫𝐬・ ${guild.memberCount.toLocaleString()}`)
    }

    client.on('guildMemberAdd', (member) => updateMembers(member.guild))
    client.on('guildMemberRemove', (member) => updateMembers(member.guild))

    const guild = client.guilds.cache.get('761512748898844702')

    updateMembers(guild)
}