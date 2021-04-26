const Discord = require('discord.js')
const fs = require('fs')
const { getGuildLang } = require('../../lib/util/getGuildLang')
const { codeError, permError, channelError } = require('../../lib/util/error')
const { serverSettings } = require('../../lib/settings')
module.exports.commandHandler = async (message) => {
    
    if (message.author.bot) return;

    const settings = await serverSettings(message)
    
    let prefix;
    prefix = message.client.user.id === '812546582531801118' ? '.' : 'd.'
    if (settings != null && settings.prefix != null) prefix = settings.prefix;

    if (settings != null && settings.blockedUsers != null) {
        if (settings.blockedUsers.includes(message.author.id)) return;
    }

    let mentionPrefix = `<@!${message.client.user.id}>`

    if (message.content.startsWith(mentionPrefix) && message.content.length === mentionPrefix.length) {
        message.channel.send(`Heya! My prefixes are \`fox \` and \`${prefix}\`. Try out \`fox help\` to get all my commands.`)
        .then(msg => {setTimeout(() => msg.delete(), 30000)});

    };

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

    if (message.content.startsWith(prefix)) {
        if (message.author.bot) return
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        if (message.guild.id === '825853736768372746' && message.channel.id === '825853736768372751') return channelError(lang, message)

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

        if (message.guild.id === '825853736768372746' && message.channel.id === '825853736768372751') return channelError(lang, message)

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