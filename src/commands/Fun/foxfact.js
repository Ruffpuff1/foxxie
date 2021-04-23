const request = require("request");
module.exports = {
    name: 'foxfact',
    aliases: ['ff', 'fxfact'],
    usage: 'fox foxfact',
    category: 'fun',
    execute: async(lang, message, args) => {
        const loading = await message.channel.send(lang.COMMAND_MESSAGE_LOADING);
        try {
            request("https://some-random-api.ml/facts/fox", function (error, _response, body) {
                if (error) return message.channel.send("**Whoops,** looks like an error occured while fetching a fact.")
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