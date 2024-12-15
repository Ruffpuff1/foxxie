const { emojis: { starboard: { tier0, tier1, tier2, tier3 } } } = require('~/lib/util/constants');
const { Event } = require('@foxxie/tails');
const { LINK_REGEX: { ruff, imgur, discord } } = require('foxxie');
let edited = false;

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'starUpdated',
        })
    }

    async run(reaction, sbChannel, embed) {
        
        if (!reaction.message.guild.me.permissionsIn(sbChannel).has('VIEW_CHANNEL')) return;
        let msgs = await sbChannel.messages.fetch( { limit: 100 } );
        let sentMessage = msgs.find(msg => msg.embeds.length === 1
            ? (msg.embeds[0].description?msg.embeds[0].description.endsWith(`(${reaction.message.url})`)
                ? true
                : false : false)
            : false);

        if (!sentMessage) return edited = false;
        let language = reaction.message.language;
        
        if (ruff.images.test(reaction.message.content) || imgur.image.test(reaction.message.content) || discord.cdn.test(reaction.message.content)) {
            embed
                .setImage(reaction.message.content)
                .setDescription(`\n${reaction.count < 5 ? tier0 : reaction.count < 10 ? tier1 : reaction.count < 15 ? tier2 : tier3
                } **${reaction.count}** | ${reaction.message.channel} | [${language.get('EVENT_STARCREATED_MESSAGE')}](${reaction.message.url})`)
        
            sentMessage.edit(embed)
            return edited = true;
        };

        embed.setDescription(`\n${reaction.message.content ? reaction.message.content : ''}\n\n${reaction.count < 5 ? tier0 : reaction.count < 10 
            ? tier1 : reaction.count < 15 ? tier2 : tier3
            } **${reaction.count}** | ${reaction.message.channel} | [${language.get('EVENT_STARCREATED_MESSAGE')}](${reaction.message.url})`);
    
        sentMessage.edit(embed);
        return edited = true;
    }
}