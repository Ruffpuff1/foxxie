const axios = require('axios');
require('dotenv').config();

module.exports = {
    name: 'define',
    aliases: ['def', 'word'],
    usage: 'fox define [word]',
    category: 'utility',
    async execute(props) {

        let { lang, args, language, message } = props;

        let msg;
        if (!args[0]) msg = await language.send('COMMAND_DEFINE_NOARGS', lang);
        if (args[0]) return this._response(props, msg, args[0].toLowerCase());
        if (msg) return message.awaitResponse(props, msg, this._response)
        
    },

    async _response({ language, lang }, msg, word){
        
        if (msg) msg = await msg.edit(language.get("MESSAGE_LOADING", lang));
        if (!msg) msg = await language.send("MESSAGE_LOADING", lang);

        let res = await axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.WEBSTERAPI}`)
        if (!res || !res.data[0] || !res.data[0]['hwi']) return msg.edit(language.get('COMMAND_DEFINE_NORESULTS', lang, word))

        msg.edit(`(${res.data[0]['fl']}) **${res.data[0]['hwi']['hw'].replace(/\*/gi, '\\*')}** [${res.data[0]['hwi']['prs'][0]['mw']}]
- ${res.data[0]['shortdef'][0]}\n${res.data[0]['shortdef'][1]
?`- ${res.data[0]['shortdef'][1]}`:''}`)
    }
}