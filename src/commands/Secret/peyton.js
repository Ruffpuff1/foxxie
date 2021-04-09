const { emojis: { secretCommands: { peyton } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'peyton',
    aliases: ['peyluv'],
    guildOnly: true,
    execute(lang, message) {
        message.delete()
        message.channel.send(peyton)
    }
}