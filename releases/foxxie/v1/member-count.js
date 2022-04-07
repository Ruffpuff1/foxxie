module.exports = client => {
	const channelId = '812226377717645332';

	const updateMembers = guild => {
		const channel = guild.channels.cache.get(channelId);
		channel.setName(`🥤┇𝐌𝐞𝐦𝐛𝐞𝐫𝐬・ ${guild.memberCount.toLocaleString()}`);
	};

	client.on('guildMemberAdd', member => updateMembers(member.guild));
	client.on('guildMemberRemove', member => updateMembers(member.guild));

	const guild = client.guilds.cache.get('761512748898844702');
	updateMembers(guild);
};
