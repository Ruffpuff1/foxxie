const { emojis: { secretCommands: { strax } } } = require('../../../lib/util/constants')
module.exports = {
    name: 'strax',
    aliases: ['straxy'],
    execute(lang, message) {
        message.delete();
        message.channel.send(strax)
    }
}