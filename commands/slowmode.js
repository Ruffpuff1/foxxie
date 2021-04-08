const Discord = require('discord.js');

module.exports = {
    name: 'slowmode',
    description: 'Sets a specific amount of slowmode on the channel, also removes it',
    aliases: ["slow", "stopwatch", "calm", "sm"],
permissions: 'MANAGE_MESSAGES',
    async execute(message, args, bot){

        if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.rply(`Haha, funny. You’re trying to put on slowmode with me without perms. Didn't think someone could be that stupid.`);
        let amount = (args[0]);
        if(!amount) return message.reply(`Sure, i won’t put on slowmode then. No amount means you didn’t just do a command right?`);
        if(isNaN(amount)) return message.reply(`No, give me an actual amount. Please.`);
        if(amount > 21600 || amount < 0) return message.reply(`uhm, well i would love to do that for you, you musnt be that stupid to give me that number right? I need a number under 6h and over -1.`);
        message.channel.setRateLimitPerUser(amount);
        message.channel.send(` Mhm, i’ve put on a ${amount} second slowmode for ya. <:hehe:819914268375252992>.`);
    }
}
