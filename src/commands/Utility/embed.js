const { emojis } = require('../../../lib/util/constants')
module.exports = {
    name: 'embed',
    aliases: ['broadcast', 'bc', 'announce', 'broadcasts', 'announcements'],
    usage: 'fox embed (channel) { "title": "Embed Title" }',
    category: 'utility',
    permissions: 'ADMINISTRATOR',
    execute: async (lang, message, args) => {
        // Delete flag

        // get the target channel
        let targetChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
        if (targetChannel) args.shift()
        if (!targetChannel) targetChannel = message.channel

        let loading = await targetChannel.send(emojis.infinity)

        // removes the channel mention

        try {
            // get the JSON data
            const json = JSON.parse(args.join(' '))
            const { text = '' } = json

            // send the embed
            targetChannel.send(text, {
                embed: json,
            })
            message.delete()
            loading.delete()
        } catch (error) {
            loading.delete()
            message.channel.send(`**Uh oh,** there seems to be an error with your embed format. Try making sure everything is correct or you could just copy paste from: https://embedbuilder.nadekobot.me/`)
        }
    }
}