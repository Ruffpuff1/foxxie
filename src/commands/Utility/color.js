const { Command } = require('foxxie');
const { color } = require('canvacord').Canvas;
const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'color',
            aliases: ['colour', 'c'],
            description: language => language.get('COMMAND_COLOR_DESCRIPTION'),
            usage: '[Hexcode]',
            category: 'utility'
        })
    }

    async run(msg, [hex]) {

        if (!hex || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) return msg.responder.error('COMMAND_COLOR_NOCOLOR');
        const loading = await msg.responder.loading();
        const image = await color(hex);

        const embed = new MessageEmbed()
            .setTitle(msg.language.get('COMMAND_COLOR', hex))
            .setColor(hex)
            .attachFiles([new MessageAttachment(image, 'color.png')])
            .setImage('attachment://color.png')

        msg.channel.send(embed);
        return loading.delete();
    }
}