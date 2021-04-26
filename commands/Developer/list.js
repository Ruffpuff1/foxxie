const Discord = require('discord.js');
const config = require('../../config.json')

module.exports = {
    name: 'list',
    aliases: ['commands', 'plans2', 'planned2'],
    description: 'My devs plans for me.',
    execute(message, args) {
        if (!config.ids.developerID.includes(message.author.id)) return;
        let Embed = new Discord.MessageEmbed()
Embed.setDescription(`April:
Softbans
Autoroles
May:
more rp commands
out of server bans
poll
prefix set command
unban
status

June:
out of server user showing
out of server avs
specific user purges
lock and unlock
role info

July:
antiinvite
urban
reminders
rr
music

August:
warnings
afk
welcome channel and goodbye channel
welcome message and goodbye messsage command
disboard channel command
disboard message cmd
Making a lot of non multiple guild commands multiple guilds

September:
log channel command
bugreport
ticket system
rest of the remaining commands to make multiple guild and also the remaining commands to add

October:
fix any bugs, update any commands before 15th october
Apply for top.gg before 15th
Hopefully get 100 or 50 servers
if 100 then apply for verification`)
Embed.setTimestamp()
Embed.setColor(`GREY`);
message.channel.send(Embed)
    }
};