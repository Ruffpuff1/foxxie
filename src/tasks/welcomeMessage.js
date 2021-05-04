const { serverSettings } = require('../../lib/settings')
const moment = require('moment')
module.exports.welcomeMsg = async (member) => {
    let welcomeChannel = await serverSettings(member)
    if (!welcomeChannel || !welcomeChannel.welcomeChannel) return; 

    welChn = member.guild.channels.cache.get(welcomeChannel.welcomeChannel)
    if (welcomeChannel.welcomeMessage == null) return welChn.send(`**<@${member.id}>** just joined the server!`)

    _fillTemplate = async (template, member) => {
        return template
            .replace(/{(member|user|mention)}/gi, member.toString())
            .replace(/{(name|username)}/gi, member.user.username)
            .replace(/{tag}/gi, member.user.tag)
            .replace(/{(discrim|discriminator)}/gi, member.user.discriminator)
            .replace(/{(guild|server)}/gi, member.guild.name)
            .replace(/{(membercount|count)}/gi, member.guild.memberCount)
            .replace(/{(created|createdat)}/gi, moment(member.user.createdAt).format('MMMM Do YYYY'));
    }

    const parsed = await _fillTemplate(welcomeChannel.welcomeMessage, member)

    welChn.send(parsed)
}