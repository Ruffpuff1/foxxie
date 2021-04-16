const { getWelcomeChannel, getWelcomeMessage } = require('../../lib/settings')
module.exports.welcomeMsg = async (member) => {
    let welcomeChannel = await getWelcomeChannel(member.guild)
    let welmsg = await getWelcomeMessage(member)
    if (!welcomeChannel) return; 

    welChn = member.guild.channels.cache.get(welcomeChannel?.welcomeChannel)
    if (!welmsg) return welChn.send(`**<@${member.id}>** just joined the server!`)
    welChn.send(welmsg.welcomeMessage)
}