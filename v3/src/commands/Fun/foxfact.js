const req = require('@aero/centra');
const { Command } = require('@foxxie/tails');

module.exports = class extends Command {
    
    constructor(...args) {
        super(...args, {
            name: 'foxfact',
            description: language => language.get('COMMAND_FOXFACT_DESCRIPTION'),
            aliases: ['ff', 'rufffact'],
            category: 'fun'
        })
    }

    async run(msg) {

        const loading = await msg.responder.loading();
        const { fact } = await req('https://some-random-api.ml/facts/fox').json().catch(() => null);

        if (!fact) {
            msg.responder.error('COMMAND_FOXFACT_NOFACT');
            return loading.delete();
        }
        msg.channel.send(fact);
        return loading.delete();
    }
}