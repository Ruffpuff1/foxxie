const Discord = require('discord.js');

module.exports = {
    name: 'tos',
    aliases: ['ToS', 'terms', 'term', 'termsofservice'],
    description: 'Let\'s you see my ToS easily.',
    execute(message, args, bot) {
        let Embed = new Discord.MessageEmbed()
        Embed.setTitle(`**Fokushi's Terms of Service.**`)
        Embed.setDescription(`**ToS**

Please note we are trying to make this simple for you. If you do break any of this we do have permission to remove you from our services permanently without notice.
Discord ToS. Discord ToS is the one you everyone on discord has to follow no matter what, and even we have to follow it. so if we see you are breaking this ToS, We have the right to ban you from using this bot, ban you from any servers we know you're in, and report you to discord. (Unless you change it and dont break it anymore, for example using BD. if you remove it all will be fine, but if you are underage you cannot change this and we have to report you and ban you.) We also don't let Fokushis users use BD. as this is against ToS. You also have to be 13+ to use Discord anywhere. i will list Discord ToS here so you can read the rest of it. discord.com/terms | We also have copyrighted art, we have made this art by ourselves and we dont want random people to take it and use it. Using it without the permissions of the original owner is illegal, if someone does take the art without permission we will always first formally ask them to take it off, if they do everything will be fine. if the user refuses, we will file a dmca violation notice. Botting and spamming is especially not allowed. if your sole purpose is to damage and harm Fokushi, we will stop you from using it and ban you. This also goes from having multiple alts to spam the bot if you get banned with one.
        
This is all for the ToS of fokushi for now. this will be edited and updated soon.`)
        Embed.setTimestamp()
        Embed.setColor(`#024663`);
        message.channel.send(Embed)
        
    }
};