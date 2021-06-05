const RoleplayCommand = require('../../../lib/structures/RoleplayCommand');

module.exports = class extends RoleplayCommand {

    constructor(...args) {
        super('wave', ['hello', 'greet', 'bye', 'goodbye', 'hi', 'hey'], true, ...args)
    }
}