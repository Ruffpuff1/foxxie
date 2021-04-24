module.exports = {
    name: 'shutdown',
    aliases: ['sd'],
    description: 'Shuts down the bot.',

   
    execute(message, args, bot) {
        if (!config.developerID.includes(message.author.id)) return;
            message.channel.send("Shutting down...").then(() => { 
                process.exit();
            })
        }
    }

