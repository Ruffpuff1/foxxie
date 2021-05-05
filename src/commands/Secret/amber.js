const { emojis: { secretCommands: { amber } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'amber',
    aliases: ['ori', 'fokushi-dev'],
    category: 'secret',
    execute(props) {

        let { message } = props
        message.delete()
        message.channel.send(amber)
    }
}