const { emojis: { secretCommands: { ruff } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'ruff',
    category: 'secret',
    execute(lang, message) {
        message.delete();
        message.channel.send(ruff)
    }
}