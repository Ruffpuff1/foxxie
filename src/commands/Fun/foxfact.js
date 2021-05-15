const request = require("request");
module.exports = {
    name: 'foxfact',
    aliases: ['ff', 'fxfact'],
    usage: 'fox foxfact',
    category: 'fun',
    execute: async(props) => {

        let { message, lang, language } = props

        let loading = await language.send("MESSAGE_LOADING", lang);
        try {
            request("https://some-random-api.ml/facts/fox", function (error, _response, body) {
                if (error) return language.send('COMMAND_FOXFACT_NOFACT', lang)
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