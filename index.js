const config = require("./config.json");
const moment = require("moment")
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

/**
 * Client Events
 */
bot.on("ready", () => {
    console.log(`${bot.user.tag} is online.`)
})
bot.on("guildMemberAdd", (member) => {
    if (member.guild.id !== config.seasideRes) return
    const welcomeChannel = bot.channels.cache.get("822189403060830279")
    const embed = new Discord.MessageEmbed()
    embed.setColor('#ff8940')
    embed.setTitle(`A new member appeared!`)
    embed.setDescription(`Why, hello there, ${member} the cutie! Welcome to our little tropical paradise, located out in the middle of the ocean, Seaside Restaurant! Here’s some places you might want to visit first! Be sure to give the <#822189857593098310> channel a read, so we can keep peace on our little island. The <#822468803182329886> channel is where you can go to pick up some shiny roles for yourself. You can go to <#822454757151080489> to see our list of server staff. And when you’re finally ready, <#822193883726741565> is where you can go to meet the rest of the server’s friendly faces! Enjoy your stay! ^^ `)
    embed.setImage(`https://media.discordapp.net/attachments/827515349959835708/829619448972312576/unknown.png`)
    embed.setThumbnail(`https://images-ext-2.discordapp.net/external/5u_By7TVoV9u2SM7ujLOyVDELf-koOmg0AOvLYJq4_s/%3Fsize%3D4096/https/cdn.discordapp.com/icons/822187156214513734/098cbdf8e61a55d18e973afb4e2e292b.png`);
    embed.setTimestamp()
    embed.setFooter('Give them a warn welcome in general! | Joined ');
    welcomeChannel.send('A new member joined! Give them a warm welcome please <@&829752715826823268>!')
    welcomeChannel.send(embed)
})
bot.on("guildMemberRemove", (member) => {
    if (member.guild.id !== config.seasideRes) return
    const goodbyeChannel = bot.channels.cache.get("822189403060830279")
    const Embed = new Discord.MessageEmbed()
    Embed.setColor('#990670')
    Embed.setTitle(`A member continued their journey somewhere else...`)
    Embed.setDescription(`Sadly, ${member} hopped on a boat and sailed far away, back across the ocean. Safe travels! There are ${member.guild.memberCount} customers left, dwelling the island.`)
    Embed.setImage(`https://media.discordapp.net/attachments/829649102333149206/829654630132088842/94a0071504a8b2faf77ae446c56df37a.gif`)
    Embed.setTimestamp()
    Embed.setFooter('We will mourn them in general. | Left ');
    goodbyeChannel.send(Embed)
})
bot.on("messageDelete", (messageDelete) => {
    if (messageDelete.guild.id !== config.seasideRes) return
    const logChannel = bot.channels.cache.get("828563803532296252")
    const Embed = new Discord.MessageEmbed()
    Embed.setColor('#f55a22')
    Embed.setTitle(`Message Deleted.`)
    Embed.setDescription(`A message was deleted.

The Message:

***${messageDelete.content}***

Location:

${messageDelete.channel}

The Author:

**${messageDelete.author.tag}** `)
    Embed.setTimestamp()
    Embed.setFooter('why are you reading this lmao');
    logChannel.send(Embed)
   });
   bot.on("messageUpdate", (oldMessage, newMessage) => {
    if (oldMessage.guild.id !== config.seasideRes) return
    const logChannel = bot.channels.cache.get("828563803532296252")
    const Embed = new Discord.MessageEmbed()
    Embed.setColor('#ff7a4a')
    Embed.setTitle(`Message Edited.`)
    Embed.setDescription(`A message was Edited.

The Before Message:

***${oldMessage.content}***

The After Message:

***${newMessage.content}***

The Location:

${oldMessage.channel}

The Author:

**${oldMessage.author.tag}**
`)
    Embed.setTimestamp()
    Embed.setFooter('why are you reading this lmao');
    logChannel.send(Embed)
   });

   bot.on("guildMemberAdd", (member) => {
    if (member.guild.id !== config.fox) return
    const welcomeChannel = bot.channels.cache.get("822414098439864360")
    const embed = new Discord.MessageEmbed()
    embed.setColor('#ff8940')
    embed.setTitle(`A new member appeared!`)
    embed.setDescription(`Why, hello there, ${member} the cutie! Welcome to our little tropical paradise, located out in the middle of the ocean, Seaside Restaurant! Here’s some places you might want to visit first! Be sure to give the <#822189857593098310> channel a read, so we can keep peace on our little island. The <#822468803182329886> channel is where you can go to pick up some shiny roles for yourself. You can go to <#822454757151080489> to see our list of server staff. And when you’re finally ready, <#822193883726741565> is where you can go to meet the rest of the server’s friendly faces! Enjoy your stay! ^^ `)
    embed.setImage(`https://media.discordapp.net/attachments/827515349959835708/829619448972312576/unknown.png`)
    embed.setThumbnail(`https://images-ext-2.discordapp.net/external/5u_By7TVoV9u2SM7ujLOyVDELf-koOmg0AOvLYJq4_s/%3Fsize%3D4096/https/cdn.discordapp.com/icons/822187156214513734/098cbdf8e61a55d18e973afb4e2e292b.png`);
    embed.setTimestamp()
    embed.setFooter('Give them a warn welcome in general! | Joined ');
    welcomeChannel.send('A new member joined! Give them a warm welcome please <@&829752715826823268>!')
    welcomeChannel.send(embed)
})
bot.on("guildMemberRemove", (member) => {
    if (member.guild.id !== config.fox) return
    const goodbyeChannel = bot.channels.cache.get("822414098439864360")
    const Embed = new Discord.MessageEmbed()
    Embed.setColor('#990670')
    Embed.setTitle(`A member continued their journey somewhere else...`)
    Embed.setDescription(`Sadly, ${member} hopped on a boat and sailed far away, back across the ocean. Safe travels! There are ${member.guild.memberCount} customers left, dwelling the island.`)
    Embed.setImage(`https://media.discordapp.net/attachments/829649102333149206/829654630132088842/94a0071504a8b2faf77ae446c56df37a.gif`)
    Embed.setTimestamp()
    Embed.setFooter('We will mourn them in general. | Left ');
    goodbyeChannel.send(Embed)
})
bot.on("guildMemberAdd", (member) => {
    if (member.guild.id !== config.ok) return
    const welcomeChannel = bot.channels.cache.get("831180747008114688")
    const embed = new Discord.MessageEmbed()
    embed.setColor('#ff8940')
    embed.setTitle(`A new member appeared!`)
    embed.setDescription(`:0 ${member} joined!! hiii`)
    embed.setTimestamp()
    embed.setFooter('noice');
    welcomeChannel.send('A new member joined! Give them a warm welcome please <@&829752715826823268>!')
    welcomeChannel.send(embed)
})
bot.on("guildMemberRemove", (member) => {
    if (member.guild.id !== config.ok) return
    const goodbyeChannel = bot.channels.cache.get("829649102333149206")
    const Embed = new Discord.MessageEmbed()
    Embed.setColor('#990670')
    Embed.setTitle(`sadness`)
    Embed.setDescription(`sadge ${member} left. There are ${member.guild.memberCount} left :(`)
    Embed.setTimestamp()
    Embed.setFooter('We will mourn them in general. | Left ');
    goodbyeChannel.send(Embed)
})

