const axios = require('axios');
const Discord = require('discord.js');
const Command = require('../../../lib/structures/Command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'dog',
            aliases: ['puppy'],
            description: language => language.get('COMMAND_DOG_DESCRIPTION'),
            usage: 'fox dog',
            category: 'fun'
        })
    }

    async run(msg) {

        const loading = await msg.responder.loading();
        const img = await axios.get(`https://dog.ceo/api/breeds/image/random`).catch(() => null);

        const embed = new Discord.MessageEmbed()
            .setTitle(msg.language.get("COMMAND_DOG_TITLE"))
            .setColor(msg.guild.me.displayColor)
            .setImage(img.data.message)
            .setFooter(msg.language.get("COMMAND_DOG_FOOTER"))
            .setTimestamp()

        msg.channel.send(embed);
        return loading.delete();
    }
}