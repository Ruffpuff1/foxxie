const axios = require("axios")
module.exports = {
    name: 'topic',
    aliases: ['conversationstarter', 'conversationstarters', 'topics'],
    usage: `fox topic`,
    category: 'fun',
    execute: async (lang, message) => {
        axios.get(`https://www.conversationstarters.com/random.php`)
        .then((res) => {
            message.channel.send(res.data.slice(39))
        })
        .catch((err) => {
            message.channel.send(err)
        })
    }
}