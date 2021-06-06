const { Message } = require("discord.js");
const fs = require('fs');
const { Command, AliasStore } = require('foxxie');

class CommandStore extends AliasStore {

    constructor(client) {
        super(client, 'commands', Command);
    }

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


}

module.exports = CommandStore