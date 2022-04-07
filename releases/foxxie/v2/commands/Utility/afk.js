const Discord = require('discord.js');
const db = require('quick.db');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'afk',
	aliases: ['away', 'idle'],
	description:
		'Sets an AFK for when people ping ya. You can provide a reason, but if no reason is provided it will show as "none". When pinged in chat your AFK status will show. And the next time you talk in chat your AFK will be removed.',
	usage: 'afk (reason)',
	guildOnly: true,
	execute(client, message, args) {
		let reason = args.slice(0).join(' ') || 'AFK';

		db.set(`Users_${message.author.id}_Afknickname_${message.guild.id}`, message.member.displayName);

		message.member.setNickname(`[AFK] ${message.member.displayName}`).catch(console.log(`AFK set for ${message.member} with the reason: ${reason}`));

		db.set(`Users_${message.author.id}_Afk_${message.guild.id}`, true);
		db.set(`Users_${message.author.id}_Afkmessage_${message.guild.id}`, args.slice(0).join(' ') || 'AFK');

		const AFKEmbed = new Discord.MessageEmbed()
			.setColor(foxColor)
			.setAuthor(`${message.member.user.tag} has set an AFK`, `${message.member.user.avatarURL()}`)
			.setDescription(`**Reason:** ${reason}`);

		message.react('✅');
		message.channel.send(AFKEmbed).then(msg => {
			setTimeout(() => msg.delete(), 10000);
		});
	}
};
