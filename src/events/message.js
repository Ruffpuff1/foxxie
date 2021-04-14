const { antiInvites } = require('../monitors/anti')
const { disboardBump } = require('../monitors/disboardBump')
const { commandHandler } = require('./commandHandler')
const { userMessageCount, guildMessageCount } = require('../monitors/stats')
const { mimuPick } = require('../../lib/util/theCornerStore')
const { antiInvitesEnabled } = require('../../lib/settings')
module.exports = {
	name: 'message',
	execute: async(message) => {

        // prevents bot dms
        if (message.channel.type === 'dm') return
        // Botwide
        antiInvites(message)
        disboardBump(message)
        commandHandler(message)
        userMessageCount(message)
        guildMessageCount(message)
        // mimu pick command (The Corner Store)
        mimuPick(message)
    }
};