const config = require('../config.json')
const Discord = require('discord.js')
module.exports = {
    name: 'guildMemberRemove',
    execute(member, bot) {

        function goodbyeMessage (channel) {
            const goodbyeChannel = bot.channels.cache.get(channel)
            const Embed = new Discord.MessageEmbed()
                .setColor('#990670')
                .setTitle(`A member continued their journey somewhere else...`)
                .setDescription(`Sadly, ${member} hopped on a boat and sailed far away, back across the ocean. Safe travels! There are ${member.guild.memberCount} customers left, dwelling the island.`)
                .setImage(`https://media.discordapp.net/attachments/829649102333149206/829654630132088842/94a0071504a8b2faf77ae446c56df37a.gif`)
                .setTimestamp()
                .setFooter('We will mourn them in general. | Left ');

            goodbyeChannel.send(Embed)
        }

        function goodbyeMessageOk(channel) {
            const goodbyeChannel = bot.channels.cache.get(channel)
            const Embed = new Discord.MessageEmbed()
                .setColor('#990670')
                .setTitle(`sadness`)
                .setDescription(`sadge ${member} left. There are ${member.guild.memberCount} left :(`)
                .setTimestamp()
                .setFooter('We will mourn them in general. | Left ');

            goodbyeChannel.send(Embed)
        }
        // goodbye channel id goes in the string of each function call right below here
        if (member.guild.id === config.servers.seasideRest) goodbyeMessage("822189403060830279")
        if (member.guild.id === config.servers.ok) goodbyeMessageOk("829649102333149206")
        if (member.guild.id === config.servers.fox) goodbyeMessage("822414098439864360")
        if (member.guild.id === config.servers.codes) goodbyeMessage("790522490903330838")
    }
}
