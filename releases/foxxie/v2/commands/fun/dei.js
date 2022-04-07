module.exports = {
	name: 'dei',
	aliases: ['connor'],
	guildOnly: true,
	execute(client, message, args) {
		message.delete();
		message.channel.send(`<:Sad:818539455900155914>`);
	}
};
