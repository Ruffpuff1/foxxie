const Discord = require('discord.js');
const config = require('../../config.json')

module.exports = {
    name: 'status',
    aliases: ['s', 'stats'],
    description: 'My current status.',
    execute(message, args, bot) {
        
if (!config.ids.developerID.includes(message.author.id)) return;
let days = 0
let week = 0
let uptime = '';
let totalSeconds = (bot.uptime / 1000)
let hours = Math.floor(totalSeconds / 3600)
totalSeconds %= 3600
let minutes = Math.floor(totalSeconds / 60)
let seconds = Math.floor(totalSeconds % 60)
if (hours > 24) {
days = days + 1
hours = 0
        }
if (week - 0) {
uptime += `${week} week, `
        }
if (minutes > 60) {
minutes = 0;
        }
uptime += `**${days}** days, **${hours}** hours, **${minutes}** minutes and **${seconds}** seconds`

let Embed = new Discord.MessageEmbed()

Embed.setDescription(`
Hi! This is my current status.

Version: **\`${config.botver}\`**

Users: **\`${bot.users.cache.size}\`**

Uptime: **\`${uptime}\`**

\`Everything seems to be fine.\``)
Embed.setTimestamp()
Embed.setColor(`GREY`);
message.channel.send(Embed)
    }
};