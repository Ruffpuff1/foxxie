const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');

module.exports = class extends RoleplayCommand {

    constructor(...args) {
        super('stab', ['knife', 'shank'], false, ...args)
    }
}