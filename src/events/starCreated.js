module.exports.starCreated = async (reaction) => {
    if (reaction.count < 3) return;
    if (reaction.message.partial) {
        await reaction.fetch();
        await reaction.message.fetch();
        StarEvent(reaction)
    } else {
        StarEvent(reaction)
    }
}