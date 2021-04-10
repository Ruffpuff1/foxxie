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
        **Fokushi's server link.**
        
         please do keep in mind that Fokushi is still a new and improving bot so its not perfect! my developer is working hard to add everything! please let <@814539604879081532> know if you have any suggestions.

        Server link: https://discord.gg/Wh9gbFfjhD`)
        embed.setTimestamp()
        message.channel.send(embed)
    }
}