const Discord = require('discord.js');

module.exports = {
    name: 'unmute',
    description: 'Unmutes the user specifiied',
    aliases: ["free", "letoff", "unstfu"],

    async execute(message, args, bot){
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return;
  if(!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply(`i dont ave any perms`);
  const member = message.mentions.members.first();
  if(!member) return message.reply(`gimme a user to unmute`);
  let role = message.guild.roles.cache.get(`827204149656420393`);
  if(!role) return;
  if(!member.roles.cache.has(role.id)) return message.reply(`they arent even muted mate`);
  member.roles.remove(role.id)
  .then(m => message.channel.send(`**${member.user.tag}** has been unmuted by ${message.author.tag}.`));
}
}