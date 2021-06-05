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

        /*
        launch(arg) {

        const commandFolders = fs.readdirSync('./src/commands');

        for (const folder of commandFolders) {

            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {

                const command = require(`../src/commands/${folder}/${file}`);
                if (typeof command === 'function') {
                    let cmd, cli;
                    if (arg instanceof Message) cmd = new command(arg.language);
                    else cmd = new command();

                    if (arg instanceof Message) cli = arg.client;
                    else cli = arg;
                    cli.commands.set(file.substring(0, file.length -3), cmd);
                    cli.commands.init(cmd.name);
                }
            }
        }
    }
    */
    }
}

module.exports = LanguageStore;