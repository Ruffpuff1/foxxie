const config = require('../../lib/config')
const errormsg = require('../../lib/util/error')
const getGuildLang = require('../../lib/util/lang')
module.exports = {
    name: 'messageUpdate',
    execute: async(oldMessage, newMessage) => {

        if (newMessage.channel.type === 'dm') return
        if (oldMessage.content.includes('https://')) return
        let lang = getGuildLang.getGuildLang(newMessage)

        if (newMessage.author.bot) return

        // command edit

        const client = newMessage.client
        const message = newMessage

        // .prefix

        if (message.content.startsWith(config.prefix)) {
            const args = message.content.slice(config.prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
                if (!command) return;

                if (command.permissions) {
                    const authorPerms = message.channel.permissionsFor(message.author);
                    if (!authorPerms || !authorPerms.has(command.permissions)) {
                        return errormsg.permError(lang, message, command)
                    }
                };    

            try {command.execute(lang, message, args, client) 
                console.log(command.name)
            } catch (error) {
                console.error(error);
                return errormsg.codeError(lang, message)
            }
        }

        // fox prefix

        if (message.content.startsWith('fox') || message.content.startsWith('Fox')) {
            const args = message.content.slice(3).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
                if (!command) return;

                if (command.permissions) {
                    const authorPerms = message.channel.permissionsFor(message.author);
                    if (!authorPerms || !authorPerms.has(command.permissions)) {
                        return errormsg.permError(lang, message, command)
                    }
                };    

            try {command.execute(lang, message, args, client) 
                console.log(command.name)
            } catch (error) {
                console.error(error);
                return errormsg.codeError(lang, message)
            }
        }

    }
}