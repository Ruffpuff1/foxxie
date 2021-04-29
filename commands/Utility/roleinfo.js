const Discord = require('discord.js');

module.exports = {
    name: 'roleinfo',
    aliases: ['rolei', 'role'],
    description: 'Shows information about that specific role.',
    execute(message, args) {
      let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || msg.guild.roles.cache.find(role => role.name === args[0]) || message.member.roles.highest

      const embed = new Discord.MessageEmbed()
        .setColor(role.hexColor)
        .setTitle(`Information about ${role.name}`)
        .addField('Members', role.members.size)
        .addField('Color', role.hexColor)
        .addField('Creation Date', role.createdAt.toDateString())
        .addField('Modifiablity', role.editable.toString())
        .addField('Manage Access', role.managed.toString())
        .addField('ID', role.id)

      message.channel.send(embed)
    }
}