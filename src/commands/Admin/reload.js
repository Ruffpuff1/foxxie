const { Command, Stopwatch, Store } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['r'],
            description: language => language.get('COMMAND_RELOAD_DESCRIPTION'),
            usage: '[Piece | Store | everything]',
            permissionLevel: 10,
            category: 'admin',
        })
    }

    async run (message, [piece = 'everything']) {

        if (piece === 'everything') return this.everything(message);
        else piece = this.client.pieceStores.get(piece) || this.client.events.get(piece) || this.client.commands.get(piece) || this.client.monitors.get(piece) || this.client.languages.get(piece) || this.client.inhibitors.get(piece) || this.client.tasks.get(piece);
        if (!piece) return message.responder.error('COMMAND_RELOAD_NONE');
        if (piece instanceof Store) {
            const timer = new Stopwatch(0);
            const loading = await message.responder.loading();
            await piece.loadAll();
            await piece.init();
            message.responder.success(`COMMAND_RELOAD_SUCCESS`, piece.name, 'store', timer.toString());
            return loading.delete();
        }

        try {
            const itm = await piece.reload();
            const timer = new Stopwatch(0);
            message.responder.success(`COMMAND_RELOAD_SUCCESS`, itm.name, itm.type, timer.toString());
        } catch (err) {
            piece.store.set(piece);
            return message.responder.error('COMMAND_RELOAD_ERROR', piece.type, err.stack);
        }
    }

    async everything(message) {
            const timer = new Stopwatch(0);
            const loading = await message.responder.loading();
            await Promise.all(
                    this.client.pieceStores.map(async (store) => {
                            await store.loadAll();
                            await store.init();
                    })
            )
            message.responder.success('COMMAND_RELOAD_EVERYTHING', timer.toString());
            return loading.delete();
    }
}