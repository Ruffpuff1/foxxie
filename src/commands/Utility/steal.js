const { MessageEmbed, Message } = require('discord.js');
const { Command } = require('foxxie')

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'steal',
            aliases: ['se', 'yoink', 'take'],
            description: language => language.get('COMMAND_STEAL_DESCRIPTION'),
            usage: '[Emoji] (Name)',
            permissions: 'MANAGE_EMOJIS',
            category: 'utility'
        })
    }

    async run(msg, args) {

        const emoji = msg.emojis.shift();
        if (!emoji) return msg.responder.error('COMMAND_STEAL_NOEMOJI');
        
        const extension = emoji.animated ? '.gif' : '.png';
        let name = args[msg.emojis.length + 1] || emoji.name;
        const url = `https://cdn.discordapp.com/emojis/${emoji.id}${extension}?v=1`;

        const newEmoji = await msg.guild.emojis.create(url, name).catch(() => msg.responder.error('COMMAND_STEAL_MAXEMOJI'));
        if (newEmoji instanceof Message) return;

        const embed = new MessageEmbed()
            .setTitle(msg.language.get('COMMAND_STEAL_SUCCESS', name))
            .setColor(msg.guild.me.displayColor)
            .setDescription(`**ID:** \`${newEmoji.id}\`\n**Raw:** \`<${extension === '.gif' ? 'a' : ''}:${newEmoji.name}:${newEmoji.id}>\``)
            .setThumbnail(url);

        msg.channel.send(embed);
    }
}