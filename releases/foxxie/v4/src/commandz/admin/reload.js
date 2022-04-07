const { Stopwatch, Store } = require('@foxxie/tails');
const { FoxxieCommand } = require('#structures');
const { sendSuccess, sendLang } = require('#messages');

module.exports = class extends FoxxieCommand {

    constructor(...args) {
        super(...args, {
            aliases: ['r'],
            usage: '<Piece:piece|Store:store|everything:default>',
            permissionLevel: 10
        });
    }

    async run(message, [piece]) {
        if (piece === 'everything') return this.everything(message);
        if (piece instanceof Store) {
            const timer = new Stopwatch(0);
            await piece.loadAll();
            await piece.init();
            return sendLang(message, this.t.success, { name: piece.name, context: 'Store', time: timer.toString() });
        }

        try {
            const itm = await piece.reload();
            const timer = new Stopwatch(0);
            return sendSuccess(message, this.t.success, { name: itm.name, type: itm.type, time: timer.toString() });
        } catch (err) {
            piece.store.set(piece);
            const { name } = piece;
            const { stack } = err;
            return sendLang(message, this.t.error, { name, stack });
        }
    }

    async everything(message) {
        const timer = new Stopwatch(0);
        await Promise.all(
            this.client.pieceStores.map(async store => {
                await store.loadAll();
                await store.init();
            })
        );
        return sendSuccess(message, this.t.success, { time: timer.toString(), context: 'Everything' });
    }

};
