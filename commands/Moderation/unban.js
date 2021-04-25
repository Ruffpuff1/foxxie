const Discord = require('discord.js');
const { execute } = require('./ban');

module.exports = {
    name: 'unban',
    description: 'Unbans a specific user.',

    async execute(message, args, bot){
        if(!message.member.hasPermission("BAN_MEMBERS")) return;
        if(!message.guild.me.hasPermission("BAN_MEMBERS")) return message.reply('i dont hav perms lmao');
        let member = message.mentions.members.first();
if(!member) return message.reply('bruh give me an id');
let reason = args.slice(1).join(" ");
if(!reason) reason = "no reason";
if(member.id === message.author.id) return message.reply('you cannot unban yourself')

let bans = await message.guild.fetchBans();
if(bans.has(member)){
    message.guild.members.unban(member({reason}))
    message.channel.send('person unbanned');
} else {
    message.reply('invalid id or isnt banned')


    }
    
}
}