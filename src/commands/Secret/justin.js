const { MessageEmbed } = require('discord.js');
const Command = require('../../../lib/structures/Command');
const { justinName } = require('../../../lib/util/constants');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'justin',
            aliases: ['j', 'beaver'],
            description: language => language.get('COMMAND_JUSTIN_DESCRIPTION'),
            category: 'secret'
        })
    }

    async run(msg) {

        user = this.client.users.cache.get('282321212766552065');
        msg.delete();

        const embed = new MessageEmbed()
            .setColor(msg.guild.me.displayColor)
            .setThumbnail(user.displayAvatarURL({ dynamic: true}))
            .setDescription(`**Here is the full name of ${user.toString()}**:\n*${justinName}*`)

        const message = await msg.channel.send(embed);
        return message.delete({ timeout: 300000 });
    }
}