const req = require('@aero/centra');
const Discord = require('discord.js');
const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'dog',
            aliases: ['puppy'],
            description: language => language.get('COMMAND_DOG_DESCRIPTION'),
            category: 'fun'
        })
    }

    async run(msg) {

        const loading = await msg.responder.loading();
        const { message } = await req(`https://dog.ceo/api/breeds/image/random`)
            .header('Accept', 'application/json')
            .json()
            .catch(() => null);

        const embed = new Discord.MessageEmbed()
            .setTitle(msg.language.get("COMMAND_DOG_TITLE"))
            .setColor(msg.guild.me.displayColor)
            .setImage(message)
            .setFooter(msg.language.get("COMMAND_DOG_FOOTER"))
            .setTimestamp()

        msg.channel.send(embed);
        return loading.delete();
    }
}