const { get } = require('axios');
require('dotenv').config();
const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'define',
            aliases: ['def', 'word'],
            description: language => language.get('COMMAND_DEFINE_DESCRIPTION'),
            usage: '[Word]',
            category: 'utility'
        })
    }

    async run(message, [word]) {
        let msg;
        if (!word) msg = await message.responder.error('COMMAND_DEFINE_NOARGS');
        if (word) return this._response(message, msg, word.toLowerCase());
        if (msg) return message.awaitResponse(message, msg, this._response)
    }

    async _response(message, msg, word){
        if (msg) msg = await msg.edit(message.language.get("MESSAGE_LOADING"));
        if (!msg) msg = await message.responder.loading();

        let res = await get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.WEBSTERAPI}`)
        if (!res || !res.data[0] || !res.data[0]['hwi']) return msg.edit(message.language.get('COMMAND_DEFINE_NORESULTS', word))

        msg.edit(`(${res.data[0]['fl']}) **${res.data[0]['hwi']['hw'].replace(/\*/gi, '\\*')}** [${res.data[0]['hwi']['prs'][0]['mw']}]
- ${res.data[0]['shortdef'][0]}\n${res.data[0]['shortdef'][1]
?`- ${res.data[0]['shortdef'][1]}`:''}`)
    }
}