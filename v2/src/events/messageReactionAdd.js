const { rero } = require("../monitors/rero");
const { starCreated } = require("./starCreated");
module.exports = {
    name: 'messageReactionAdd',
    execute: async(reaction, user) => {

        if (reaction.message.channel.type === 'dm') return;
        if (reaction.emoji.name == '⭐') starCreated(reaction)
        rero(reaction, user, 'add')
    }
}