require('dotenv').config()
const WolframAlphaAPI = require('wolfram-alpha-node');
const waApi = WolframAlphaAPI(process.env.WOLFRAMAPI);

module.exports = {
    name: 'wolfram',
    aliases: ['wa'],
    usage: 'fox wolfram [search]',
    category: 'utility',
    execute: async(props) => {

        let { message, args } = props;
        if (!args[0]) return message.responder.error('COMMAND_WOLFRAM_NO_ARGS');

        try {
            message.channel.send(await waApi.getShort(args.slice(0).join(' ')))
        } catch(e) {
            message.responder.error('COMMAND_WOLFRAM_NO_DATA');
        }
    }
}