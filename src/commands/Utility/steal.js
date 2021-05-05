const Discord = require('discord.js')
module.exports = {
    name: 'steal',
    aliases: ['se', 'yoink', 'take'],
    usage: 'fox steal [emoji] (name)',
    category: 'utility',
    permissions: 'MANAGE_EMOJIS',
    execute: async (props) => {

        let { lang, message, args } = props;
        let emoCount = message.guild.emojis.cache.size
        if (emoCount >= `${message.guild.premiumTier === 0 ? '50' 
        : message.guild.premiumTier === 1 ? '100'
        : message.guild.premiumTier === 2 ? '150'
        : message.guild.premiumTier === 3 ? '200' : ''}`) return message.channel.send(lang.COMMAND_STEAL_MAX_EMOJI)

        if (!args[0]) return message.channel.send(lang.COMMAND_STEAL_NO_ARGS)

        let ext = '.png'
        if (args[0].includes('<a:')) ext = '.gif'
        let name = args[1]

        const regex = args[0].replace(/^<a?:\w+:(\d+)>$/, '$1');
        if (!name) name = regex

        let url = `https://cdn.discordapp.com/emojis/${regex}${ext}?v=1`;

        message.guild.emojis.create(url, name)
        
        const embed = new Discord.MessageEmbed()
        .setTitle(`${lang.COMMAND_STEAL_STOLE} ${name}`)
        .setColor(message.guild.me.displayColor)
        .setDescription(`**ID:** \`${regex}\`\n**Raw:** \`<${ext = '.gif'?'a':''}:${name}:${regex}>\``)
        .setImage(url)

        message.channel.send(embed)
    }
}