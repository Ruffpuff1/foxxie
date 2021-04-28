const { rero } = require("../monitors/rero")
const { starCreated } = require("./starCreated");
module.exports = {
    name: 'messageReactionRemove',
    execute: async(reaction, user) => {

        if (reaction.message.channel.type === 'dm') return
        if (reaction.emoji.name == '⭐') starCreated(reaction)
        reaction.message.client.monitors.get('rero').execute(reaction, user, 'remove')
    }
}