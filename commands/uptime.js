
const Discord = require('discord.js');
module.exports = {
    name: 'uptime',
    description: 'Tells you the uptime of me.',
    aliases: ['ut', 'up'],
    execute(message, args, bot) {
        let totalSeconds = (bot.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        
        let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

    }
}