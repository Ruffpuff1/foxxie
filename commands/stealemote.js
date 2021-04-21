module.exports = {
    name: "stealemote",
    aliases: ["se", "yoink", "take", "steal", "addemoji", "stealemoji"],
    description: "A command you can use to easily add emotes to your server.",
    permissions: 'MANAGE_EMOJIS',
    cooldown: 3,
    execute(message, args) { 
      if (!args[0]) { return message.channel.send('Uh, you do know thats not how you do it right? Please do hk se (emote/image`) (name) thanks, I guess.'); } 
      if (!args[1]) { return message.channel.send('Uh, you do know thats not how you do it right? Please do hk se (emote/image`) (name) thanks, I guess.'); }  
       const regex = /<(a?):(\w+):(\d+)>/
       const emotee = (`${args[0]}`).match(regex)
       const image = (`${args[0]}`).match(/\b(https?:\/\/\S+(png|jpe?g|gif)\S*)\b/i)
       let emoCount = message.guild.emojis.cache.size
       if (emoCount >= `${message.guild.premiumTier === 0 ? '100' 
       : message.guild.premiumTier === 1 ? '200'
       : message.guild.premiumTier === 2 ? '300'
       : message.guild.premiumTier === 3 ? '400' : ''}`) return message.channel.send(`Awe, this guild is at its max amount of emotes. I guess that's too bad for you.`)
      if (!emotee && !image) { return message.channel.send('Uh, you do know thats not how you do it right? Please do hk se (emote/image`) (name) thanks, I guess.'); }
      if (image) {
      if (image[2] === 'gif') { message.guild.emojis.create(args[0], args[1]).then(emoji => message.channel.send(`Emote successfully added. Hope you have fun using it love. 
The emote:
  
 <a:${emoji.name}:${emoji.id}>`)).catch(console.error); }
      else { message.guild.emojis.create(args[0], args[1]).then(emoji => message.channel.send(`Emote successfully added. Hope you have fun using it love. 
The emote:

<:${emoji.name}:${emoji.id}>`)).catch(console.error); } }    
      if (emotee) {   if (!emotee[1]) {  message.guild.emojis.create('https://cdn.discordapp.com/emojis/'+emotee[3]+'.png', args[1]).then(emoji => message.channel.send(`Emote successfully added. Hope you have fun using it love. 
The emote:

<:${emoji.name}:${emoji.id}>`)).catch(console.error) } 
      else if (emotee[1]) { 
       message.guild.emojis.create('https://cdn.discordapp.com/emojis/'+emotee[3]+'.gif', args[1]).then(emoji => message.channel.send(`Emote successfully added. Hope you have fun using it love. 
The emote:

<a:${emoji.name}:${emoji.id}>`)).catch(console.error); } } 
    },
}