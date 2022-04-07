const { AutomationCommand } = require('#structures');

module.exports = class extends AutomationCommand {

    constructor(...args) {
        super('disboard', { ping: true }, ...args, { aliases: ['ds', 'disboard-settings'] });
    }

};
