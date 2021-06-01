const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    aliases: ['pong', 'latency', 'lagg', 'lag'],
    usage: 'fox ping',
    category: 'utility',
    async execute({ message, language }) {

        const msg = await message.responder.success('COMMAND_PING');
        const ping = msg.createdTimestamp - message.createdTimestamp;

        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setFooter(language.get('COMMAND_PING_FOOTER'))
            .addField(language.get('COMMAND_PING_DISCORD'), `\`\`\`${ping} ms\`\`\``, true)
            .addField(language.get('COMMAND_PING_NETWORK'), `\`\`\`${message.client.ws.ping} ms\`\`\``, true)

        msg.edit(`:ping_pong: **${language.get('COMMAND_PING_PONG')}**`, { embed });
    }
}