const { rero } = require("../monitors/rero")
module.exports = {
    name: 'messageReactionRemove',
    execute: async(reaction, user) => {

        if (reaction.message.channel.type === 'dm') return
        rero(reaction, user, 'remove')
    }
}