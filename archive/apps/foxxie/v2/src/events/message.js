const { antiInvites } = require('../monitors/anti')
const { disboardBump } = require('../monitors/disboardBump')
const { commandHandler } = require('./commandHandler')
const { userMessageCount, guildMessageCount } = require('../monitors/stats')
const { mimuPick } = require('../../lib/util/theCornerStore')
const { afkCheck } = require('../tasks/afkcheck')
module.exports = {
	name: 'message',
	execute: async(message) => {

        // prevents bot dms
        if (!message.guild) return

        if (message.content.toLowerCase() === '@everyone') return message.delete()

        // let messageAttachment = message.attachments.size > 0 ? message.attachments.array()[0].url : null
        // if (messageAttachment) message.channel.send(messageAttachment)
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return
        // Botwide
        antiInvites(message)
        disboardBump(message)
        commandHandler(message)
        afkCheck(message)
        userMessageCount(message)
        guildMessageCount(message)
        // mimu pick command (The Corner Store)
        mimuPick(message)
    }
};