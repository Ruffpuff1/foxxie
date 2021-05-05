const { antiInvites } = require('../monitors/anti')
const { disboardBump } = require('../monitors/disboardBump')
const { commandHandler } = require('./commandHandler')
const { userMessageCount, guildMessageCount } = require('../tasks/stats')
const { mimuPick } = require('../../lib/util/theCornerStore')
const { afkCheck } = require('../tasks/afkcheck')
module.exports = {
	name: 'message',
	execute: async(message) => {

        // prevents bot dms
        if (!message.guild) return
        if (message.author.bot) return;

        if (message.content.toLowerCase() === '@everyone') return message.delete()
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return
        
        for (let monitor of ['anti', 'disboardbump']){
            message.client.monitors.get(monitor).execute(message)
        }
        // Botwide
        commandHandler(message)
        afkCheck(message)
        userMessageCount(message)
        guildMessageCount(message)
        // mimu pick command (The Corner Store)
        mimuPick(message)
    }
};