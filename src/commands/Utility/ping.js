const Discord = require('discord.js');
module.exports = {
    name: 'ping',
    aliases: ['pong', 'latency', 'lagg', 'lag'],
    usage: 'fox ping',
    category: 'utility',
    execute(props) {

        let { lang, message, args } = props;
        message.channel.send(message.guild.language.get('COMMAND_PING', 'en-US'))
            .then(resultMessage => {
                const ping = resultMessage.createdTimestamp - message.createdTimestamp
                const pingEmbed = new Discord.MessageEmbed()
                    .setColor(message.guild.me.displayColor)
                    .setFooter(message.guild.language.get('COMMAND_PING_FOOTER', 'en-US'))
                    .addFields(
                        {
                            name: message.guild.language.get('COMMAND_PING_DISCORD', 'en-US'),
                            value: `\`\`\`${ping} ms\`\`\``,
                            inline: true
                        },
                        {
                            name: message.guild.language.get('COMMAND_PING_NETWORK', 'en-US'),
                            value: `\`\`\`${message.client.ws.ping} ms\`\`\``,
                            inline: true
                        }
                    )

                resultMessage.edit(`:ping_pong: **${message.guild.language.get('COMMAND_PING_PONG', 'en-US')}**`, {embed: pingEmbed})
            })
    },
}