require('dotenv').config()
const WolframAlphaAPI = require('wolfram-alpha-node');
const waApi = WolframAlphaAPI(process.env.WOLFRAMAPI);

module.exports = {
    name: 'wolfram',
    aliases: ['wa'],
    usage: 'fox wolfram [search]',
    category: 'utility',
    execute: async(props) => {

        let { lang, message, args, language } = props;
        if (!args[0]) return language.send('COMMAND_WOLFRAM_NO_ARGS', lang);

        try {
            message.channel.send(await waApi.getShort(args.slice(0).join(' ')))
        } catch(e) {
            language.send('COMMAND_WOLFRAM_NO_DATA', lang);
        }
    }
}