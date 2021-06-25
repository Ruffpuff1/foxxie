const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'stafflog',
            aliases: ['modcounts', 'stafflogs'],
            description: language => language.get('COMMAND_STAFFLOG_DESCRIPTION'),
            usage: '(Member)',
            permissions: 'MANAGE_MESSAGES',
            category: 'moderation'
        })
    }

    async run(msg) {

        const member = msg.members.shift() || msg.member;
        const loading = await msg.responder.loading();
        const stats = await member.user.settings.get(`servers.${msg.guild.id}.modStats`);

        if (!stats) {
            msg.responder.error('COMMAND_STAFFLOG_NONE', member.user.tag);
            return loading.delete();
        }

        const { ban, kick, warn, jail, mute, slowmode, lock, unlock, nuke, purge, purgeTotal } = stats;

        const arr = [
            msg.language.get('COMMAND_STAFFLOG_ONE', member.user.tag,
                ban, kick, warn, jail, mute
            ),
            msg.language.get('COMMAND_STAFFLOG_TWO',
                slowmode, lock, unlock, nuke, purge, purgeTotal
            )
        ];
        
        msg.channel.send(arr.filter(a => !!a).join('\n\n'));
        return loading.delete();
    }
}