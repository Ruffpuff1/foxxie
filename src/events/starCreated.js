const { StarEvent } = require('../../lib/structures/StarEvent')
module.exports.starCreated = async (reaction, user) => {
    if (reaction.message.partial) {
        await reaction.fetch();
        await reaction.message.fetch();
        StarEvent(reaction, user)
    } else {
        StarEvent(reaction, user)
    }
}