const axios = require('axios');
module.exports = {
    name: 'foxfact',
    aliases: ['ff', 'fxfact'],
    usage: 'fox foxfact',
    category: 'fun',
    execute: async({ message }) => {

        let loading = await message.responder.loading();
        const txt = await axios.get('https://some-random-api.ml/facts/fox').catch(() => null);
        
        if (!txt) {
            message.responder.error('COMMAND_FOXFACT_NOFACT');
            return loading.delete();
        }
        message.channel.send(txt.data.fact);
        loading.delete();
    }
}