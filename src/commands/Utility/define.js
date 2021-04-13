const axios = require('axios')
require('dotenv').config()
module.exports = {
    name: 'define',
    aliases: ['def', 'word'],
    usage: 'fox define [word]',
    category: 'utility',
    execute(lang, message, args) {
        let word;
        if (!args[0]) { message.channel.send(lang.COMMAND_DEFINE_NO_WORD).then(resultMessage => {
        
            const filter = m => message.author.id === m.author.id;
        
            message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
            .then(messages => {
                if (messages.first().content.toLowerCase() === 'cancel') return message.channel.send('Command **cancelled**.')
                word = messages.first().content
                resultMessage.edit(lang.COMMAND_MESSAGE_LOADING).then(resultMessage => {

                axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.WEBSTERAPI}`)
                .then((res) => {
                    resultMessage.edit(`(${res.data[0]['fl']}) **${res.data[0]['hwi']['hw']}** [${res.data[0]['hwi']['prs'][0]['mw']}]
- ${res.data[0]['shortdef'][0]}\n${res.data[0]['shortdef'][1]
?`- ${res.data[0]['shortdef'][1]}`:''}`)

                })
                    .catch((err) => {
                        console.error(err)
                        resultMessage.edit(lang.COMMAND_DEFINE_NO_DATA)
                    })
                })
            })
                .catch(() => {});
        });
return } 
        word = args[0].toLowerCase()

        message.channel.send(lang.COMMAND_MESSAGE_LOADING).then(resultMessage => {

        axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${process.env.WEBSTERAPI}`)
        .then((res) => {
            message.channel.send(`(${res.data[0]['fl']}) **${res.data[0]['hwi']['hw']}** [${res.data[0]['hwi']['prs'][0]['mw']}]
- ${res.data[0]['shortdef'][0]}\n${res.data[0]['shortdef'][1]
?`- ${res.data[0]['shortdef'][1]}`:''}`)

        resultMessage.delete()
        })
            .catch((err) => {
                console.error(err)
                resultMessage.delete()
                message.channel.send(lang.COMMAND_DEFINE_NO_DATA)
            })
        })
    }
}