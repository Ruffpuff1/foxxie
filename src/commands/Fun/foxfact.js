const request = require("request");
const axios = require('axios');
module.exports = {
    name: 'foxfact',
    aliases: ['ff', 'fxfact'],
    usage: 'fox foxfact',
    category: 'fun',
    execute: async({ message, lang, language }) => {

        let loading = await language.send("MESSAGE_LOADING", lang);
        const txt = await axios.get('https://some-random-api.ml/facts/fox').catch(() => null);
        
        if (!txt) {
            language.send('COMMAND_FOXFACT_NOFACT', lang);
            return loading.delete();
        }
        message.channel.send(txt.data.fact);
        loading.delete();
    }
}