module.exports = {
    name: 'shutdown',
    aliases: ['sd'],
    description: 'Shuts down the bot.',

   
    execute(message, args) {
        let ownerId = 814539604879081532
        if (message.author.id === ownerId) {
            message.channel.send("Shutting down...").then(() => { 
                process.exit();
            })
        }
    }
}
  
