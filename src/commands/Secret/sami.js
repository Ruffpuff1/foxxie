const { emojis: { secretCommands: { sami } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'sami',
    aliases: ['sug4r', 'samira'],
    guildOnly: true,
    execute(lang, message) {
        message.delete()
        message.channel.send(sami)
    }
}