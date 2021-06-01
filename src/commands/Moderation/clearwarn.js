module.exports = {
    name: 'clearwarn',
    aliases: ['clearwarns', 'cw', 'pardon'],
    usage: 'fox clearwarn [user|userId] [warnid|all] (reason)',
    category: 'moderation',
    permissions: 'MANAGE_MESSAGES',
    async execute (props) { 

        const { language, message, args } = props;

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.responder.error('COMMAND_CLEARWARN_NOMEMBER');

        if (/all/.test(args[1])) return this._clearWarns(props, target);

        let reason = args.slice(2).join(' ') || language.get('LOG_MODERATION_NOREASON');
        let set = await target.user.settings.get(`servers.${message.guild.id}.warnings[${args[1] - 1}]`);
        if (!set) return message.responder.error('COMMAND_CLEARWARN_INVALIDWARNID');
        
        target.user.settings.pull(`servers.${message.guild.id}.warnings`, set);

        await message.guild.log.send({ type: 'mod', action: 'clearwarn', member: target, moderator: message.member, reason, channel: message.channel, dm: true, warn: set, msg: message })
        return message.responder.success();

    }, 

    async _clearWarns({ message, args, language }, target ) {

        const loading = await message.responder.loading();
        let set = await target.user.settings.get(`servers.${message.guild.id}.warnings`);
        if (!set?.length) {
            message.responder.error('COMMAND_CLEARWARN_NOWARNINGS');
            return loading.delete();
        }
        
        async function confirmed() {

            target.user.settings.unset(`servers.${message.guild.id}.warnings`);
            await message.guild.log.send({ type: 'mod', action: 'clearwarns', member: target, moderator: message.member, reason, channel: message.channel, dm: true, warns: set, msg: message })
            loading.delete();
            return message.responder.success();
        };

        let reason = args.slice(2).join(' ') || language.get('LOG_MODERATION_NOREASON');
        return loading.confirm(loading, 'COMMAND_CLEARWARN_CONFIRM', message, confirmed);
    }
}