const Discord = require('discord.js');
const moment = require('moment');
module.exports = {
    name: 'server',
    aliases: ['serverinfo', 'server info', 'si'],
    description: 'Shows info about the server you run this command in.',
    usage: '',
    guildOnly: true,
    execute(message) {
const servercreated = moment(message.guild.createdAt).format('llll');
const dayssincecreation = moment().diff(servercreated, 'days');
const serverEmbed = new Discord.MessageEmbed()

    .setColor('#0081ff')
     .setTitle(`**${message.guild.name}**
(ID: ${message.guild.id})`)
    .setDescription(`info about **${message.guild.name}**`)
    .setThumbnail(message.guild.iconURL({dynamic:true}))
    .addFields(
{ name: ':crown: **Owner**', value: `${message.guild.owner.user.tag}` , inline: true },
{ name: ':busts_in_silhouette: **Members**', value: `**${message.guild.memberCount}** Users` , inline: true },
{ name: `:sunglasses: **Emotes (${message.guild.emojis.cache.size})**`, value: `${message.guild.emojis.cache.size}` , inline: true },
{ name: ':map: **Region**', value: `${message.guild.region}` , inline: true },
{ name: `:speech_balloon: **Channels (${message.guild.channels.cache.size})**`, value: `${message.guild.channels.cache.size}` , inline: false },
{ name: `:scroll: **Roles (${message.guild.roles.cache.size})**`, value: `\`\`\`${message.guild.roles.cache.sort((a, b) => b.position - a.position).map(r => r.name).slice(0,55).join(", ").replace(', @everyone', " ")}\`\`\``, inline: false},
{ name: ':calendar: **Created At**', value: `${servercreated} **(${dayssincecreation} days ago.)**`, inline: false},)
.setFooter(`${message.author.username} joined this server ${moment(message.member.joinedAt).format('MMMM Do YYYY')} (${moment([moment(message.member.joinedAt).format('YYYY'), moment(message.member.joinedAt).format('M') - 1, moment(message.member.joinedAt).format('D')]).toNow(true)} ago)   `)
message.reply(serverEmbed);},};