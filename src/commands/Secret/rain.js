const { emojis: { secretCommands: { rain } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'rain',
    aliases: ['raindrop'],
    category: 'secret',
    execute(props) {

        let { message } = props
        message.delete()
        message.channel.send(rain)
    }
}