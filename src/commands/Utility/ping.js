const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    aliases: ['pong', 'latency', 'lagg', 'lag'],
    usage: 'fox ping',
    category: 'utility',
    async execute({ lang, message, language }) {

        const msg = await language.send('COMMAND_PING', lang);
        const ping = msg.createdTimestamp - message.createdTimestamp;

        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setFooter(language.get('COMMAND_PING_FOOTER', lang))
            .addField(language.get('COMMAND_PING_DISCORD', lang), `\`\`\`${ping} ms\`\`\``, true)
            .addField(language.get('COMMAND_PING_NETWORK', lang), `\`\`\`${message.client.ws.ping} ms\`\`\``, true)

        msg.edit(`:ping_pong: **${language.get('COMMAND_PING_PONG', lang)}**`, { embed });
    }
}