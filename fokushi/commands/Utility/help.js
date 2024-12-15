const Discord = require('discord.js');
module.exports = {
    name: "help",
    aliases: ["h"],
    description: "a list of all the commands i have. i hope this helps you to find how to interact with me a bit more.",
    execute(message, args, bot) {
        let embed = new Discord.MessageEmbed();
        embed.setColor('#ff1251')
        embed.setThumbnail(`https://images-ext-1.discordapp.net/external/lwJGAWKFCzOo0GwYPM9kVrT92uypza070vnT9Y9V5QA/%3Fsize%3D4096/https/cdn.discordapp.com/avatars/827514096865509386/0b6bcef7c10695b00e97d416c0e70c99.png?width=910&height=910`)
        embed.setDescription(`The commands of Fokushi.

**Developer Only** (6)

\`shutdown, eval, serverlist, status, plan, list\`

**Fun** (21)

\`hug, kiss, pat, smug, slap, cry, kill, pee, poop, mad, cuddle, meow, goose, woof, trio, bleat, ruffy, feed, waifu, boop, pikachu \`
        
**Moderation** (8)
        
\`ban, kick, purge, slowmode, mute, unmute, nuke, permamute\`

**Utility** (17)

\`avatar, server, id, user, invite, say, ping, serveravatar, embed, stealemote, nick, cody (emergency only), uptime, about, tos, link, roleinfo\`

(Do hk help (command) or more info on each command.)`)
        embed.setTimestamp()
        if (!args.length) return message.channel.send(embed)
        const {commands} = message.client;
        const name = args[0].toLowerCase();
const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
if (!command) return message.reply("Yeh yeh, all that en, Please give me an actual command lovely.")
let colors = ["#ff1251"]
const helpEmbed = new Discord.MessageEmbed()
  .setTitle(command.name)
  .setDescription(command.description)
  .setColor(colors[Math.floor(Math.random() * colors.length)])
  .setThumbnail(message.author.displayAvatarURL({ format: "png", dynamic: true, size: 4096}))
  .addField(
      `Aliases`,command.aliases === undefined
      ? "None"
      : command.aliases)
  .addField(
        `Usage`,command.usage === undefined
        ? "None"
        : command.usage)
    


message.channel.send(helpEmbed)


    }
}