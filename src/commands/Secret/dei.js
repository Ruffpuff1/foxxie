const { emojis: { secretCommands: { dei } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'dei',
    aliases: ['connor'],
    category: 'secret',
    execute(props) {

        let { message } = props
        message.delete()
        message.channel.send(dei)
    }
}