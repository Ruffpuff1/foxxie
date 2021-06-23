const { Command, Util } = require('foxxie');

module.exports = class extends Command {
    
    constructor(...args) {
        super(...args, {
            name: 'nuke',
            aliases: ['snap'],
            description: language => language.get('COMMAND_NUKE_DESCRIPTION'),
            usage: '(Channel) (Reason)',
            permissions: 'GUILD_OWNER',
            category: 'moderation'
        })
    }

    async run(msg, args) {

        const channel = msg.channels.shift() || msg.channel;

        const reason = args.slice(!msg.channels ? 0 : 1).join(' ') || msg.language.get('LOG_MODERATION_NOREASON');
        const message = await msg.responder.success('COMMAND_NUKE_WARNING', msg.member.toString(), channel.name);

        const filter = m => msg.author.id === m.author.id;
        const messages = await msg.channel.awaitMessages(filter, { time: 30000, max: 1, errors: ['time'] }).catch(() => message.edit(msg.language.get('MESSAGE_PROMPT_TIMEOUT')));
        if (!Util.isFunction(messages.first)) return;
        if (messages.first().content.toLowerCase() !== `yes, nuke ${channel.name}`) return message.edit(msg.language.get('MESSAGE_PROMPT_CANCELLED'));

        const newChannel = await this.cloneChannel(channel);
        await message.delete();
        await msg.guild.log.send({ type: 'mod', action: 'nuke', moderator: msg.member, reason, channel: newChannel, counter: 'nuke' });
        channel.delete(`${msg.author.tag} | ${reason}`).catch(() => null);
    }

    async cloneChannel(channel) {
        const newChannel = await channel.clone();
        await newChannel.setTopic(channel.topic);
        await newChannel.setPosition(channel.position);
        await newChannel.send(channel.guild.language.get('COMMAND_NUKE'));
        return newChannel;
    }
}