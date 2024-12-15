const config = require('../config.json')
const fs = require('fs')
const Discord = require('discord.js')
module.exports = {
    name: 'message',
    execute(msg, bot) {

        let mentionPrefix = `<@!${msg.client.user.id}>`

        if (msg.content.startsWith(mentionPrefix) && msg.content.length === mentionPrefix.length) {
            msg.channel.send(`Did you forget already? Seriously? Fine. The prefix is \`${config.prefix}\`. Better not forget it again.`)
            .then(mess => {setTimeout(() => mess.delete(), 30000)});
        };

        bot.commands = new Discord.Collection();
        const commandFolders = fs.readdirSync('./commands');

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                bot.commands.set(command.name, command);
            }
        }

        if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

        const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        
        if (!command) return;
        if (command.permissions) {
            const authorPerms = msg.channel.permissionsFor(msg.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return msg.channel.send(`Ay, i see you've been trying to use commands that you don't have the correct **permissions** for. please stop trying to use these unless you finally ave the perms needed. Thanks.`)}
        };

        try {
        command.execute(msg, args, bot);
        } catch(err) {
            console.log(err)
        }
    }
}