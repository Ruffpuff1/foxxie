const { Message } = require("discord.js");
const fs = require('fs');
const { Command, AliasStore, Util } = require('foxxie');

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

        if (Util.isClass(command)) {
            
            const cmd = new command(client);
            
            client.commands.set(cmd);
            client.commands.init(cmd.name);
        }
        else console.log(`[Foxxie-Util] The command in ${file} can only be an instance of a Command class.`)
    }


}

module.exports = CommandStore