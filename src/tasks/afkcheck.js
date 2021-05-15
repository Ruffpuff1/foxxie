const Discord = require('discord.js')
module.exports.afkCheck = async message => {

    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    let lang = await message.guild.settings.get('language');
    if (!lang) lang = 'en-US';
    message.mentions.users.forEach(
        async user => {

            if (user.bot) return;
            if (message.content.includes('@here') || message.content.includes('@everyone')) return false;

            let afk = await user.settings.get(`servers.${message.guild.id}.afk`);
            if (!afk) return;

            const embed = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setAuthor(message.language.get('TASK_AFK_EMBED_AUTHOR', lang, user.tag), user.avatarURL({dynamic: true}))
                .setDescription(message.language.get('TASK_AFK_EMBED_DESCRIPTION', lang, afk.reason))

            message.channel.send(embed)
            .then(msg => { setTimeout(() => msg.delete(), 10000) });
        }
    )
        let afk = await message.author.settings.get(`servers.${message.guild.id}.afk`);
        if (!afk) return;
        if (message.content === afk.lastMessage) return;

        message.reply(message.language.get('TASK_AFK_WELCOMEBACK', lang))
        .then(msg => { setTimeout(() => msg.delete(), 10000) });

        message.member.setNickname(afk.nickname).catch(e => console.error(e.message));
        message.author.settings.unset(`servers.${message.guild.id}.afk`);
}