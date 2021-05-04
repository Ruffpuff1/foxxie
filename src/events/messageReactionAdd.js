const { starCreated } = require("./starCreated");
module.exports = {
    name: 'messageReactionAdd',
    execute: async(reaction, user) => {

        if (reaction.message.channel.type === 'dm') return;
        if (reaction.emoji.name == '⭐') starCreated(reaction, user)
        reaction.message.client.monitors.get('rero').execute(reaction, user, 'add')
    }
}