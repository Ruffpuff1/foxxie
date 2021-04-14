const Discord = require('discord.js')
const fs = require('fs')
const { getGuildLang } = require('../../lib/util/getGuildLang')
const { codeError, permError } = require('../../lib/util/error')
module.exports.commandHandler = (message) => {

    if (message.author.bot) return;
    let lang = getGuildLang(message)

    message.client.commands = new Discord.Collection();
    const commandFolders = fs.readdirSync('./src/commands');
        
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            message.client.commands.set(command.name, command);
        }
    }

    if (message.content.startsWith('..')) {
        if (message.author.bot) return
        const args = message.content.slice(2).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) return permError(lang, message, command)  
        };    

        try {
            let client = message.client
            command.execute(lang, message, args, client)
        } catch (error) {
            console.error(error);
            return codeError(lang, message)
        }
    }

    if (message.content.toLowerCase().startsWith('fox')) {
        if (message.author.bot) return
        const args = message.content.slice(3).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) return permError(lang, message, command)  
        };    

        try {
            let client = message.client
            command.execute(lang, message, args, client)
        } catch (error) {
            console.error(error);
            return codeError(lang, message)
        }
    }
}