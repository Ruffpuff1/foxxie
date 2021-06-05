const { Collection } = require("discord.js");

class Store extends Collection {
    
    constructor(client, name, holds) {
        super()


    }

    toString() {
        return this.name;
    }
}

module.exports = Store;