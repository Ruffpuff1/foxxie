const req = require('@aero/centra');
const { MessageEmbed } = require('discord.js');
const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'cat',
            aliases: ['kitty', 'pussy'],
            description: language => language.get('COMMAND_CAT_DESCRIPTION'),
            requiredPermissions: ['EMBED_LINKS'],
            category: 'fun'
        })
    }

    async run(msg) {

        const loading = await msg.responder.loading();
        const [{ url }] = await req(`https://api.thecatapi.com/v1/images/search`)
            .header('Accept', 'application/json')
            .json()
            .catch(() => null);

        const embed = new MessageEmbed()
            .setTitle(msg.language.get("COMMAND_CAT_TITLE"))
            .setColor(msg.guild.me.displayColor)
            .setImage(url)
            .setFooter(msg.language.get("COMMAND_CAT_FOOTER"))
            .setTimestamp()

        msg.channel.send(embed);
        return loading.delete();
    }
}