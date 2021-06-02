class Language {

    constructor(message) {
        this.message = message;
        this.client = message.client;
        this.lang = this.getLang() || this.getGuild() || 'en-US';
	}

    get(term, ...args) {

        const value = this.client.languages.get(this.lang)[term];

        switch (typeof value) {
            case 'function': return value(...args);
            case 'undefined':
                if (this.client.languages.get(this.lang)['DEFAULT']) return this.client.languages.get(this.lang)['DEFAULT'](term);
            default: return value;
        }
    }

    getLang() {
        async function lng () {
            let lng = await this.message.guild.settings.get('language');
            return lng;
        }
    }

    getGuild() {
        async function guild () {
            let lng = await this.message.settings.get('language');
            return lng;
        }
    }
}

module.exports = Language;