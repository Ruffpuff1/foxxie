const axios = require("axios")
module.exports = {
    name: 'topic',
    aliases: ['conversationstarter', 'conversationstarters', 'topics'],
    usage: `fox topic`,
    category: 'fun',
    execute: async ({ message }) => {

        const result = await axios.get(`https://www.conversationstarters.com/random.php`)
        if (!result) return message.responder.error();
        message.channel.send(result.data.slice(39));
    }
}