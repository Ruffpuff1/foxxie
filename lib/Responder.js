const { emojis, reactions } = require('../lib/util/constants');

class Responder {

    constructor(message) {
		this.message = message;
	}

    loading(key) {
        if (!key) key = 'MESSAGE_LOADING';
        this.message.channel.send(this.message.language.get(key));
    }

    success(key, ...args) {
        if (!key) return this.message.react(reactions.success)
        this.message.channel.send(this.message.language.get(key, ...args));
    }

    error(key, ...args) { 
        if (!key) return this.message.react("❌");
        this.message.channel.send(this.message.language.get(key, ...args)); 
    }

    lock() { this.message.react(reactions.lock) };

    unlock() { this.message.react(reactions.unlock) };
}

module.exports = Responder;