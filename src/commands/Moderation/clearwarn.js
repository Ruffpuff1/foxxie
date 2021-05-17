module.exports = {
    name: 'clearwarn',
    aliases: ['clearwarns', 'cw', 'pardon'],
    usage: 'fox clearwarn [user|userId] [warnid|all] (reason)',
    category: 'moderation',
    permissions: 'MANAGE_MESSAGES',
    execute: async(props) => { 

        const { lang, language, message, args } = props;

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return language.send('COMMAND_CLEARWARN_NOMEMBER', lang);

        if (/all/.test(args[1])) return _clearWarns();

        let reason = args.slice(2).join(' ') || language.get('LOG_MODERATION_NOREASON', lang);
        let set = await target.user.settings.get(`servers.${message.guild.id}.warnings[${args[1] - 1}]`);
        if (!set) return language.send('COMMAND_CLEARWARN_INVALIDWARNID', lang);
        
        target.user.settings.pull(`servers.${message.guild.id}.warnings`, set);

        message.guild.log.moderation(message, target.user, reason, 'Clearedwarns', 'clearwarn', lang)
        return message.responder.success();

        async function _clearWarns() {

            let reason = args.slice(2).join(' ') || language.get('LOG_MODERATION_NOREASON', lang);

            let set = await target.user.settings.get(`servers.${message.guild.id}.warnings`);
            if (!set?.length) return language.send('COMMAND_CLEARWARN_NOWARNINGS', lang);

            target.user.settings.unset(`servers.${message.guild.id}.warnings`);
            message.guild.log.moderation(message, target.user, reason, 'Clearedwarns', 'clearwarn', lang)
            return message.responder.success();
        }
    }
}