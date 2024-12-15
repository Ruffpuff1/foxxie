const Discord = require('discord.js');

module.exports = {
    name: 'roleinfo',
    aliases: ['rolei', 'role'],
    description: 'Shows information about that specific role.',
    execute(message, args) {
      let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || msg.guild.roles.cache.find(role => role.name === args[0]) || message.member.roles.highest

      const embed = new Discord.MessageEmbed()
        .setColor(role.hexColor)
        .setTitle(`Information about the role ${role.name}`)
        .addFields({ name: 'Members', value: `${role.members.size}`, inline: true},
        { name: 'Colour', value: `${role.hexColor}`, inline: true},
        { name: 'Created', value: `${role.createdAt.toDateString()}`, inline: true},
        { name: 'Modifiable', value: `${role.editable.toString()}`, inline: true},
        { name: 'Manage Access', value: `${role.managed.toString()}`, inline: true},
        { name: 'ID', value: `${role.id}`, inline: true},)

      message.channel.send(embed)
    }
}