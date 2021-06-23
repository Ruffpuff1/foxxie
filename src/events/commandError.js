const { Event } = require('foxxie');

module.exports = class extends Event {

    constructor(...args) {
        super(...args, {
            event: 'commandError'
        })
    }

    async run(msg, command, _, error) {
        if (command.name === 'eval') return;
        if (error.message) msg.responder.error('ERROR_GENERIC', error.stack).catch(() => null);;

        if (error instanceof Error) {
            console.log(`[Command] ${command.name} | ${error.stack}`);
        } else {
            if (typeof error === 'string' && msg.language.language[error]) error = msg.language.get(error);
            msg.responder.error('ERROR_SHORT', error);
        }
    }
}