module.exports = {
    name: 'warn',
    aliases: ['w'],
    usage: 'fox warn [user|userId] (reason)',
    category: 'moderation',
    permissions: 'MANAGE_MESSAGES',
    async execute (props) {

        let { message, args, lang, language } = props

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return language.send('COMMAND_WARN_NOMEMBER', lang)

        const reason = args.slice(1).join(' ') || language.get('LOG_MODERATION_NOREASON', lang);
        const moderator = message.member;
        const channel = message.channel;
        await this.executeWarn({ message, reason, target, moderator, channel });
        message.responder.success();
    },

    async executeWarn({ message, reason, target, moderator, channel }) {

        await target.user.settings.push(`servers.${message.guild.id}.warnings`, { author: moderator, timestamp: new Date().getTime(), reason })
        if (message.guild.id === '761512748898844702') {
            let warns = await target.user.settings.get(`servers.${message.guild.id}.warnings`);
            const staffChn = message.guild.channels.cache.get('817006909492166656');
            if (warns?.length >= 3 && staffChn) staffChn.send(`${target.user.tag} (ID: ${target.user.id}) now has **${warns?.length}** warnings.`)
        }

        message.guild.log.send({ type: 'mod', action: 'warn', member: target, moderator, reason, channel, dm: true, counter: 'warn', msg: message });
    }
}