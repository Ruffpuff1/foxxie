module.exports = {
    name: "stealemote",
    aliases: ["se", "yoink", "take", "steal", "addemoji", "stealemoji"],
    description: "A convenient command for uploading emotes on your server!",
    usage: "[Emote/Image] [Name]",
    cooldown: 3,
    execute(message, args) { 
      if (!args[0]) { return message.channel.send('No arguments provided for the **Emote/Image**, Please try again with the correct Usage: \`hk yoink [emote/image] [name]\`'); } 
      if (!args[1]) { return message.channel.send('No arguments provided for the **Emote Name**, Please try again with the correct Usage: \`hk yoink [emote/image] [name]\`'); }  
       const regex = /<(a?):(\w+):(\d+)>/
       const emotee = (`${args[0]}`).match(regex)
       const image = (`${args[0]}`).match(/\b(https?:\/\/\S+(png|jpe?g|gif)\S*)\b/i)
      if (!emotee && !image) { return message.channel.send('Please do the proper command usage: \`as!ea [Emote/Link] [Emote Name]\`'); }
      if (image) {
      if (image[2] === 'gif') { message.guild.emojis.create(args[0], args[1]).then(emoji => message.channel.send(`ey, i added a new emote for ya love: <a:${emoji.name}:${emoji.id}>`)).catch(console.error); }
      else { message.guild.emojis.create(args[0], args[1]).then(emoji => message.channel.send(`ey, i added a new emote for ya love: <:${emoji.name}:${emoji.id}>`)).catch(console.error); } }    
      if (emotee) {   if (!emotee[1]) {  message.guild.emojis.create('https://cdn.discordapp.com/emojis/'+emotee[3]+'.png', args[1]).then(emoji => message.channel.send(`Uploaded a new emote on this server: <:${emoji.name}:${emoji.id}>`)).catch(console.error) } 
      else if (emotee[1]) { 
       message.guild.emojis.create('https://cdn.discordapp.com/emojis/'+emotee[3]+'.gif', args[1]).then(emoji => message.channel.send(`ey, i added a new emote for ya love: <a:${emoji.name}:${emoji.id}>`)).catch(console.error); } } 
    },
}