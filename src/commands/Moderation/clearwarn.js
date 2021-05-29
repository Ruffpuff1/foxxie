module.exports = {
    name: 'clearwarn',
    aliases: ['clearwarns', 'cw', 'pardon'],
    usage: 'fox clearwarn [user|userId] [warnid|all] (reason)',
    category: 'moderation',
    permissions: 'MANAGE_MESSAGES',
    async execute (props) { 

        const { lang, language, message, args } = props;

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return language.send('COMMAND_CLEARWARN_NOMEMBER', lang);

        if (/all/.test(args[1])) return this._clearWarns(props, target);

        let reason = args.slice(2).join(' ') || language.get('LOG_MODERATION_NOREASON', lang);
        let set = await target.user.settings.get(`servers.${message.guild.id}.warnings[${args[1] - 1}]`);
        if (!set) return language.send('COMMAND_CLEARWARN_INVALIDWARNID', lang);
        
        target.user.settings.pull(`servers.${message.guild.id}.warnings`, set);

        await message.guild.log.send({ type: 'mod', action: 'clearwarn', member: target, moderator: message.member, reason, channel: message.channel, dm: true, warn: set, msg: message })
        // message.guild.log.moderation(message, target.user, reason, 'Clearedwarns', 'clearwarn', lang)
        return message.responder.success();

    }, 

    async _clearWarns({ message, args, language, lang }, target ) {

        const loading = await language.send("MESSAGE_LOADING", lang);
        let set = await target.user.settings.get(`servers.${message.guild.id}.warnings`);
        if (!set?.length) return language.send('COMMAND_CLEARWARN_NOWARNINGS', lang).then(loading.delete());

        async function confirmed() {

            target.user.settings.unset(`servers.${message.guild.id}.warnings`);
            await message.guild.log.send({ type: 'mod', action: 'clearwarns', member: target, moderator: message.member, reason, channel: message.channel, dm: true, warns: set, msg: message })
            loading.delete();
            return message.responder.success();
        };

        let reason = args.slice(2).join(' ') || language.get('LOG_MODERATION_NOREASON', lang);
        return loading.confirm(loading, 'COMMAND_CLEARWARN_CONFIRM', lang, message, confirmed);
    }
}