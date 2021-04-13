const { emojis: { secretCommands: { peyton } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'peyton',
    aliases: ['peyluv'],
    category: 'secret',
    execute(lang, message) {
        message.delete()
        message.channel.send(peyton)
    }
}