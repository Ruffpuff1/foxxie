const Discord = require('discord.js')
const fs = require('fs')
const { prefix: { production, development } } = require('../../config/foxxie')
const { getGuildLang } = require('../../lib/util/getGuildLang')
module.exports.commandHandler = async (message) => {
    
    if (message.author.bot) return;

    let settings = await message.guild.settings.get(message.guild)
    let language = message.guild.language
    
    let prefix;
    prefix = message.client.user.id === '825130284382289920' ? development : production
    if (settings != null && settings.prefix != null) prefix = settings.prefix;

    if (settings != null && settings.blockedUsers != null) {
        if (settings.blockedUsers.includes(message.author.id)) return;
    }

    let lang = getGuildLang(message)

    let mentionPrefix = `<@!${message.client.user.id}>`

    if (message.content.startsWith(mentionPrefix) && message.content.length === mentionPrefix.length) message.channel.send(language.get("PREFIX_REMINDER", 'en-US', [prefix]))
    .then(msg => {setTimeout(() => msg.delete(), 30000)});
    
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

        if (message.guild.id === '825853736768372746' && message.channel.id === '825853736768372751') return message.responder.error.channel(message, lang)

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) return message.responder.error.authorPerms(message, lang, command)
        };    

        try {
            let props = {lang, message, args, settings, language}
            command.execute(props)
        } catch (error) {
            console.error(error);
            return message.responder.error.code(message, lang)
        }
    }

    if (message.content.toLowerCase().startsWith('fox')) {
        if (message.author.bot) return
        const args = message.content.slice(3).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        if (message.guild.id === '825853736768372746' && message.channel.id === '825853736768372751') return message.responder.error.channel(message, lang)

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) return message.responder.error.authorPerms(message, lang, command) 
        };    

        try {
            let props = {lang, message, args, settings, language}
            command.execute(props)
        } catch (error) {
            console.error(error);
            return message.responder.error.code(message, lang)
        }
    }
}