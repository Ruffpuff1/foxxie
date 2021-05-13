const mongo = require('../../../lib/structures/database/mongo')
const { userSchema } = require('../../../lib/structures/database/UserSchema.js')
module.exports = {
    name: 'note',
    aliases: ['n'],
    usage: 'fox note [member|userId] [note]',
    category: 'moderation',
    permissions: 'MANAGE_MESSAGES',
    execute: async(props) => {

        let { message, args } = props
    
        const target = message.mentions.users.first() || message.guild.members.cache.get(args[0]).user;
        if (!target) return message.channel.send("You need to provide **one member** to make a note of.")

        const guildId = message.guild.id
        const userId = target.id
        let reason = args.slice(1).join(' ')

        if (!reason) reason = 'No note specified'
        
        const note = {
            author: message.member.user.id,
            reason
        }
        
        let guild = `servers.${guildId}.notes`

        await mongo () .then(async (mongoose) => {
            try {
                await userSchema.findByIdAndUpdate({
                    _id: userId,
                    "servers._id": '[guildId]'
                }, {
                    _id: userId,
                    $push: {
                         [guild]: note }
                }, {
                    upsert: true
                })
                message.responder.success();
            } finally {}
        })
        
    }
}