const { emojis: { secretCommands: { reese } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'reese',
    category: 'secret',
    execute({ message }) {

        message.delete()
        message.channel.send(reese[Math.floor(Math.random() * reese.length)])
    }
}