module.exports = {
    name: 'nuke',
    aliases: ['snap'],
    usage: 'fox nuke (reason)',
    category: 'moderation',
    permissionLevel: 7,
    async execute (props) {

        let { message, lang, args, language } = props;
        let reason = args[0] || language.get('LOG_MODERATION_NOREASON', lang);
        const msg = await language.send('COMMAND_NUKE_WARNING', lang, message.member.toString(), message.channel.name);
        const filter = m => message.author.id === m.author.id;

        const messages = await message.channel.awaitMessages(filter, { time: 30000, max: 1, errors: ['time'] } );
        if (messages.first().content.toLowerCase() !== `yes, nuke ${message.channel.name}`) return msg.edit(language.get('MESSAGE_CANCELLED', lang));

        await msg.delete()
        const chn = await message.channel.clone();
        await chn.setPosition(message.channel.position);
        await chn.setTopic(message.channel.topic);
        await chn.send(language.get('COMMAND_NUKE_FIRST', lang));

        await message.guild.log.send({ type: 'mod', action: 'nuke', moderator: message.member, reason, channel: chn, msg: message, counter: 'nuke' });
        message.channel.delete();
    }
}