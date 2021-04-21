const Discord = require('discord.js');
module.exports = {
    name: "help",
    aliases: ["h"],
    description: "Helps you with the commands and shows you the list as well.",
    execute(message, args, bot) {
        let embed = new Discord.MessageEmbed();
        embed.setColor('#ff1251')
        embed.setDescription(`The commands of Fokushi.

**Developer Only** (3)

\`shutdown, eval, serverlist\`

**Fun** (17)

\`hug, kiss, pat, smug, slap, cry, kill, pee, poop, mad, cuddle, meow, goose, woof, trio, bleat, ruffy\`
        
**Moderation** (8)
        
\`ban, kick, purge, slowmode, mute, unmute, nuke, permamute\`

**Utility** (14)

\`avatar, server, id, user, invite, say, ping, serveravatar, embed, stealemote, nick, cody (emergency only), uptime, about\`

(Do hk help (command) or more info on each command.)`)
        embed.setTimestamp()
        if (!args.length) message.channel.send(embed)
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
    


message.channel.send(helpEmbed)













    
    }
}