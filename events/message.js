const config = require('../config.json')
module.exports = {
    name: 'message',
    execute(msg, bot) {
        if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

        const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = bot.commands.get(commandName) || bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

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