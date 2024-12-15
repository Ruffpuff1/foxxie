const { MessageEmbed } = require('discord.js');
const { Command } = require('@foxxie/tails');

module.exports = class extends Command {
    
    constructor(...args) {
        super(...args, {
            name: 'afk',
            aliases: ['away', 'idle'],
            description: language => language.get('COMMAND_AFK_DESCRIPTION'),
            requiredPermissions: ['EMBED_LINKS'],
            usage: '(...Reason)',
            category: 'utility'
        })
    }

    async run(msg, args) {

        const reason = args.slice(0).join(' ') || 'AFK';
        msg.author.settings.set(`servers.${msg.guild.id}.afk`, {
            nickname: msg.member.displayName,
            reason,
            status: true,
            lastMessage: msg.content,
            timeStamp: new Date().getTime()
        })

        const embed = new MessageEmbed()
            .setColor(msg.guild.me.displayColor)
            .setAuthor(msg.language.get('COMMAND_AFK_AUTHOR', msg.author.tag), msg.author.avatarURL({ dynamic: true }))
            .setDescription(msg.language.get('COMMAND_AFK_REASON', reason))

        msg.member.setNickname(`[AFK] ${msg.member.displayName}`).catch(() => null);
        msg.responder.success();
        const message = await msg.channel.send(embed);
        message.delete({ timeout: 10000 })
    }
}