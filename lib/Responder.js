const { emojis, reactions } = require('../lib/util/constants');

class Responder {

    constructor(message) {
		this.message = message;
	}

    success(key, lang, ...args) {
        if (!key) return this.message.react(reactions.success)
        this.message.language.send(key, lang, ...args);
    }

    error(key, lang, ...args) { 
        if (!key) return this.message.react("❌");
        this.message.language.send(key, lang, ...args); 
    }

    lock() { this.message.react(reactions.lock) };

    unlock() { this.message.react(reactions.unlock) };
}

module.exports = Responder;