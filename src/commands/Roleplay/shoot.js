const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');

module.exports = class extends RoleplayCommand {

    constructor(...args) {
        super('shoot', ['snipe', 'longshot', 'quickscope', 'driveby'], false, ...args)
    }
}