const mongoose = require("mongoose");

module.exports = async () => {
    await mongoose.connect(process.env.MONGOPATH, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    return mongoose
}