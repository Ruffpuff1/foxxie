const { emojis: { secretCommands: { ruff } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'ruff',
    category: 'secret',
    execute(props) {

        let { message } = props
        message.delete();
        message.channel.send(ruff)
    }
}