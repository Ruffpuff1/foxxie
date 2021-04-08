const Discord = require('discord.js');
const moment = require('moment')

module.exports = {
    name: 'eval',
    description: 'Lets the owner, amber, do anything usually',
    aliases: ['ev'],
    execute(message, args, bot) {
let ownerID = '814539604879081532'
      if(message.author.id !== ownerID) return;
      try {
        const code = args.join(" ");
        let evaled = eval(code);
   
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled, { depth : 0 } )
   
        message.channel.send(evaled, {code:"xl"});
      } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${(err)}\n\`\`\``);
      };
}
}