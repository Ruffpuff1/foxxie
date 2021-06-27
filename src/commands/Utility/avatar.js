const { MessageEmbed } = require('discord.js');
const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'avatar',
            aliases: ['av', 'icon', 'pfp', 'usericon'],
            description: language => language.get('COMMAND_AVATAR_DESCRIPTION'),
            requiredPermissions: ['EMBED_LINKS'],
            usage: '(User)',
            category: 'utility'
        })
    }

    async run(msg, [id]) {

        let user = msg.users.shift() || await this.client.users.fetch(id).catch(() => null) || msg.author;
        
        const formats = [
            `[PNG](${user.displayAvatarURL({ format: "png", dynamic: true, size: 512})})`,
            `[JPEG](${user.displayAvatarURL({ format: "jpeg", dynamic: true, size: 512})})`,
            `[WEBP](${user.displayAvatarURL({ format: "webp", dynamic: true, size: 512})})`,
            user.avatar?.startsWith('a_') ? `[GIF](${user.displayAvatarURL({ format: "gif", dynamic: true, size: 512})})` : null
        ].filter(a => !!a).join(' | ');

        const description = [
            `(ID: ${user.id})`,
            formats
        ]

        const luna = await this.client.users.fetch('232597078650519553').catch(() => null);

        if (user.id === this.client.user.id) description.push('\n' + msg.language.get('COMMAND_AVATAR_FOXXIE', luna?.tag))
        
        const embed = new MessageEmbed()
            .setColor(msg.guild.me.displayColor)
            .setTitle(user.tag)
            .setDescription(description.join('\n'))
            .setImage(user.displayAvatarURL({ format: 'png', dynamic: true, size: 512 }))

        msg.channel.send(embed);
    }
}