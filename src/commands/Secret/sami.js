const { emojis: { secretCommands: { sami } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'sami',
    aliases: ['sug4r', 'samira'],
    category: 'secret',
    execute({ message }) {

        message.delete()
        message.channel.send(sami)
    }
}