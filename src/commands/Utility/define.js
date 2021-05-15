const axios = require('axios')
require('dotenv').config()
module.exports = {
    name: 'define',
    aliases: ['def', 'word'],
    usage: 'fox define [word]',
    category: 'utility',
    execute: async (props) => {

        let { lang, message, args, language } = props;

        let word;
        let msg;
        if (!args[0]) msg = await language.send('COMMAND_DEFINE_NOARGS', lang)

        if (args[0]) return response()
        if (msg) return awaitResponse()

        async function awaitResponse(){
            message.channel.awaitMessages(m => message.author.id === m.author.id, { time: 60000, max: 1, errors: ['time'] })
            .then(async msgs => {
                if (msgs.first().content.toLowerCase() === 'cancel') return language.send('COMMAND_DEFINE_CANCELLED', lang)
                word = msgs.first().content;
                msg.edit(language.get("MESSAGE_LOADING", lang))

                let res = await axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.WEBSTERAPI}`)
                if (!res || !res.data[0] || !res.data[0]['hwi']) return msg.edit(language.get('COMMAND_DEFINE_NORESULTS', lang, word))

                msg.edit(`(${res.data[0]['fl']}) **${res.data[0]['hwi']['hw'].replace(/\*/gi, '\\*')}** [${res.data[0]['hwi']['prs'][0]['mw']}]
- ${res.data[0]['shortdef'][0]}\n${res.data[0]['shortdef'][1]
?`- ${res.data[0]['shortdef'][1]}`:''}`)
            })    
        }
        
        async function response(){
            word = args[0].toLowerCase()
            msg = await language.send("MESSAGE_LOADING", lang)

            let res = await axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.WEBSTERAPI}`)
            if (!res || !res.data[0] || !res.data[0]['hwi']) return msg.edit(language.get('COMMAND_DEFINE_NORESULTS', lang, word))

            msg.edit(`(${res.data[0]['fl']}) **${res.data[0]['hwi']['hw'].replace(/\*/gi, '\\*')}** [${res.data[0]['hwi']['prs'][0]['mw']}]
- ${res.data[0]['shortdef'][0]}\n${res.data[0]['shortdef'][1]
?`- ${res.data[0]['shortdef'][1]}`:''}`)
        }
    }}