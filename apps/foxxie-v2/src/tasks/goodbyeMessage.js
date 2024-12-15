const { serverSettings } = require('../../lib/settings')
module.exports.goodbyeMsg = async (member) => {
    let goodbyeChannel = await serverSettings(member)
    if (goodbyeChannel == null) return;
    byeChn = member.guild.channels.cache.get(goodbyeChannel.goodbyeChannel)
    if (!byeChn) return;
    if (goodbyeChannel.goodbyeMessage == null) return byeChn.send(`**${member.user.tag}** just left the server :(`)
    byeChn.send(goodbyeChannel.goodbyeMessage);
}