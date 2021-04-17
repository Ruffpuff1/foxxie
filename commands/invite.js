const Discord = require('discord.js');
module.exports = {
    name: "invite",
    aliases: ["inv"],
    description: "Invite to Fokushi's server",
    execute(message, args) {
        var user = message.mentions.users.first();
        const invite= ["Invite"]
        var url = invite[Math.floor(Math.random() * invite.length)];
        console.log(url)
        let embed = new Discord.MessageEmbed();
        embed.setColor('#52a9ff')
        embed.setDescription(`
        **Link to Seaside Restaurant**

        https://discord.gg/K7PdNsbdAx`)
        embed.setTimestamp()
        message.channel.send(embed)
    }
}