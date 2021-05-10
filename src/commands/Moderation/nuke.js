module.exports = {
    name: 'nuke',
    usage: 'fox nuke',
    category: 'moderation',
    permissions: 'ADMINISTRATOR',
    execute: async(props) => {

        let { message, lang, args, language } = props

        if (message.author.id !== message.guild.ownerID)
            return message.channel.send('**Yeahhh no,** due to the harm this command can cause, it can only be excuted by the owner of the server.')

        let topic = message.channel.topic
        let reason = args[0] || language.get('LOG_MODERATION_NOREASON', lang);

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
    
                    await message.guild.logger.moderation(message, message.channel, reason, 'Nuked', 'nuke', lang)
                    message.channel.delete()
                            
                }).catch((e) => {})
            }
        )
    }
}
