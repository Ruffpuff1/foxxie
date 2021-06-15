const { Inhibitor } = require('foxxie');

module.exports = class extends Inhibitor {

    constructor(...args) {
        super(...args, {
            name: 'nsfw'
        })
    }

	run(message, command) {
		if (command.nsfw && !message.channel.nsfw) throw message.language.get('INHIBITOR_NSFW');
	}
};
