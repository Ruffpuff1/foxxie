module.exports = {
    name: 'say',
    aliases: ['speak', 'message'],
    usage: 'fox say [message]',
    category: 'utility',
    permissions: 'MANAGE_MESSAGES',
    execute(props) {

        let { lang, message, args } = props;
        message.delete()
        let text = args.slice(0).join(' ')
        if (!text) return
        message.channel.send(text)
    }
}