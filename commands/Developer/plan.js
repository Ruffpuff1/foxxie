const Discord = require('discord.js');
const config = require('../../config.json')

module.exports = {
    name: 'plan',
    aliases: ['p', 'plans', 'planned'],
    description: 'My devs plans for me.',
    execute(message, args) {
        if (!config.ids.developerID.includes(message.author.id)) return;
        let Embed = new Discord.MessageEmbed()

Embed.setDescription(`
Plans for Fokushi in 2021

Going public

we're probably first gonna work on getting all the commands from our list into the bot and for only sr at first, but most probably, we'll start working on making them multiple guilds usable one at a time, we will probably fixing bugs, and updating existing commands for the rest of april and add a few new commands, adding commands from the list will start to be added during may.
June will be the a mix of april and may, fixing and updating existing commands, along with adding new ones from the list as well. July will be mostly trying to add the rest of the commands that are not added yet, and if we dont finish that in july then august. 
During august we will also be trying to make all of the non multiple guild commands multiple guild, if not finished that will go into september as well. October is when we plan to actually make the bot public, add it to top.gg, and let others invite it to their own server. this will be specifically  on october 15th we hope, because its ambers birthday then :D  (this wud be her present to herself) After that its updating the bot, making it better, etc etc. i hope fokushi becomes a great bot :)
Ruffs goal for the amount of servers we get in the first month of fokushi being public? 50.
ambers goal for the amount of servers we get in the first month of fokushi being public? 100.


Commands list

rr
unlock and lock
warnings
unban
afk
music
welcome message and goodbye messsage command
prefix set command
ticket system (idk about this one really)
autoroles
foxu pfp (cody)
role info
reminders
welcome channel and goodbye channel
stafflog
log channel command
disboard channel and message
bugreport
antiinvite
poll
urban
more rp commands
out of server user showing
out of server bans
out of server avs
specific user purges

`)
Embed.addField(`April:
Softbans
Autoroles`)
Embed.addField(`May:
more rp commands
out of server bans
poll
prefix set command
unban`)
Embed.addField(`June:
out of server user showing
out of server avs
specific user purges
lock and unlock
role info`)
Embed.addField(`July:
antiinvite
urban
reminders
rr
music`)
Embed.addField(`August:
warnings
afk
welcome channel and goodbye channel
welcome message and goodbye messsage command
disboard channel command
disboard message cmd
Making a lot of non multiple guild commands multiple guilds`)
Embed.addField(`September:
log channel command
bugreport
ticket system
rest of the remaining commands to make multiple guild and also the remaining commands to add`)
Embed.addField(`
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