class Language {

    constructor(message) {
		this.message = message;
	}

    get(key, lang, ...args) {
        try {
            let res = this.message.client.languages.get(lang)[key](...args);
            if (res?.length === 0) res = this.message.client.languages.get(lang)["DEFAULT"](key);
            return res;
        } catch (e) {
            
            let tr = this.message.client.languages.get(lang)[key];
            if (!tr) tr = this.message.client.languages.get(lang)["DEFAULT"](key);
            if (tr?.length === 0) tr = this.message.client.languages.get(lang)["DEFAULT"](key);
            return tr; 
        };
    }

    async send(key, lang, ...args) {
        try {
            let response = this.message.client.languages.get(lang)[key](...args);
            if (response?.length === 0) response = this.message.client.languages.get(lang)["DEFAULT"](key);
            return this.message.channel.send(response);
        } catch (e) {

            let tr = this.message.client.languages.get(lang)[key];
            if (!tr) tr = this.message.client.languages.get(lang)["DEFAULT"](key);
            if (tr === 0) tr = this.message.client.languages.get(lang)["DEFAULT"](key);
            return this.message.channel.send(tr)
        }
    }
}

module.exports = Language;