const fs = require('fs')
const { Language, Store } = require('foxxie');
const { Client } = require('discord.js');

class LanguageStore extends Store {

    constructor(client) {
        super(client, 'languages', Language);
    
    }

    launch(client) {

        const langFiles = fs.readdirSync(`./src/languages`).filter(file => file.endsWith('.js'));
        for (const file of langFiles) {
            const language = require(`../src/languages/${file}`);
            if (typeof language === 'function') {
                let lang = new language(client)
                client.languages.set(lang, file.substring(0, file.length - 3));
            }
        } 
    }
}

module.exports = LanguageStore;