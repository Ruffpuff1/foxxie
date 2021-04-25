module.exports = {
    name: 'say',
    aliases: ['speak', 'message'],
    description: 'Let\'s you people force me to speak.',
    usage: '[message]',
    guildOnly: false,
    permissions: 'MANAGE_MESSAGES',
    execute(message, args) {
        message.delete();
        let text = args.slice(0).join(' ');
        if (!text) return;
        message.channel.send(`${text}`)
    }
};