const Discord = require('discord.js');
module.exports = {
    name: 'ping',
    aliases: ['pong', 'latency', 'lagg', 'lag'],
    usage: 'fox ping',
    category: 'utility',
    execute(props) {

        let { lang, message, language } = props;
        language.send('COMMAND_PING', lang)
            .then(resultMessage => {
                const ping = resultMessage.createdTimestamp - message.createdTimestamp
                const pingEmbed = new Discord.MessageEmbed()
                    .setColor(message.guild.me.displayColor)
                    .setFooter(language.get('COMMAND_PING_FOOTER', lang))
                    .addFields(
                        {
                            name: language.get('COMMAND_PING_DISCORD', lang),
                            value: `\`\`\`${ping} ms\`\`\``,
                            inline: true
                        },
                        {
                            name: language.get('COMMAND_PING_NETWORK', lang),
                            value: `\`\`\`${message.client.ws.ping} ms\`\`\``,
                            inline: true
                        }
                    )

                resultMessage.edit(`:ping_pong: **${language.get('COMMAND_PING_PONG', lang)}**`, {embed: pingEmbed})
            })
    },
}