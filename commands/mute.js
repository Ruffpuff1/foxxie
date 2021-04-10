const Discord = require('discord.js');
const ms = require("ms");

module.exports = {
    name: "mute",
    description: "Mutes a member for a specific time, making them not able to talk.",
    permissions: ['MANAGE_MESSAGES'],

    async execute (message, args, bot) {

    const muteRoleId = message.guild.roles.cache.get('827204149656420393')
    let muteRole;

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) 
      return message.channel.send('You can’t mute what’s not there, dummy. Next time, actually specify someone to receive the punishment.');
    if (member === message.member)
      return message.channel.send(' imagine being that desperate to be muted lmao.');
    if (member.id === message.guild.me) return message.channel.send('Uhm… You sure you wanna try that lovely? I’m happy to replace the “mute” with ban and my name with yours.');
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.channel.send('I don’t think you should mess with that person mate. They are higher or the same as you y’know?');
    if (!args[1])
      return message.channel.send('Mmm, give me an amount. it has to end with either s for seconds, m for minutes, h for hours, and d for days. the max is 14 days');
    let time = ms(args[1]);
    if (!time || time > 1209600000) // Cap at 14 days, larger than 24.8 days causes integer overflow
      return message.channel.send('Please give me an actual amount, yeah?');
      let reason = args.slice(2).join(' ');
    if (!reason) reason = '`None Provided`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    if (member.roles.cache.has(muteRoleId))
      return message.channel.send('Do you even use your eyes, love? This user is already muted.');

    // Mute member
    try {
      await member.roles.add(muteRoleId);
    } catch (err) {
      console.log(err)
      return message.channel.send('Something went wrong.', err.message);
    }
    message.channel.send(`Alright, mate. I muted ${member} for ya, they're gonna not be able to talk for **${ms(time, { long: true })}**.`)
    let logChannel = message.guild.channels.cache.get("822454708894695444")
    let Embed = new Discord.MessageEmbed()
      Embed.setTitle('Mute Member')
      Embed.setDescription(`${member} has now been muted for **${ms(time, { long: true })}**.`)
      Embed.addField('Moderator', message.member, true)
      Embed.addField('Member', member, true)
      Embed.addField('Time', `\`${ms(time)}\``, true)
      Embed.addField('Reason', reason)
      Embed.setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      Embed.setTimestamp()
      Embed.setColor(`#fc86db`);
      logChannel.send(Embed)

    // Unmute member
    member.timeout = message.client.setTimeout(async () => {
      try {
        await member.roles.remove(muteRoleId);
        let logChannel = message.guild.channels.cache.get("822454708894695444")
        let embed = new Discord.MessageEmbed()
          embed.setTitle('Unmute Member')
          embed.setDescription(`${member} has been unmuted.`)
          embed.setTimestamp()
          embed.setColor(message.guild.me.displayColor);
          logChannel.send(embed)
      } catch (err) {
        console.log(err)
        return message.channel.send('Something went wrong.', err.message);
      }
    }, time);
  }
};
