const { modStatsAdd } =  require('../src/tasks/stats')
const Discord = require('discord.js')
const moment = require('moment')

const embed = new Discord.MessageEmbed()

module.exports.moderationLog = async (msg, target, reason, action, additional) => {

    modStatsAdd(msg, 'vckick', 1)
    let settings = await msg.guild.settings.get(msg.guild)
    if (!settings) return;

    let date = moment(msg.createdTimestamp).format('llll')

    embed
        .setTitle(`${action} ${target.tag}`)
        .setColor(msg.guild.me.displayColor)
        .setTimestamp()
        .addField(`**${action} User**`, `<@${target.id}> (ID: ${target.id})`, true)
        .addField('**Moderator**', `<@${msg.member.user.id}> (ID: ${msg.member.user.id})`, true)
        .addField('\u200B', '\u200B', true)
        .addField('**Reason**', reason, true)
        .addField('**Location**', msg.channel, true)
        .addField('**Date / Time**', date, true)

    const channel = msg.guild.channels.cache.get(settings.modChannel);
    if (channel) channel.send(embed)
}