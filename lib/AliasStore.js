const { Collection } = require('discord.js');
const Store = require('./Store');
const fs = require("fs");

class AliasStore extends Store {

    constructor(...args) {
        super(...args)
        this.aliases = new Collection()
    }

    get(name) {
		return super.get(name) || this.aliases.get(name);
	}

    has(name) {
		return super.has(name) || this.aliases.has(name);
	}

    init(name) {
        const cmd = super.get(name);
        if (!cmd || !cmd.aliases) return;
        cmd.aliases.forEach(a => this.aliases.set(a, cmd));
        return;
    }

    clear() {
		super.clear();
		this.aliases.clear();
	}

}

module.exports = AliasStore;