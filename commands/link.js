const Discord = require('discord.js');

module.exports = {
    name: 'link',
    aliases: ['links', 'adverts', 'ads', 'advertisements'],
    description: 'Let\'s you see my links n shit.',
    execute(message, args, bot) {
        let Embed = new Discord.MessageEmbed()
        Embed.setTitle(`All my links.`)
        Embed.setDescription(`
Patreon
- Coming soon

Trello
- https://trello.com/b/nVlYiOKw/fokushi

Website
- Coming soon

Invite the bot
- Someday people, someday

Vote for the bot
- Someday people, someday as well.

Server
- https://discord.gg/z7wJdCHGtT`)
        Embed.setTimestamp()
        Embed.setColor(`#006f9e`);
        message.channel.send(Embed)
        
    }
};