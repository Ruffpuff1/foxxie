const RoleplayCommand = require('~/lib/structures/RoleplayCommand');

module.exports = class extends RoleplayCommand {

    constructor(...args) {
        super('shoot', ['snipe', 'long-shot', 'quick-scope', 'driveby'], false, ...args)
    }
}