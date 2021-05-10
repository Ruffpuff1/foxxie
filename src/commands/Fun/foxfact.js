const request = require("request");
module.exports = {
    name: 'foxfact',
    aliases: ['ff', 'fxfact'],
    usage: 'fox foxfact',
    category: 'fun',
    execute: async(props) => {

        let { message, lang, language } = props

        const loading = await message.channel.send(language.get("MESSAGE_LOADING", 'en-US'));
        try {
            request("https://some-random-api.ml/facts/fox", function (error, _response, body) {
                if (error) return message.responder.error('RESPONDER_ERROR_FOXFACT', lang)
                                    .then(() => console.error(error.message));
    
                const json = JSON.parse(body);
                const { fact } = json;
    
                loading.delete()
                message.channel.send(fact)
            });
        } catch (e) {
            loading.delete()
            console.error(e.message);
        }
    }
}