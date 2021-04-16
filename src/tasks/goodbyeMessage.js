const { getGoodbyeChannel, getGoodbyeMessage } = require('../../lib/settings')
module.exports.goodbyeMsg = async (member) => {
    let goodbyeChannel = await getGoodbyeChannel(member.guild)
    let byemsg = await getGoodbyeMessage(member)
    if (!goodbyeChannel) return;

    byeChn = member.guild.channels.cache.get(goodbyeChannel?.goodbyeChannel)
    if (!byemsg) return byeChn.send(`**${member.user.tag}** just left the server :(`)
    byeChn.send(byemsg.goodbyeMessage);
}