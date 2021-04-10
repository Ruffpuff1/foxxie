const Discord = require('discord.js');

module.exports = {
    name: 'embed',
    aliases: ['embeded', 'send'],
    description: 'Lets you tell me to say something in an embed.',
    usage: '[message]',
    guildOnly: false,
    permissions: 'MANAGE_MESSAGES',
    execute(message, args) {
        message.delete();
        let text = args.slice(0).join(' ');
        if (!text) return;
        let Embed = new Discord.MessageEmbed()
        Embed.setDescription(`${text}`)
        Embed.setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        Embed.setTimestamp()
        Embed.setColor(`#2f008c`);
        message.channel.send(Embed)
    }
};