const { Message } = require("discord.js");
const fs = require('fs');
const { Command, AliasStore } = require('foxxie');

class CommandStore extends AliasStore {

    constructor(client) {
        super(client, 'commands', Command);
    }

    launch(arg) {

        const commandFolders = fs.readdirSync('./src/commands');

        commandFolders.forEach(async folder => {

            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
            await commandFiles.forEach(async file => await this.setFile(arg, file, folder));
        })
    }

    setFile(client, file, folder) {
     
        const command = require(`../src/commands/${folder}/${file}`);

        if (typeof command === 'function') {
            
            const cmd = new command(client);
            
            client.commands.set(cmd);
            client.commands.init(cmd.name);
        }
    }


}

module.exports = CommandStore