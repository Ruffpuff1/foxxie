const axios = require('axios');
const { Command } = require('foxxie');

module.exports = class extends Command {
    
    constructor(...args) {
        super(...args, {
            name: 'foxfact',
            aliases: ['ff', 'rufffact'],
            category: 'fun'
        })
    }

    async run(msg) {

        const loading = await msg.responder.loading();
        const txt = await axios.get('https://some-random-api.ml/facts/fox').catch(() => null);

        if (!txt) {
            msg.responder.error('COMMAND_FOXFACT_NOFACT');
            return loading.delete();
        }
        msg.channel.send(txt.data.fact);
        return loading.delete();
    }
}