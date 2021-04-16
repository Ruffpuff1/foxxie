const moment = require('moment')
const Discord = require('discord.js')
const { addNuke } = require('../../tasks/modCountAdd')
const { getGuildModChannel } = require('../../../lib/settings')
module.exports = {
    name: 'nuke',
    usage: 'fox nuke',
    category: 'moderation',
    permissions: 'ADMINISTRATOR',
    execute: async(lang, message, args) => {

        if (message.author.id !== message.guild.ownerID)
            return message.channel.send('**Yeahhh no,** due to the harm this command can cause, it can only be excuted by the owner of the server.')

        const warnDate = moment(message.createdTimestamp).format('llll');
        let topic = message.channel.topic

        message.channel.send(`${message.author}, ya sure you want to nuke this channel? This will get rid of all messages in the channel and **can't be undone**
if you're positive go ahead and type \`yes, nuke ${message.channel.name}\` within the next 30 seconds. If you'd like to cancel just send \`cancel\` or any other message. Also, gotta tell you that this simply clones the channel meaning some settings from myself or other bots won't work anymore.`)
            .then(() => {
                const filter = m => message.author.id === m.author.id;

                message.channel.awaitMessages(filter, { time: 30000, max: 1, errors: ['time'] })
                    .then(async messages => {

                        if (messages.first().content.toLowerCase() !== `yes, nuke ${message.channel.name}` || messages.first().content.toLowerCase() === 'cancel') return message.channel.send('Command **cancelled**.')

                        message.channel.clone().then(channel => {
                            channel.setPosition(message.channel.position)
                            channel.setTopic(topic)
                            channel.send(`**Heh First,** anyways this channel was nuked by the owner of the server. All previous messages have been cleared out.`)
                        })

                        let results = await getGuildModChannel(message)
    
                            const nukeEmbed = new Discord.MessageEmbed()
                                .setTitle(`Nuked ${message.channel.name}`)
                                .setColor(message.guild.me.displayColor)
                                .setTimestamp()
                                .addFields(
                                    { name: '**Nuked Channel**', value: `${message.channel.name} (ID: ${message.channel.id})`, inline: true },
                                    { name: '**Moderator**', value: `<@${message.author.id}> (ID: ${message.author.id})`, inline: true },
                                    { name: '\u200B', value: '\u200B', inline: true },
                                    { name: `**Reason**`, value: `No reason specified`, inline: true },
                                    { name: `**Location**`, value: `<#${message.channel.id}>`, inline: true },
                                    { name: `**Date / Time**`, value: `${warnDate}`, inline: true })

                            addNuke(message)
                            message.channel.delete()
                            if (results.channelId === message.channel.id) return;
                            const logChannel = message.guild.channels.cache.get(results.channelId);
                            if (logChannel) logChannel.send(nukeEmbed)
    
                            
                    }).catch(() => {})
            }
        )
    }
}
