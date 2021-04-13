const Discord = require('discord.js');

module.exports = {
    name: 'lockdown',
    description: 'locks a specific channel.',
    aliases: ['lock', 'close'],
    execute(message) {

const role = guild.roles.find("name", "tester");

message.channel.overwritePermissions(role,{ 'SEND_MESSAGES': false })
    }
}