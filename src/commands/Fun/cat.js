const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'cat',
            aliases: ['kitty', 'pussy'],
            description: language => language.get('COMMAND_CAT_DESCRIPTION'),
            category: 'fun'
        })
    }

    async run(msg) {

        const loading = await msg.responder.loading();
        const img = await axios.get(`https://api.thecatapi.com/v1/images/search`).catch(() => null);

        const embed = new MessageEmbed()
            .setTitle(msg.language.get("COMMAND_CAT_TITLE"))
            .setColor(msg.guild.me.displayColor)
            .setImage(img.data[0].url)
            .setFooter(msg.language.get("COMMAND_CAT_FOOTER"))
            .setTimestamp()

        msg.channel.send(embed);
        return loading.delete();
    }
}