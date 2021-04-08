const Discord = require('discord.js');

module.exports = {
    name: 'purge',
    description: 'Purge a specific amount of messages from the channel.',
    aliases: ['delete', 'remove'],
    permissions: 'MANAGE_MESSAGES',
    
    async execute(message, args, bot){
       
        if(!message.guild.me.hasPermission("MANAGE_PERMISSIONS")) return message.reply(`Haha, funny. You’re trying to purge with me without perms. Didn't think someone could be that stupid.`);
        let amount = Math.floor(args[0]);
        if(!amount) return message.reply(`Y’know lovely, i can’t purge 0 messages. You have to give me an amount to purge. <a:SRCatYawn:826115265275756575> `);
        if(isNaN(amount)) return message.reply(`While i would love to purge some messages for you, i can’t purge with that amount.`);
        if(amount > 100 || amount < 0) return message.reply(`Maybe, Just Maybe you should give me a proper number, one below 0 and above 100? Thanks mate.        `);
        message.channel.bulkDelete(parseInt(amount + 1), true).catch(err => {
            message.channel.send(`Ooh, i can’t do anything for those messages. I can’t purge messages older than 14 days. Sorry love.`);
        }).then(messages => {
            message.channel.send(`Alright, mate. I cleared **${amount}** for you, since you’re probably too lazy to do it yourself.`)
            .then(msg => {
                msg.delete({ timeout: 3000 })
              })
              .catch(console.error);
            let logChannel = message.guild.channels.cache.get("822454708894695444")
            let Embed = new Discord.MessageEmbed()
      Embed.setTitle('Messages Purged')
      Embed.setDescription(`**${amount} messages were purged.**`)
      Embed.addField('Amount',  `${amount}`)
      Embed.addField('Moderator', message.member, true)
      Embed.addField('Location',  `${message.channel}`)
      Embed.setTimestamp()
      Embed.setColor(message.guild.me.displayColor);
	  Embed.setFooter('Why are you reading this?', message.author.displayAvatarURL({ format: "png", dynamic: true, size: 4096}));
logChannel.send(Embed)
        })
    }
    }


      