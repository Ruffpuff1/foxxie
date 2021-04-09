const Discord = require('discord.js');

module.exports = {
    name: 'unmute',
    description: 'Unmutes the user specifiied',
    aliases: ["free", "letoff", "unstfu"],
    permissions: 'MANAGE_MESSAGES',

    async execute(message, args, bot){
  if(!message.guild.me.hasPermission("MANAGE_ROLES")) return message.reply(`i dont ave any perms`);
  const member = message.mentions.members.first();
  if(!member) return message.reply(`gimme a user to unmute`);
  let role = message.guild.roles.cache.get(`827204149656420393`);
  if(!role) return;
  if(!member.roles.cache.has(role.id)) return message.reply(`they arent even muted mate`);
  member.roles.remove(role.id)
  .then(m => message.channel.send(`**${member.user.tag}** has been unmuted by ${message.author.tag}.`));
  let logChannel = message.guild.channels.cache.get("822454708894695444")
    let Embed = new Discord.MessageEmbed()
      Embed.setTitle('unmute Member')
      Embed.setDescription(`${member} has now been unmuted`)
      Embed.addField('Moderator', message.member, true)
      Embed.addField('Member', member, true)
      Embed.setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      Embed.setTimestamp()
      Embed.setColor(message.guild.me.displayColor);
      logChannel.send(Embed)

}
}