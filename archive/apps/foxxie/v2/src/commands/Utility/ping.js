const Discord = require('discord.js');
module.exports = {
    name: 'ping',
    aliases: ['pong', 'latency', 'lagg', 'lag'],
    usage: 'ping',
    category: 'utility',
    execute(lang, message) {
        message.channel.send(lang.COMMAND_PING)
            .then(resultMessage => {
                const ping = resultMessage.createdTimestamp - message.createdTimestamp
                const pingEmbed = new Discord.MessageEmbed()
                    .setColor(message.guild.me.displayColor)
                    .setFooter(lang.COMMAND_PING_FOOTER)
                    .addFields(
                        {
                            name: lang.COMMAND_PING_DISCORD,
                            value: `\`\`\`${ping} ms\`\`\``,
                            inline: true
                        },
                        {
                            name: lang.COMMAND_PING_NETWORK,
                            value: `\`\`\`${message.client.ws.ping} ms\`\`\``,
                            inline: true
                        }
                    )

                resultMessage.edit(':ping_pong: **Pong**', {embed: pingEmbed})
            })
    },
}