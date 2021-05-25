const { MessageEmbed } = require('discord.js');
const { starUpdated } = require('../../src/events/starUpdated');
const { emojis: { starboard: { tier0, tier1, tier2, tier3 } }, color: { TCS_STARBOARD }, regexes: { starboard } } = require('../../lib/util/constants');

module.exports.StarEvent = async (reaction, user) => {

    const settings = await reaction.message.guild?.settings.get('starboard');
    if (!settings) return; 
    let minimum = settings.minimum || 3;
    if (reaction.count < minimum || settings.nostar?.includes(reaction.message.channel.id) || settings.self === false && reaction.message.author.id === user.id || user.id === reaction.message.client.user.id || reaction.message.channel.id === settings.channel.id) return;
    const channel = reaction.message.guild.channels.cache.get(settings.channel);
    if (!channel) return;
    if (!reaction.message.guild.me.permissionsIn(channel).has('VIEW_CHANNEL')) return;

    const language = reaction.message.language;
    let lang = await reaction.message.guild.settings.get('language');
    if (!lang) lang = 'en-US';
    const embed = new MessageEmbed()
    
    embed
        .setTitle(reaction.message.author.tag)
        .setColor(reaction.message.guild.id === '761512748898844702' ? TCS_STARBOARD : reaction.message.member.displayColor)
        .setImage(reaction.message.attachments.size > 0  ? reaction.message.attachments.array()[0].url : '')
        .setDescription(`\n${reaction.message.content ? reaction.message.content : ''}\n\n${
            reaction.count < 5 ? tier0 : reaction.count < 10 ? tier1 : reaction.count < 15 ? tier2 : tier3
            } **${reaction.count}** | ${reaction.message.channel} | [${language.get('EVENT_STARBOARD_JUMP', lang)}](${reaction.message.url})`)

    let edited = await starUpdated(reaction, channel, embed)
    if (edited) return reaction.message.author.settings.inc(`servers.${reaction.message.guild.id}.starCount`);
    if (settings.notifications !== false) _notification()

    if (starboard.test(reaction.message.content)) embed
        .setImage(reaction.message.content)
        .setDescription(`\n${reaction.count < 5 ? tier0 : reaction.count < 10 ? tier1 : reaction.count < 15 ? tier2 : tier3
        } **${reaction.count}** | ${reaction.message.channel} | [${language.get('EVENT_STARBOARD_JUMP', lang)}](${reaction.message.url})`)

    let sent = await channel.send(embed).catch(e => e);
    if (sent) sent.react('⭐');
    return reaction.message.author.settings.inc(`servers.${reaction.message.guild.id}.starCount`, minimum);

    function _notification () {

        const embed = new MessageEmbed()
            .setTitle(language.get('EVENT_STARBOARD_NOTIF_TITLE', lang))
            .setDescription(language.get('EVENT_STARBOARD_NOTIF_DESCRIPTION', lang, reaction.message.author, channel, reaction.message.url))
            .setColor(reaction.message.author.displayColor)
            .setThumbnail(reaction.message.author.displayAvatarURL({dynamic:true}));

        return reaction.message.channel.send(embed);
    }
}