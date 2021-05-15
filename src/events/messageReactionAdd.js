const { starCreated } = require("./starCreated");
module.exports = {
    name: 'messageReactionAdd',
    execute: async(reaction, user) => {

        if (reaction.message.channel.type === 'dm') return;
        if (reaction.emoji.name == '⭐') {
            // if (reaction.message.partial) {
            //     await reaction.fetch();
            //     await reaction.message.fetch();
            // }
            // reaction.message.author.settings.inc(`servers.${reaction.message.guild.id}.starCount`);
            starCreated(reaction, user)
        }
        reaction.message.client.monitors.get('rero').execute(reaction, user, 'add')
    }
}