const config = require('../../../lib/config')
const WolframAlphaAPI = require('wolfram-alpha-api');
const waApi = WolframAlphaAPI(config.wolframAPI);
module.exports = {
    name: 'wolfram',
    aliases: ['wa'],
    usage: 'fox wolfram [search]',
    execute: async(lang, message, args) => {
        if (!args[0]) return message.channel.send(lang.COMMAND_WOLFRAM_NO_ARGS)
        waApi.getShort(args.slice(0).join(' ')).then((res) => message.channel.send(res)).catch((err) => {
        message.channel.send(lang.COMMAND_WOLFRAM_NO_DATA)
        console.error(err)});
    }
}