bot.on("messageDelete", (messageDelete) => {
    if (messageDelete.guild.id !== config.ok) return
    const staffchannel = bot.channels.cache.get("829649102333149206")
    const Embed = new Discord.MessageEmbed()
    Embed.setColor('#f55a22')
    Embed.setTitle(`Message Deleted.`)
    Embed.setDescription(`A message was deleted.

The Message:

***${messageDelete.content}***

Location:

${messageDelete.channel}

The Author:

**${messageDelete.author.tag}** `)
    Embed.setTimestamp()
    Embed.setFooter('why are you reading this lmao');
    staffchannel.send(Embed)
   });
   bot.on("messageUpdate", (oldMessage, newMessage) => {
    if (oldMessage.guild.id !== config.ok) return
    const staffchannel = bot.channels.cache.get("829649102333149206")
    const Embed = new Discord.MessageEmbed()
    Embed.setColor('#ff7a4a')
    Embed.setTitle(`Message Edited.`)
    Embed.setDescription(`A message was Edited.

The Before Message:

***${oldMessage.content}***

The After Message:

***${newMessage.content}***

The Location:

${oldMessage.channel}

The Author:

**${oldMessage.author.tag}**
`)
    Embed.setTimestamp()
    Embed.setFooter('why are you reading this lmao');
    staffchannel.send(Embed)
   });



/**
 * Import all commands
 */
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}



bot.on("message", msg => {
    if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

    const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
    bot.commands.get(commandName) ||
    bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (command.permissions) {
        const authorPerms = msg.channel.permissionsFor(msg.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                    return msg.channel.send(`Ay, i see you've been trying to use commands that you don't have the correct **permissions** for. please stop trying to use these unless you finally ave the perms needed. Thanks.`)}
        };  
    try {
        command.execute(msg, args, bot);
    }
    catch(err) {
        console.log(err)
    }


});



bot.login(process.env.token)
