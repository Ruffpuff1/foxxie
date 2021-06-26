const LGBTCommand = require('~/lib/structures/LGBTCommand');

module.exports = class extends LGBTCommand {

    constructor(...args) {
        super('transsexual', ['trans', 'transgender'], ...args)
    }
}