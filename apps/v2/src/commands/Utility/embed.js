const Discord = require('discord.js')
const { emojis } = require('../../../lib/util/constants')
module.exports = {
    name: 'embed',
    aliases: ['broadcast', 'bc', 'announce', 'broadcasts', 'announcements'],
    usage: 'fox embed (title), (description), (footer), (color), (imageLink)',
    category: 'utility',
    permissions: 'ADMINISTRATOR',
    execute: async (lang, message, args) => {
        let loading = await message.channel.send(emojis.infinity)

        const arr = args.join(" ").toString().split(',')

        const embed = new Discord.MessageEmbed()
        // Embed Title
        arr[0] ? embed.setTitle(arr[0].toLowerCase() === 'none'
        ? '' : arr[0].replace(/,/g, ' '))
        : '';
        // Embed Description
        arr[1] ? embed.setDescription(arr[1].replace(/,/g, ' '))
        : '';
        // Embed Footer
        arr[2] ? embed.setFooter(arr[2].replace(/,/g, ' '))
        : '';
        // Embed Color
        arr[3] ? embed.setColor(arr[3].replace(/,/g, ' '))
        : '';

        arr[4] ? embed.setImage(arr[4].replace(/,/g, ' '))
        : '';

        loading.delete()
        message.channel.send(embed)
    }
}