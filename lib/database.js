const mongo = require('./structures/database/mongo')
module.exports.mongoDB = async () => {
    await mongo().then(() => {
        try {
            console.log(`[MongoDB] Connection test successful.`)
        } finally {}
    })
}