const Discord = require('discord.js');

module.exports = {
    name: "kick",
    aliases: ["bean"],
    description: "kick the specified member from the server",
    permissions: 'KICK_MEMBERS',

    async execute(message, args, bot){
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply(`Haha, funny. You’re trying to kick with me without perms. Didn't think someone could be that stupid.`);
        if(!mentionMember) return message.reply(`Next time, actually **mention** a user you want to kick, dummy.`);
        let reason = args.slice(1).join(" ");
        if(!reason) reason = "Oops, the moderator that did this kick didnt supply a reason.";
        if(mentionMember.id === message.author.id) return message.reply(`haha, i see you're trying to be funny, you cant kick yourself with me.`);

        let Embed = new Discord.MessageEmbed()
        Embed.setTitle(`You have been kicked.`)
        Embed.setDescription(`You have been kicked from **${message.guild.name}** for: 
        
 **${reason}**`)
        Embed.setTimestamp()
        Embed.setAuthor(mentionMember.user.tag, mentionMember.user.displayAvatarURL())
        Embed.setThumbnail(message.guild.iconURL())
        Embed.setColor("#f59dcc")

        if(mentionMember.kickable){
            mentionMember.send(Embed).catch(error => message.channel.send(`oh, i think the member you kicked had their DMs off, because i couldnt DM them.`))
            .then(m => mentionMember.kick({reason}));

            message.channel.send(`:white_check_mark: Member successfully kicked!`)
            let logChannel = message.guild.channels.cache.get("822454708894695444")
            let embed = new Discord.MessageEmbed()
    embed.setColor('#ff66d4')
	embed.setTitle(`Member kicked.`)
	embed.setDescription(`**${mentionMember.user}** was kicked from the server.`)
	embed.addFields(
        { name: 'Reason', value: `${reason}` },  { name: 'Moderator', value: `${message.author} (ID: ${message.author.id})` },

        { name: 'Location', value: `${message.channel}` }, 


	)
	
	embed.setTimestamp()
	embed.setFooter('Why are you reading this?', message.author.displayAvatarURL({ format: "png", dynamic: true, size: 4096}));
logChannel.send(embed)
    
    
} else {
    message.reply('Huh? it seems that ive had a problem, i couldnt kick the user you tried to kick.');
    }
}
}


