const Discord = require('discord.js');

module.exports = {
    name: 'roleinfo',
    aliases: ['rolei', 'role'],
    description: 'Shows information about that specific role.',
    execute(message, args) {
        const args = msg.content.split(' ')
  let role = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0]) || msg.guild.roles.cache.find(role => role.name === args[0])
  if (!role) role = msg.member.roles.highest
  const embed = new MessageEmbed()
    .setColor(role.hexColor)
    .setTitle(`Information about ${role.name}`)
    .addField('Members', role.members.size)
    .addField('Color', role.hexColor)
    .addField('Creation Date', role.createdAt.toDateString())
    .addField('Modifiablity', role.editable.toString())
    .addField('Manage Access', role.managed.toString())
    .addField('ID', role.id)
  msg.channel.send(embed)
}
}