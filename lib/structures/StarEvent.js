const { MessageEmbed } = require('discord.js');
const { starUpdated } = require('../../src/events/starUpdated');
const { emojis: { starboard: { tier0, tier1, tier2, tier3 } }, color: { TCS_STARBOARD }, regexes: { starboard } } = require('../../lib/util/constants')
module.exports.StarEvent = async (reaction, user) => {

    const embed = new MessageEmbed()
    
    if (reaction.message.channel.type === 'dm') return;
    //if (reaction.count < 3) return;
    let sbChannel;
    // Asteri
    reaction.message.guild.id === '824668932441899099' ? sbChannel = reaction.message.guild.channels.cache.find(c => c.id === '833816984390860831') : '';
    // The Corner Store
    reaction.message.guild.id === '761512748898844702' ? sbChannel = reaction.message.guild.channels.cache.find(c => c.id === '779239210360111116') : '';
    // Foxxies cubby
    reaction.message.guild.id === '825853736768372746' ? sbChannel = reaction.message.guild.channels.cache.find(c => c.id === '825896161704542279') : '';

    if (sbChannel == undefined) return;
    if (user.id === reaction.message.client.user.id) return;
    //if (reaction.message.channel.id === sbChannel.id) return;

    embed
        .setTitle(reaction.message.author.tag)
        .setColor(reaction.message.guild.id === '761512748898844702' ? TCS_STARBOARD : reaction.message.member.displayColor)
        .setImage(reaction.message.attachments.size > 0  ? reaction.message.attachments.array()[0].url : '')
        .setDescription(`\n${reaction.message.content ? reaction.message.content : ''}\n\n${
            reaction.count < 5 ? tier0 : reaction.count < 10 ? tier1 : reaction.count < 15 ? tier2 : tier3
            } **${reaction.count}** | ${reaction.message.channel} | [Jump to Message](${reaction.message.url})`)

    let edited = await starUpdated(reaction, sbChannel, embed)
    if (edited) return

    const embedNotif = new MessageEmbed()
        .setTitle(`:star: A new message made it into the starboard :star:`)
        .setDescription(`A message by ${reaction.message.author} got starred enough to make it into the ${sbChannel} channel.\nCheck it out [here](${reaction.message.url})`)
        .setColor(reaction.message.guild.me.displayColor)
        .setThumbnail(reaction.message.author.displayAvatarURL({dynamic:true}))

    reaction.message.channel.send(embedNotif)

    if (starboard.test(reaction.message.content)) embed
        .setImage(reaction.message.content)
        .setDescription(`\n${reaction.count < 5 ? tier0 : reaction.count < 10 ? tier1 : reaction.count < 15 ? tier2 : tier3
        } **${reaction.count}** | ${reaction.message.channel} | [Jump to Message](${reaction.message.url})`)

    if (sbChannel) sbChannel.send(embed)
    .then(sent => sent.react('⭐'))
}