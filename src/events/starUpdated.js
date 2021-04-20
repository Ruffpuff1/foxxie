module.exports.starUpdated = async (reaction, sbChannel, embed) => {
    let msgs = await sbChannel.messages.fetch( { limit: 100 } )
    let sentMessage = msgs.find(msg =>
        msg.embeds.length === 1
        ? (msg.embeds[0]?.description?.endsWith(`(${reaction.message.url})`)
            ? true
            : false)
        : false)

    if (sentMessage) {
        if (reaction.message.content.startsWith('https://cdn.discordapp.com/attachments') || reaction.message.content.startsWith('https://media.discordapp.net/attachments/')) {
            embed
                .setImage(reaction.message.content)
                .setDescription(`\n:star: **${reaction.count}** | ${reaction.message.channel} | [Jump to Message](${reaction.message.url})`)
            sentMessage.edit(embed)
            return edited = true
        }
        embed.setDescription(`\n${reaction.message.content}\n\n:star: **${reaction.count}** | ${reaction.message.channel} | [Jump to Message](${reaction.message.url})`)
        sentMessage.edit(embed)
        return edited = true
    }
}