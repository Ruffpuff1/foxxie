const { AutomationCommand } = require('#structures');

module.exports = class extends AutomationCommand {

    constructor(...args) {
        super('goodbye', {
            embed: true,
            timeout: true,
            color: true,
            avatar: true
        }, ...args, {
            aliases: ['gs', 'goodbye-settings']
        });
    }

};
