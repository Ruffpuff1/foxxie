const { emojis: { secretCommands: { dei } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'dei',
    aliases: ['connor'],
    guildOnly: true,
    execute(lang, message) {
        message.delete()
        message.channel.send(dei)
    }
}