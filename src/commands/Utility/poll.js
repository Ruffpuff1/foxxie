const { Command, number } = require('foxxie');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'poll',
            aliases: ['strawpoll'],
            description: language => language.get('COMMAND_POLL_DESCRIPTION'),
            usage: '(title=Title) [...Options]',
            category: 'utility'
        })
    }

    async run(msg, args) {

        const title = /title=.*/i.test(args[0]) ? args[0].slice(6, args[0].length).replace(/(-|_|\/)/gi, ' ') : null;
        if (title) args.shift();

        let opt = args.join(' ').toString().split(/\,\s*/).filter(e => !!e && e !== '');
        if (opt.length > 10 || opt.length < 2) return msg.responder.error('COMMAND_POLL_OPTIONS');

        const embed = new MessageEmbed()
            .setTitle(title || msg.language.get('COMMAND_POLL_EMBED_TITLE', msg.author.tag))
            .setColor(msg.guild.me.displayColor)
            .setDescription(opt.map((option, idx) => `${idx + 1}. ${option.replace(/,/g, ' ')}`).join('\n'))
            .setFooter(msg.language.get('COMMAND_POLL_EMBED_FOOTER'))

        const message = await msg.channel.send(embed);

        for (let i = 0; i < opt.length; i++) {
            await message.react(number[i + 1])
        }
    }
}