const config = require('../../../lib/config')
const fs = require('fs')
module.exports = {
    name: 'reload',
    aliases: ['r'],
    usage: 'fox reload [command]',
    execute: async(lang, message, args, client) => {
        if (config.devs.includes(message.author.id)) {
            if (!args.length) return message.channel.send(`**Hey,** you gotta pass a command in to reload.`);
            const commandName = args[0].toLowerCase();
            const command = message.client.commands.get(commandName)

            if (!command) return message.channel.send(`There's no command with the name **${commandName}**.`);

            const commandFolders = fs.readdirSync('src/commands');
            const folderName = commandFolders.find(folder => fs.readdirSync(`src/commands/${folder}`).includes(`${commandName}.js`)); // ./commands/${folder}

            delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

            try {
                const newCommand = require(`../${folderName}/${command.name}.js`);
                message.client.commands.set(newCommand.name, newCommand);
                message.channel.send(`Gotcha, **${command.name}** was reloaded.`);
            } catch (error) {
                console.error(error);
                message.channel.send(`There was an error while reloading the command **${command.name}**:\n\`${error.message}\``);
            }
        }
    }
}