const Discord = require('discord.js');

module.exports = {
    name: "ban",
    aliases: ["yeet"],
    description: "Bans the specified user from the server. Add -s or -soft to the ban reason to ban a user and then immediately  unban them, clearing all of their messages.",
    permissions: 'BAN_MEMBERS',

    async execute(message, args, bot){
        let mentionMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!message.guild.me.hasPermission("BAN_MEMBERS")) return message.reply(`Haha, funny. You’re trying to ban with me without perms. Didn't think someone could be that stupid.`);
        if(!mentionMember) return message.reply(` Oh my, we have a real Einstein right here, folks. Mate, listen. You’ve got to specify the member you wish to ban.`);
        let reason = args.slice(1).join(" ");
        if(!reason) reason = "Oops, the moderator that did this ban didnt supply a reason."; 
        if(mentionMember.id === message.author.id) return message.reply(`haha, i see you're trying to be funny, you can't ban yourself with me.`);

        let reg = /\-soft\s*|-s\s*/gi
        let tru = reg.test(message.content)
        updatedRes = reason.replace(reg, '')

        let Embed = new Discord.MessageEmbed()
        Embed.setTitle(`You have been banned.`)
        Embed.setDescription(`You have been forever banned from ${message.guild.name}. Sorry, mate. It’s nothing personal, but that’s the way the cookie crumbles.

Reason: ${updatedRes}
    `)
        Embed.setTimestamp()
        Embed.setAuthor(mentionMember.user.tag, mentionMember.user.displayAvatarURL())
        Embed.setThumbnail(message.guild.iconURL())
        Embed.setColor("#f59dcc")

        if(mentionMember.bannable){

            mentionMember.send(Embed).catch(err => message.channel.send(`oh, i think the member you banned had their DMs off, because i couldnt DM them.`))

            if (tru) mentionMember.ban({reason:updatedRes, days: 1}).then(message.guild.members.unban(mentionMember)).catch(console.error)

            if (!tru) mentionMember.ban({updatedRes})

            message.channel.send(`:white_check_mark: ${message.author.username} has banished ${mentionMember.user.username} from the server. They will never be able to return. Adios!`)
            let logChannel = message.guild.channels.cache.get("822454708894695444")
            let embed = new Discord.MessageEmbed()
    embed.setColor('#ff00b7')
	embed.setTitle(`Member banned.`)
	embed.setDescription(`**${mentionMember.user}** was banned from the server.`)
	embed.addFields(
        { name: 'Reason', value: `${updatedRes}` },  { name: 'Moderator', value: `${message.author} (ID: ${message.author.id})` },

        { name: 'Location', value: `${message.channel}` }, 


	)
	
	embed.setTimestamp()
	embed.setFooter('Why are you reading this?', message.author.displayAvatarURL({ format: "png", dynamic: true, size: 4096}));
    if (logChannel) logChannel.send(embed)
    
    
} else {
    message.reply('Huh? it seems that ive had a problem, i couldnt ban the user you tried to ban.');
    }
}
}


