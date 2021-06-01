const Discord = require('discord.js')
module.exports = {
    name: 'steal',
    aliases: ['se', 'yoink', 'take'],
    usage: 'fox steal [emoji] (name)',
    category: 'utility',
    permissions: 'MANAGE_EMOJIS',
    execute: async (props) => {

        let { message, args, language} = props;
        if (!args[0]) return message.responder.error('COMMAND_STEAL_NOARGS');
        if (!/<a:.+?:\d+>|<:.+?:\d+>/.test(args[0])) return message.responder.error('COMMAND_STEAL_NOTEMOJI');

        let ext = '.png';
        if (args[0].includes('<a:')) ext = '.gif';
        let name = args[1]

        const regex = args[0].replace(/^<a?:\w+:(\d+)>$/, '$1');
        if (!name) name = regex

        let url = `https://cdn.discordapp.com/emojis/${regex}${ext}?v=1`;

        try {
            message.guild.emojis.create(url, name);
        } catch (e) {
            message.responder.error('COMMAND_STEAL_MAXEMOJI');
        };

        const embed = new Discord.MessageEmbed()
            .setTitle(language.get('COMMAND_STEAL_SUCCESS', name))
            .setColor(message.guild.me.displayColor)
            .setDescription(`**ID:** \`${regex}\`\n**Raw:** \`<${ext = '.gif'?'a':''}:${name}:${regex}>\``)
            .setImage(url);

        message.channel.send(embed);
    }
}