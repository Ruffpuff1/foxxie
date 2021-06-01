const Discord = require('discord.js');

module.exports = {
    name: 'afkcheck',
    async execute (message) {

        // Checks for AFK user mentions.
        message.mentions.users.forEach(async user => {
            if (user.bot || message.content.includes('@here') || message.content.includes('@everyone')) return false;
            const afk = await user.settings.get(`servers.${message.guild.id}.afk`);
            if (!afk) return; 

            const embed = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setAuthor(message.language.get('TASK_AFK_EMBED_AUTHOR', user.tag), user.avatarURL({dynamic: true}))
                .setDescription(message.language.get('TASK_AFK_EMBED_DESCRIPTION', afk.reason))

            const msg = await message.channel.send(embed);
            msg.delete({ timeout: 10000 });
        })

        // Checks if message author is AFK. 
        const afk = await message.author.settings.get(`servers.${message.guild.id}.afk`);
        if (!afk || message.content === afk.lastMessage) return;

        // Sends welcome back msg, and changes nickname. 
        const msg = await message.reply(message.language.get('TASK_AFK_WELCOMEBACK'));
        msg.delete({ timeout: 10000 });
        message.member.setNickname(afk.nickname).catch(e => e);
        message.author.settings.unset(`servers.${message.guild.id}.afk`)
    }

}