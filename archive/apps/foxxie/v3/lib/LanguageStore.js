const fs = require('fs')
const { Language, Store, Util } = require('foxxie');
const { Client } = require('discord.js');

class LanguageStore extends Store {

    constructor(client) {
        super(client, 'languages', Language);
    
    }

    launch(client) {

        const langFiles = fs.readdirSync(`./src/languages`).filter(file => file.endsWith('.js'));
        for (const file of langFiles) {
            const language = require(`../src/languages/${file}`);
            if (Util.isClass(language)) {
                let lang = new language(client)
                client.languages.set(lang, file.substring(0, file.length - 3));
            }
            else console.log(`[Foxxie-Util] The language in ${file} can only be an instance of a Language class.`)
        } 
    }
}

module.exports = LanguageStore; 