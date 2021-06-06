const Store = require('./Store');
const fs = require('fs')
const Language = require('./Language');
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
                let lang; 
                if (client instanceof Client) lang = new language();
                else lang = new language(client);
                
                if (client instanceof Client) client.languages.set(file.substring(0, file.length -3), lang);
                else client.client.languages.set(file.substring(0, file.length -3), lang);
            }
        } 
    }
}

module.exports = LanguageStore;