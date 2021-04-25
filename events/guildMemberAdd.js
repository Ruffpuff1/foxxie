const config = require('../config.json')
const Discord = require('discord.js')
module.exports = {
    name: 'guildMemberAdd',
    execute(member, bot) {

        function welcomeMessage (channel) {
            const welcomeChannel = bot.channels.cache.get(channel)
            const embed = new Discord.MessageEmbed()
                .setColor('#ff8940')
                .setTitle(`A new member appeared!`)
                .setDescription(`Why, hello there, ${member} the cutie! Welcome to our little tropical paradise, located out in the middle of the ocean, Seaside Restaurant! You're our ${member.guild.memberCount}th member! Here’s some places you might want to visit first! Be sure to give the <#822189857593098310> channel a read, so we can keep peace on our little island. The <#822468803182329886> channel is where you can go to pick up some shiny roles for yourself. You can go to <#822454757151080489> to see our list of server staff. And when you’re finally ready, <#822193883726741565> is where you can go to meet the rest of the server’s friendly faces! Enjoy your stay! ^^ `)
                .setImage(`https://media.discordapp.net/attachments/827515349959835708/829619448972312576/unknown.png`)
                .setThumbnail(`https://images-ext-2.discordapp.net/external/5u_By7TVoV9u2SM7ujLOyVDELf-koOmg0AOvLYJq4_s/%3Fsize%3D4096/https/cdn.discordapp.com/icons/822187156214513734/098cbdf8e61a55d18e973afb4e2e292b.png`)
                .setTimestamp()
                .setFooter('Give them a warn welcome in general! | Joined ');

            welcomeChannel.send('A new member joined! Give them a warm welcome please <@&829752715826823268>!', {embed:embed})
        }

        function welcomeMessageOk(channel) {
            const welcomeChannel = bot.channels.cache.get(channel)
            const embed = new Discord.MessageEmbed()
                .setColor('#ff8940')
                .setTitle(`A new member appeared!`)
                .setDescription(`:0 ${member} joined!! hiii`)
                .setTimestamp()
                .setFooter('noice');

            welcomeChannel.send('A new member joined! Give them a warm welcome please <@&829752715826823268>!', {embed:embed})
        }
        // welcome channel id goes in the string of each function call right below here
        if (oldMessage.guild.id === config.servers.seasideRest) welcomeMessage("822189403060830279")
        if (oldMessage.guild.id === config.servers.ok) welcomeMessageOk("831180747008114688")
        if (member.guild.id === config.servers.fox) welcomeMessage("822414098439864360")
        if (member.guild.id !== config.servers.codes) welcomeMessage("790522490903330838")
    }
}