module.exports = {
    name: 'note',
    aliases: ['n'],
    usage: 'fox note [member|userId] [note]',
    category: 'moderation',
    permissions: 'MANAGE_MESSAGES',
    async execute ({ message, args, lang, language }) {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return language.send('COMMAND_NOTE_NOMEMBER', lang)
        let reason = args.slice(1).join(' ') || language.get('COMMAND_NOTE_NONOTE', lang);

        await member.user.settings.push(`servers.${message.guild.id}.notes`, { author: message.member.user.id, reason })
        message.responder.success();
    }
}