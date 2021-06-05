const axios = require("axios");
const Command = require('../../../lib/structures/Command');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'topic',
            aliases: ['conversationstarter', 'conversationstarters', 'topics'],
            description: language => language.get('COMMAND_TOPIC_DESCRIPTION'),
            usage: `fox topic`,
            category: 'fun',
        })
    }

    async run(msg) {

        const result = await axios.get(`https://www.conversationstarters.com/random.php`)
        if (!result) return msg.responder.error();
        msg.channel.send(result.data.slice(39));
    }
}