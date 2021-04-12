module.exports = {
    name: "stealemote",
    aliases: ["se", "yoink", "take", "steal", "addemoji", "stealemoji"],
    description: "A command you can use to easily add emotes to your server.",
    permissions: 'MANAGE_EMOJIS',
    cooldown: 3,
    execute(message, args) { 
      if (!args[0]) { return message.channel.send('Well yknow, thats not correct. you have to do \`hk se (emote/image`)\` (name) thanks.'); } 
      if (!args[1]) { return message.channel.send('Well yknow, thats not correct. you have to do \`hk se (emote/image`)\` (name) thanks.'); }  
       const regex = /<(a?):(\w+):(\d+)>/
       const emotee = (`${args[0]}`).match(regex)
       const image = (`${args[0]}`).match(/\b(https?:\/\/\S+(png|jpe?g|gif)\S*)\b/i)
       let emoCount = message.guild.emojis.cache.size
       if (emoCount >= `${message.guild.premiumTier === 0 ? '100' 
       : message.guild.premiumTier === 1 ? '200'
       : message.guild.premiumTier === 2 ? '300'
       : message.guild.premiumTier === 3 ? '400' : ''}`) return message.channel.send(`sadge max emotes :(`)
      if (!emotee && !image) { return message.channel.send('Well yknow, thats not correct. you have to do \`hk se (emote/image`)\` (name) thanks.'); }
      if (image) {
      if (image[2] === 'gif') { message.guild.emojis.create(args[0], args[1]).then(emoji => message.channel.send(`ey, i added a new emote for ya love: <a:${emoji.name}:${emoji.id}>`)).catch(console.error); }
      else { message.guild.emojis.create(args[0], args[1]).then(emoji => message.channel.send(`ey, i added a new emote for ya love: <:${emoji.name}:${emoji.id}>`)).catch(console.error); } }    
      if (emotee) {   if (!emotee[1]) {  message.guild.emojis.create('https://cdn.discordapp.com/emojis/'+emotee[3]+'.png', args[1]).then(emoji => message.channel.send(`ey, i added a new emote for ya love: <:${emoji.name}:${emoji.id}>`)).catch(console.error) } 
      else if (emotee[1]) { 
       message.guild.emojis.create('https://cdn.discordapp.com/emojis/'+emotee[3]+'.gif', args[1]).then(emoji => message.channel.send(`ey, i added a new emote for ya love: <a:${emoji.name}:${emoji.id}>`)).catch(console.error); } } 
    },
}