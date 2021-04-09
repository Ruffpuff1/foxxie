const { emojis: { secretCommands: { reese } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'reese',
    guildOnly: true,
    execute(lang, message) {
        message.delete()
        message.channel.send(reese)
    }
}