const Discord = require('discord.js');
const moment = require('moment')
const config = require('../config.json')

const emojis = { friends: '<:SRFriend:834697095968980998>', devs: '<:SRDev:834697623423942657>', owners: '<:SRStrawberry:825745436665053194>', amber: '<:SRDev:834697623423942657>, <:SRStrawberry:825745436665053194>, <:SRFriend:834697095968980998>', foxxie: '<:Foxxie:835523155132153917>' }

module.exports = {
    name: 'test',
    aliases: ["t"],
    description: 'testing ',
    
    execute(message, args) {
        if (!config.dev.includes(message.author.id)) return;
        let men;
        men = message.member;
        let members = message.guild.members;
        if (args[0]) men = message.mentions.members.first() || members.cache.find(m => m.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || members.cache.get(args[0]) || members.cache.find(m => m.user.tag.toLowerCase() === args.join(' ').toLocaleLowerCase()) || members.cache.find(m => m.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
        
        let statusEmote;
        if (men.user.presence.status === "online") statusEmote = "<:SROnline:831122923728535582>"
        if (men.user.presence.status === "idle") statusEmote = "<:SRIdle:831122864203759657>"
        if (men.user.presence.status === "dnd") statusEmote = "<:SRDnd:831111495076675594>"
        if (men.user.presence.status === "offline") statusEmote = "<:SROffline:831122726751567892>"
        
        let embed = new Discord.MessageEmbed()
            .setTitle(`**${men.displayName}**, ${men.user.id === message.member.user.id ? "Info about you." : "Info about them."}`)
            .setColor('#3d9fff')
            .setThumbnail(men.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096}))
            .addField(':crown: **Username**:', men.user.tag, true)
            .addField(':id: **User ID**:', men.user.id, true)
            .addField(':arrow_double_up: **Highest role**:', men.roles.highest, true)
            .addField(`:scroll: **Role${men.roles.cache.size - 1 > 1 ?'s' : ''} (${men.roles.cache.size - 1})**:`, men.roles.cache.size > 0 ? men.roles.cache
                                                                            .sort((a, b) => b.position - a.position)
                                                                            .map(r => r)
                                                                            .join(", ")
                                                                            .replace(", @everyone", "")
                                                                        : 'No roles')
            .addField(`${statusEmote} **Status**:`, men.user.presence?.status, true)

        if (men.user.presence.activities.length) {
            men.user.presence.activities.forEach((activity) => {

                if (activity.type === 'CUSTOM_STATUS') {
                    embed.addField(':butterfly: **Custom status**:', `${activity.emoji || ""} ${activity.state}`, true)
                }
                if (activity.type === 'PLAYING') {
                    embed.addField(':video_game: **Game activity**:', `${activity.name}\n${activity.details||""}\n${activity.state||""}`, true)
                }
                if (activity.type === 'LISTENING' && activity.name === 'Spotify' && activity.assets !== null) {
                    embed.addField(':headphones: **Listening to**:', `Song: ${activity.details}\nAlbum: ${activity.assets.largeText}\nArtist: ${activity.state}`, true)
                }

            })
        }

        if (men.user.presence.activities.length < 2 && men.user.presence.activities.length > 0) embed.addField('\u200B', '\u200B', true)

        if (!men.user.presence.activities.length) embed
                                                    .addField('\u200B', '\u200B', true)
                                                    .addField('\u200B', '\u200B', true)

        embed.setFooter(`Joined at: ${moment(men.joinedAt).format('MMMM Do YYYY')} (${moment([moment(men.joinedAt).format('YYYY'), moment(men.joinedAt).format('M') - 1, moment(men.joinedAt).format('D')]).toNow(true)} ago)
Created at: ${moment(men.user.createdAt).format('MMMM Do YYYY')} (${moment([moment(men.user.createdAt).format('YYYY'), moment(men.user.createdAt).format('M') - 1, moment(men.user.createdAt).format('D')]).toNow(true)} ago)`)
           

        if (config.friend.includes(men.user.id)) embed.setDescription(`${emojis.friends} Friends`)
        if (config.dev.includes(men.user.id)) embed.setDescription(`${emojis.devs} Fokushi Dev`)
        if (config.owner.includes(men.user.id)) embed.setDescription(`${emojis.owners} Seaside Restaurant Owner`)
        if (config.amber.includes(men.user.id)) embed.setDescription(`${emojis.amber} Fokushi Dev, SR Owner, and Friend`)
        if (config.sibling.includes(men.user.id)) embed.setDescription(`${emojis.foxxie} The Siblings,  Foxxie and Fokushi`)

        message.channel.send(embed)
    }
}