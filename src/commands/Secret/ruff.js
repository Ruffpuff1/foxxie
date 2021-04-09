const { emojis: { secretCommands: { ruff } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'ruff',
    guildOnly: true,
    execute(lang, message) {
        message.delete();
        message.channel.send(ruff)
    }
}