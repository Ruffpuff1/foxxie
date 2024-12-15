const { emojis: { secretCommands: { amber } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'amber',
    aliases: ['ori', 'fokushi-dev'],
    category: 'secret',
    execute(lang, message) {
        message.delete()
        message.channel.send(amber)
    }
}