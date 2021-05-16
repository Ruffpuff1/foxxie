const Discord = require('discord.js')
module.exports = {
    name: 'steal',
    aliases: ['se', 'yoink', 'take'],
    usage: 'fox steal [emoji] (name)',
    category: 'utility',
    permissions: 'MANAGE_EMOJIS',
    execute: async (props) => {

        let { lang, message, args, language} = props;
        if (!args[0]) return language.send('COMMAND_STEAL_NOARGS', lang);
        if (!/<a:.+?:\d+>|<:.+?:\d+>/.test(args[0])) return language.send('COMMAND_STEAL_NOTEMOJI', lang);

        let ext = '.png';
        if (args[0].includes('<a:')) ext = '.gif';
        let name = args[1]

        const regex = args[0].replace(/^<a?:\w+:(\d+)>$/, '$1');
        if (!name) name = regex

        let url = `https://cdn.discordapp.com/emojis/${regex}${ext}?v=1`;

        try {
            message.guild.emojis.create(url, name);
        } catch (e) {
            language.send('COMMAND_STEAL_MAXEMOJI', lang);
        };

        const embed = new Discord.MessageEmbed()
            .setTitle(language.get('COMMAND_STEAL_SUCCESS', lang, name))
            .setColor(message.guild.me.displayColor)
            .setDescription(`**ID:** \`${regex}\`\n**Raw:** \`<${ext = '.gif'?'a':''}:${name}:${regex}>\``)
            .setImage(url);

        message.channel.send(embed);
    }
}