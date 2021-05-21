const { emojis: { starboard: { tier0, tier1, tier2, tier3 } }, regexes: { starboard } } = require('../../lib/util/constants')
module.exports.starUpdated = async (reaction, sbChannel, embed) => {

    if (!reaction.message.guild.me.permissionsIn(sbChannel).has('VIEW_CHANNEL')) return;
    let msgs = await sbChannel.messages.fetch( { limit: 100 } );
    let sentMessage = msgs.find(msg => msg.embeds.length === 1
        ? (msg.embeds[0].description?msg.embeds[0].description.endsWith(`(${reaction.message.url})`)
            ? true
            : false : false)
        : false);

    if (!sentMessage) return;
    let lang = await reaction.message.guild.settings.get('language');
    if (!lang) lang = 'en-US';
    let language = reaction.message.language;

    if (starboard.test(reaction.message.content)) {
        embed
            .setImage(reaction.message.content)
            .setDescription(`\n${reaction.count < 5 ? tier0 : reaction.count < 10 ? tier1 : reaction.count < 15 ? tier2 : tier3
            } **${reaction.count}** | ${reaction.message.channel} | [${language.get('EVENT_STARBOARD_JUMP', lang)}](${reaction.message.url})`)

        sentMessage.edit(embed)
        return edited = true;
    };

    embed.setDescription(`\n${reaction.message.content ? reaction.message.content : ''}\n\n${reaction.count < 5 ? tier0 : reaction.count < 10 
        ? tier1 : reaction.count < 15 ? tier2 : tier3
        } **${reaction.count}** | ${reaction.message.channel} | [${language.get('EVENT_STARBOARD_JUMP', lang)}](${reaction.message.url})`);

    sentMessage.edit(embed);
    return edited = true;
}