const mongo = require('./mongo')
module.exports.mongoDB = async () => {
        await mongo().then(mongoose => {
            try {
                console.log(`Connected to MongoDB`)
            } finally {}
        })
}