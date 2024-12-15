const RoleplayCommand = require('~/lib/structures/RoleplayCommand');

module.exports = class extends RoleplayCommand {

    constructor(...args) {
        super('hug', ['facefuck'], false, ...args)
    }
}