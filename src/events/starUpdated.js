const { emojis: { starboard: { tier0, tier1, tier2, tier3 } } } = require('../../lib/util/constants')
module.exports.starUpdated = async (reaction, sbChannel, embed) => {
    let msgs = await sbChannel.messages.fetch( { limit: 100 } )
    let sentMessage = msgs.find(msg => {
       msg.embeds.length === 1 
            ? msg.embeds[0].description 
                ? msg.embeds[0].description.endsWith(`(${reaction.message.url})`)
                    ? true
                    : false
                : false
            : false
    })

    if (sentMessage) {
        if (reaction.message.content.startsWith('https://cdn.discordapp.com/attachments') || reaction.message.content.startsWith('https://imgur.com/')) {
            embed
                .setImage(reaction.message.content)
                .setDescription(`\n${reaction.count < 5 
                    ? tier0 
                    : reaction.count < 10 
                        ? tier1 
                        : reaction.count < 15 
                            ? tier2 
                            : tier3
        } **${reaction.count}** | ${reaction.message.channel} | [Jump to Message](${reaction.message.url})`)
            sentMessage.edit(embed)
            return edited = true
        }
        embed.setDescription(`\n${reaction.message.content 
            ? reaction.message.content 
            : ''}

${reaction.count < 5 
    ? tier0 
    : reaction.count < 10 
        ? tier1 
        : reaction.count < 15 
            ? tier2 
            : tier3
} **${reaction.count}** | ${reaction.message.channel} | [Jump to Message](${reaction.message.url})`)
        sentMessage.edit(embed)
        return edited = true
    }
}