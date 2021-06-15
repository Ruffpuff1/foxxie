require('dotenv').config()
const WolframAlphaAPI = require('wolfram-alpha-node');
const { getShort } = WolframAlphaAPI(process.env.WOLFRAMAPI);
const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'wolfram',
            aliases: ['wa'],
            usage: '[Search]',
            category: 'utility'
        })
    }

    async run(msg, args) {
        if (!args[0]) return msg.responder.error('COMMAND_WOLFRAM_NOARGS');

        try {
            msg.channel.send(await getShort(args.slice(0).join(' ')));
        } catch(e) {
            msg.responder.error('COMMAND_WOLFRAM_NODATA')
        }
    }
}