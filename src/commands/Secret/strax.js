const { emojis: { secretCommands: { strax } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'strax',
    aliases: ['straxy'],
    category: 'secret',
    execute(props) {

        let { message } = props
        message.delete();
        message.channel.send(strax)
    }
}