const Discord = require('discord.js');

module.exports = {
	name: 'prune',
	aliases: ['purge', 'clear', 'clean', 'delete'],
	description: 'Mass delete messages up to 100 messages at once.',
	usage: '[messages]',
	guildOnly: true,
	execute(message, args) {

        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('that doesnt\'t seem to be a valid number.');
        } else if (amount <= 1 || amount > 100) {
        	return message.reply('**Sorry,** due to limitations of Discord\'s API you can only purge up to 100 messages at once. Please try again with a lower amount');
             }

        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send('there was an error trying to purge messages')
        });

        const purgeEmbed = new Discord.MessageEmbed()
    .setTitle(`Purged ${amount} messages`)
    .setDescription(`${message.author} purged ${amount} messages from the chat.`)    
	.setColor('#EC8363');

	message.channel.send(purgeEmbed)
    .then(msg => {
        setTimeout(() => msg.delete(), 3000)
      });

        // ...

    }};