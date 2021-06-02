const { poll } = require('../../../lib/util/constants');
const Discord = require('discord.js');

module.exports = {
    name: 'poll',
    aliases: ['strawpoll'],
    usage: 'fox poll (title=Title-Here) [option1], [option2]',
    category: 'utility',
    async execute({ message, args, language }) {

        // Sees if title variable is args 0 and if so performs args.shift();
        const title = /title=.*/i.test(args[0]) ? args[0].slice(6, args[0].length).replace(/(-|_|\/)/gi, ' ') : null;
        if (title) args.shift();

        // separates args by comma and filters out nullish args;
        let opt = args.join(" ").toString().split(/\,\s*/).filter(e => !!e && e !== '');
        if (opt.length > 10 || opt.length < 2) return message.responder.error('COMMAND_POLL_OPTIONS');
        this.numbers = poll;

        const embed = new Discord.MessageEmbed()
            .setTitle(title || language.get('COMMAND_POLL_EMBED_TITLE', message.author.tag))
            .setColor(message.guild.me.displayColor)
            .setDescription(opt.map((option, idx) => `${idx + 1}. ${option.replace(/,/g, ' ')}`).join('\n'))
            .setFooter(language.get('COMMAND_POLL_EMBED_FOOTER'))

        let msg = await message.channel.send(embed);

        // reacts to the message with the amount of args sent;
        for (let i = 0; i < opt.length; i++) {
            await msg.react(this.numbers[i + 1]);
        }
    }
}