const { emojis: { secretCommands: { sami } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'sami',
    aliases: ['sug4r', 'samira'],
    category: 'secret',
    execute(props) {

        let { message } = props
        message.delete()
        message.channel.send(sami)
    }
}