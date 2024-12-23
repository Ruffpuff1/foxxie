const RoleplayCommand = require('~/lib/structures/RoleplayCommand');

module.exports = class extends RoleplayCommand {

    constructor(...args) {
        super('shrug', ['whatever', 'whateves', 'shrugs'], true, ...args)
    }
}