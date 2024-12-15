const { StarEvent } = require('../../lib/structures/StarEvent')
module.exports.starCreated = async (reaction) => {
    if (reaction.message.partial) {
        await reaction.fetch();
        await reaction.message.fetch();
        StarEvent(reaction)
    } else {
        StarEvent(reaction)
    }
}