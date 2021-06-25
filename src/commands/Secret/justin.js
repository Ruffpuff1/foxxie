const { MessageEmbed } = require('discord.js');
const { Command } = require('foxxie');
const { justinName } = require('~/lib/util/constants');

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

        const user = this.client.users.cache.get('282321212766552065');
        msg.delete();

        const embed = new MessageEmbed()
            .setColor(msg.guild.me.displayColor)
            .setThumbnail(user.displayAvatarURL({ dynamic: true}))
            .setDescription(msg.language.get('COMMAND_JUSTIN_NAME', user.toString(), justinName))

        const message = await msg.channel.send(embed);
        return message.delete({ timeout: 300000 });
    }
}