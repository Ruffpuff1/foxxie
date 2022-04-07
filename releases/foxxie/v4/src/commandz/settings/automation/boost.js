const { AutomationCommand } = require('#structures');

module.exports = class extends AutomationCommand {

    constructor(...args) {
        super('boost', {
            embed: true,
            color: true,
            avatar: true
        }, ...args, {
            aliases: ['bs', 'boost-settings']
        });
    }

};