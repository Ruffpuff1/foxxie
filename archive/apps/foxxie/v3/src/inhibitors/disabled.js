const { Inhibitor } = require('@foxxie/tails');

module.exports = class extends Inhibitor {

    constructor(...args) {
        super(...args, {
            name: 'disabled'
        })
    }

	async run(_, command) {
        const blocked = await this.client.settings.get('blockedPieces');
		if (blocked?.includes(command.name)) return true;
        if (command.disabled) return true;
	}
};
