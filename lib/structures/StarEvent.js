const { MessageEmbed } = require('discord.js');
const { starUpdated } = require('../../src/events/starUpdated');
module.exports.StarEvent = async (reaction) => {

    const embed = new MessageEmbed()
    
    if (reaction.message.channel.type === 'dm') return;
    let sbChannel;
    // Asteri
    reaction.message.guild.id === '824668932441899099' ? sbChannel = reaction.message.guild.channels.cache.find(c => c.id === '831939859480182794') : '';
    // The Corner Store
    reaction.message.guild.id === '' ? sbChannel = reaction.message.guild.channels.cache.find(c => c.id === '779239210360111116') : ''
    if (sbChannel == undefined) return;
    if (reaction.message.channel.id === sbChannel.id) return;

    embed
        .setTitle(reaction.message.author.tag)
        .setColor(reaction.message.guild.me.displayColor)
        .setImage(reaction.message.attachments.size > 0 
            ? reaction.message.attachments.array()[0].url
            : '')
        .setDescription(`\n${reaction.message.content 
                                ? reaction.message.content 
                                : ''}
        
${reaction.count <= 3 
    ? ':star:' 
    : ':star2:'} **${reaction.count}** | ${reaction.message.channel} | [Jump to Message](${reaction.message.url})`)

    let edited = await starUpdated(reaction, sbChannel, embed)

    if (edited) return

    if (reaction.message.content.startsWith('https://cdn.discordapp.com/attachments')
        || reaction.message.content.startsWith('https://media.discordapp.net/attachments/')) 
            embed
                .setImage(reaction.message.content)
                .setDescription(`\n${reaction.count <= 3 
                                        ? ':star:' 
                                        : ':star2:'} **${reaction.count}** | ${reaction.message.channel} | [Jump to Message](${reaction.message.url})`)

    if (sbChannel) sbChannel.send(embed)
    .then(sent => sent.react('⭐'))
}