module.exports = {
    name: 'shutdown',
    aliases: ['sd'],
    description: 'Used to shut down the bot, this command isn\`t used anymore or isn\`t working.',

   
    execute(message, args, bot) {
        if (!config.ids.developerID.includes(message.author.id)) return;
            message.channel.send("Shutting down...").then(() => { 
                process.exit();
            })
        }
    }

