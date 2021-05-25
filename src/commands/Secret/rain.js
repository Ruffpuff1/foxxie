const { emojis: { secretCommands: { rain } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'rain',
    aliases: ['raindrop'],
    category: 'secret',
    execute({ message }) {

        message.delete()
        message.channel.send(rain)
    }
}