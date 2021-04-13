const { botOwner } = require('../../../lib/config')
module.exports = {
    name: 'bugreport',
    aliases: ['bug'],
    usage: 'fox bugreport [bug]',
    category: 'utility',
    execute: async(lang, message, args, client) => {
        let bug;
        const dev = client.users.cache.get(botOwner)
        bug = args.slice(0).join(' ')
        if (!bug) return message.channel.send('**Please,** describe in detail the bug you are experiencing, include the name of the command, and the usage that is causing the bug.')
        .then(() => {
            const filter = m => message.author.id === m.author.id;
        
            message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
            .then(messages => {
                if (messages.first().content.toLowerCase() === 'cancel') return message.channel.send('Command **cancelled**.')
                bug = messages.first().content
                dev.send(`Sent by **${message.member.user.tag} (ID: ${message.member.user.id})**:\n${bug}`) 
                message.react("✅")
            })
        }).catch(() => {});

        dev.send(`Sent by **${message.member.user.tag} (ID: ${message.member.user.id})**:\n${bug}`)
        message.react('✅')
    }
}