const { serverSettings } = require('../../lib/settings')
module.exports.welcomeMsg = async (member) => {
    let welcomeChannel = await serverSettings(member)
    if (!welcomeChannel || !welcomeChannel.welcomeChannel) return; 

    welChn = member.guild.channels.cache.get(welcomeChannel.welcomeChannel)
    if (welcomeChannel.welcomeMessage == null) return welChn.send(`**<@${member.id}>** just joined the server!`)
    welChn.send(welcomeChannel.welcomeMessage)
}