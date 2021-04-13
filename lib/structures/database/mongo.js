const mongoose = require("mongoose");
require('dotenv').config()

module.exports = async () => {
    await mongoose.connect(process.env.MONGOPATH, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    return mongoose
}