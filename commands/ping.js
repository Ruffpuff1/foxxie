const Command = require('../command')
const { MessageEmbed } = require('discord.js')

class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: 'Latency and API response times.',
            usage: 'ping',
            aliases: ['pong']
        });
    }

    async run (message, args) {
        try {
            const msg = await message.channel.send("Ping?");

            const embed = new MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setFooter('Ping may be high due to Discord breaking, don\'t mind that.')
                .addField('Discord Latency', `\`\`\`${msg.createdTimestamp - message.createdTimestamp} ms\`\`\``, true)
                .addField('Network Latency', `\`\`\`${Math.round(this.client.ws.ping)} ms\`\`\``, true)

            msg.edit('**:ping_pong: Pong**', {embed: embed})
            } catch (e) {
                console.log(e);
            }
        }
    }

module.exports = Ping;