const { antiInvites } = require('../monitors/anti')
const { disboardBump } = require('../monitors/disboardBump')
const { commandHandler } = require('./commandHandler')
const { userMessageCount, guildMessageCount } = require('../monitors/stats')
const { mimuPick } = require('../../lib/util/theCornerStore')
const { antiInvitesEnabled } = require('../../lib/settings')
const { afkCheck } = require('../tasks/afkcheck')
module.exports = {
	name: 'message',
	execute: async(message) => {

        // prevents bot dms
        if (!message.guild) return
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