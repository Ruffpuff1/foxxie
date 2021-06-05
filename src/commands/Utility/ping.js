const Discord = require('discord.js');
const Command = require('../../../lib/structures/Command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ping',
            aliases: ['pong', 'latency', 'lagg', 'lag'],
            description: language => language.get('COMMAND_PING_DESCRIPTION'),
            usage: 'fox ping',
            category: 'utility',
        })
    }

    async run(message) {
                
        const msg = await message.responder.success('COMMAND_PING');
        const ping = msg.createdTimestamp - message.createdTimestamp;

        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.me.displayColor)
            .setFooter(message.language.get('COMMAND_PING_FOOTER'))
            .addField(message.language.get('COMMAND_PING_DISCORD'), `\`\`\`${ping} ms\`\`\``, true)
            .addField(message.language.get('COMMAND_PING_NETWORK'), `\`\`\`${message.client.ws.ping} ms\`\`\``, true)

        return msg.edit(`:ping_pong: **Pong**`, { embed });
    }
}