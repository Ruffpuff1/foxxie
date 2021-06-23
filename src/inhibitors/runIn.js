const { Inhibitor } = require('foxxie');

module.exports = class extends Inhibitor {

    constructor(...args) {
        super(...args, {
            name: 'runIn'
        })
    }

    run(msg, command) {
        if (!command.runIn.length) throw msg.language.get('INHIBITOR_RUNIN_NONE', command.name);
		if (!command.runIn.includes(msg.channel.type)) throw msg.language.get('INHIBITOR_RUNIN', command.runIn.join(', '));
    }
}