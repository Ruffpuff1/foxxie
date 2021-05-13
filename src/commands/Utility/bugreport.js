const { owner } = require('../../../config/foxxie');
module.exports = {
    name: 'bugreport',
    aliases: ['bug'],
    usage: 'fox bugreport [bug]',
    category: 'utility',
    execute: async(props) => {

        let { lang, message, args } = props;

        let bug;
        const dev = message.client.users.cache.get(owner[0])
        bug = args.slice(0).join(' ')
        if (!bug) return message.channel.send('**Please,** describe in detail the bug you are experiencing, include the name of the command, and the usage that is causing the bug.')
        .then(() => {
            const filter = m => message.author.id === m.author.id;
        
            message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
            .then(messages => {
                if (messages.first().content.toLowerCase() === 'cancel') return message.channel.send('Command **cancelled**.')
                bug = messages.first().content
                dev.send(`Sent by **${message.member.user.tag} (ID: ${message.member.user.id})**:\n${bug}`) 
                message.responder.success();
            })
        }).catch(() => {});

        dev.send(`Sent by **${message.member.user.tag} (ID: ${message.member.user.id})**:\n${bug}`)
        message.responder.success();
    }
}