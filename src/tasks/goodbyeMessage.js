const moment = require('moment')
module.exports.goodbyeMsg = async (member) => {
    let goodbyeChannel = await member.guild.settings.get();
    if (goodbyeChannel == null) return;
    byeChn = member.guild.channels.cache.get(goodbyeChannel.goodbyeChannel)
    if (!byeChn) return;
    if (goodbyeChannel.goodbyeMessage == null) return byeChn.send(`**${member.user.tag}** just left the server :(`)

    _fillTemplate = async (template, member) => {
        return template
            .replace(/{(name|username)}/gi, member.user.username)
            .replace(/{tag}/gi, member.user.tag)
            .replace(/{(discrim|discriminator)}/gi, member.user.discriminator)
            .replace(/{(guild|server)}/gi, member.guild.name)
            .replace(/{(membercount|count)}/gi, member.guild.memberCount)
            .replace(/{(joined|joinedat)}/gi, moment(member.joinedAt).format('MMMM Do YYYY'));
    }

    const parsed = await _fillTemplate(goodbyeChannel.goodbyeMessage, member)

    byeChn.send(parsed);
}