const { User } = require('discord.js');
const { LINK_REGEX: { discord: { invite } } } = require('foxxie');
const { Command } = require('@foxxie/tails')

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'purge',
            aliases: ['prune', 'clear', 'clean', 'delete', 'p'],
            description: language => language.get('COMMAND_PURGE_DESCRIPTION'),
            usage: '[Number] (Filter) (...Reason)',
            permissions: 'MANAGE_MESSAGES',
            category: 'moderation',
        })
    }

    async run(msg, args) {
        let limit = args.shift();
        if (!limit || !parseInt(limit) || !/^\d+$/.test(limit)) return msg.responder.error('COMMAND_PURGE_NOLIMIT');

        const userFilter = msg.users?.shift();
        const filter = args[0];
        let messages = await msg.channel.messages.fetch({ limit: 100 });

        if (/(link|invite|bots|you|me|upload|user|pin|text)/.test(filter)) {
            
            const user = /user/.test(filter) && userFilter instanceof User ? userFilter : null;
            if (/user/.test(filter) && !user) return msg.responder.error('COMMAND_PURGE_USER');
            messages = messages.filter(mes => !mes.pinned).filter(this.getFilter(msg, filter, user));
        }

        let reason = /(link|invite|bots|you|me|upload|user|pin|text)/.test(filter)
            ? /user/.test(filter)
                ? args.slice(2).join(' ')
                : args.slice(1).join(' ')
            : args.join(' ');
        if (!reason) reason = msg.language.get('LOG_MODERATION_NOREASON');

        // pin handling
        messages = messages.filter(mes => !mes.pinned);

        if (messages.has(msg.id)) limit++;
        messages = messages.keyArray().slice(0, limit);
        if (!messages.includes(msg.id)) messages.push(msg.id);

        await msg.channel.bulkDelete(messages);
        const mess = await msg.responder.success('COMMAND_PURGE_SUCCESS', messages.length - 1);
        await msg.guild.log.send({ type: 'mod', action: 'purge', user: userFilter, moderator: msg.member, reason, counter: 'purge', total: messages.length - 1, channel: msg.channel });
        mess.delete({ timeout: 10000 }).catch(() => null);
    }

    getFilter(msg, filter, user) {
        switch (filter) {
            case 'link': return mes => /https?:\/\/[^ /.]+\.[^ /.]+/.test(mes.content);
            case 'invite': return mes => invite.test(mes.content);
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