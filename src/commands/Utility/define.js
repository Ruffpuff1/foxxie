const axios = require('axios');
require('dotenv').config();

module.exports = {
    name: 'define',
    aliases: ['def', 'word'],
    usage: 'fox define [word]',
    category: 'utility',
    async execute(props) {

        let { args, message } = props;

        let msg;
        if (!args[0]) msg = await message.responder.error('COMMAND_DEFINE_NOARGS');
        if (args[0]) return this._response(props, msg, args[0].toLowerCase());
        if (msg) return message.awaitResponse(props, msg, this._response)
        
    },

    async _response({ language, message }, msg, word){
        
        if (msg) msg = await msg.edit(language.get("MESSAGE_LOADING"));
        if (!msg) msg = await message.responder.loading();

        let res = await axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.WEBSTERAPI}`)
        if (!res || !res.data[0] || !res.data[0]['hwi']) return msg.edit(language.get('COMMAND_DEFINE_NORESULTS', word))

        msg.edit(`(${res.data[0]['fl']}) **${res.data[0]['hwi']['hw'].replace(/\*/gi, '\\*')}** [${res.data[0]['hwi']['prs'][0]['mw']}]
- ${res.data[0]['shortdef'][0]}\n${res.data[0]['shortdef'][1]
?`- ${res.data[0]['shortdef'][1]}`:''}`)
    }
}