const Discord = require('discord.js');
const moment = require('moment')
const config = require('../../config.json')

module.exports = {
    name: 'eval',
    description: 'Lets the owner, amber, do anything usually',
    aliases: ['ev'],
    execute(message, args, bot) {
if (!config.ids.developerID.includes(message.author.id)) return;
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