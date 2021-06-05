class Language {

    constructor(message) {
        this.message = message;
        this.client = message?.client;
	}

    get(term, ...args) {

        const lang = this.getLang() || this.getGuild() || 'en_US';
        const language = this.client.languages.get(lang).language;
        const value = language[term];

        switch (typeof value) {
            case 'function': return value(...args);
            case 'undefined':
                if (language['DEFAULT']) return language['DEFAULT'](term);
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