module.exports = {
    name: 'nuke',
    aliases: ['snap'],
    usage: 'fox nuke (reason)',
    category: 'moderation',
    permissionLevel: 7,
    async execute (props) {

        let { message, args, language } = props;
        let reason = args[0] || language.get('LOG_MODERATION_NOREASON');
        const msg = await message.responder.success('COMMAND_NUKE_WARNING', message.member.toString(), message.channel.name);
        const filter = m => message.author.id === m.author.id;

        const messages = await message.channel.awaitMessages(filter, { time: 30000, max: 1, errors: ['time'] } );
        if (messages.first().content.toLowerCase() !== `yes, nuke ${message.channel.name}`) return msg.edit(language.get('MESSAGE_CANCELLED'));

        await msg.delete()
        const chn = await message.channel.clone();
        await chn.setPosition(message.channel.position);
        await chn.setTopic(message.channel.topic);
        await chn.send(language.get('COMMAND_NUKE_FIRST'));

        await message.guild.log.send({ type: 'mod', action: 'nuke', moderator: message.member, reason, channel: chn, msg: message, counter: 'nuke' });
        message.channel.delete();
    }
}