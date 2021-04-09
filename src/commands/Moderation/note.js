const mongo = require('../../../lib/structures/database/mongo')
const noteSchema = require('../../../lib/structures/database/schemas/noteSchema')
module.exports = {
    name: 'note',
    aliases: ['n'],
    usage: 'fox note [member] [note]',
    guildOnly: true,
    permissions: 'MANAGE_MESSAGES',
    execute: async(lang, message, args, client) => {
    
        const target = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!target) return message.channel.send("You need to provide **one member** to make a note of.")

        const guildId = message.guild.id
        const userId = target.id
        let reason = args.slice(1).join(' ')

        if (!reason) reason = 'No note specified'
        
        const note = {
            author: message.member.user.id,
            reason
        }
        
        await mongo () .then(async (mongoose) => {
            try {
                await noteSchema.findOneAndUpdate({
                    guildId,
                    userId
                }, {
                    guildId,
                    userId,
                    $push: {
                        notes: note
                    }
                }, {
                    upsert: true
                })
                message.react('✅')
            } finally {
                mongoose.connection.close()
            }
        })
        
    }
}