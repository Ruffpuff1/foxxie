const { emojis: { secretCommands: { ashlee } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'ash',
    aliases: ['ashlee'],
    category: 'secret',
    execute(props) {

        let { message } = props
        message.delete()
        message.channel.send(ashlee)
    }
}