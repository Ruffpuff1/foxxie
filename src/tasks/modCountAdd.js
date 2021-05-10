// const mongo = require('../../lib/structures/database/mongo')
// const modStatsSchema = require('../../lib/structures/database/schemas/server/moderation/modStatsSchema')
// module.exports.getModCount = async (message, member) => {
//     await mongo().then(async () => {
//         try {
//             this.modCount = await modStatsSchema.findOne({
//                 guildId: message.guild.id,
//                 userId: member.user.id
//             })
//             return this.modCount
//         } finally {}
//     })
//     return this.modCount
// }