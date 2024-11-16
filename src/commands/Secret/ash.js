const { emojis: { secretCommands: { ashlee } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'ash',
    aliases: ['ashlee'],
    category: 'secret',
    execute(lang, message) {
        message.delete()
        message.channel.send(ashlee)
    }
}