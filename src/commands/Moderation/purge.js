const { User } = require('discord.js');
module.exports = {
    name: 'purge',
    aliases: ['prune', 'clear', 'clean', 'delete', 'p'],
    usage: 'fox purge [number] (link|invite|bots|you|me|upload|text|user) (reason)',
    category: 'moderation',
    permissions: 'MANAGE_MESSAGES',
    async execute (props) {

        let { message, args, lang, language } = props;
        let limit = args[0];
        if (!limit || !parseInt(limit) || !/^\d+$/.test(limit)) return language.send('COMMAND_PURGE_NOLIMIT', lang);
        args.shift();
        const userInstance = message.mentions.users.first() || message.client.users.cache.get(args[1]);
        let filter = args[0];

        let messages = await message.channel.messages.fetch({ limit: 100 });
        if (/(link|invite|bots|you|me|upload|user|pin|text)/i.test(filter)) {
            
            const user = /user/i.test(filter) && userInstance instanceof User ? userInstance : null;
            if (/user/i.test(filter) && !user) return language.send('COMMAND_PURGE_USER', lang)
            messages = messages.filter(mes => !mes.pinned).filter(this.getFilter(message, filter, user));
        }
        let reason = /(link|invite|bots|you|me|upload|user|pin|text)/i.test(filter)
            ? /user/i.test(filter)
                ? args.slice(2).join(' ')
                : args.slice(1).join(' ')
            : args.join(' ');
        if (!reason) reason = language.get('LOG_MODERATION_NOREASON', lang);

        messages = messages.filter(mes => !mes.pinned);
        if (messages.has(message.id)) limit++;
        messages = messages.keyArray().slice(0, limit);
        if (!messages.includes(message.id)) messages.push(message.id);

        await message.channel.bulkDelete(messages);
        const msg = await language.send('COMMAND_PURGE_SUCCESS', lang, messages.length - 1);
        await message.guild.log.send({ type: 'mod', action: 'purge', moderator: message.member, reason, msg: message, counter: 'purge', total: messages.length, channel: message.channel });
        msg.delete({ timeout: 10000 }).catch(() => null);
    },

    getFilter(msg, filter, user) {
        switch (filter) {
            case 'link': return mes => /https?:\/\/[^ /.]+\.[^ /.]+/.test(mes.content);
            case 'invite': return mes => /(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discordapp\.com\/invite)\/.+/.test(mes.content);
            case 'bots': return mes => mes.author.bot;
            case 'you': return mes => mes.author.id === msg.client.user.id;
            case 'me': return mes => mes.author.id === msg.author.id;
            case 'upload': return mes => mes.attachments.size > 0;
            case 'text': return mes => mes.attachments.size === 0;
            case 'user': return mes => mes.author.id === user.id;
            default: return () => true;
        }
    }
}