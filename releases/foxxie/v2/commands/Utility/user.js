const Discord = require('discord.js');
const moment = require('moment');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'user',
	aliases: ['self', 'userinfo', 'member', 'whois'],
	description: 'user',
	usage: 'user (user)',
	guildOnly: true,
	execute(client, message, args) {
		let member = message.mentions.users.first() || client.users.cache.get(args[0]) || message.member;

		let guild = client.guilds.cache.get(message.guild.id),
			USER_ID = member.id;

		if (guild.member(USER_ID)) {
			member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
			const created = moment(member.user.createdTimestamp).format('llll');
			const joined = moment(member.joinedTimestamp).format('llll');

			var daysSinceCreation = moment().diff(created, 'days');
			var daysSinceJoin = moment().diff(joined, 'days');

			let rolemap = member.roles.cache
				.sort((a, b) => b.position - a.position)
				.map(r => r)
				.join(', ')
				.replace(', @everyone', ' ');
			if (rolemap.length > 1024) rolemap = 'To many roles to display';
			if (!rolemap) rolemap = 'No roles';

			const userServerEmbed = new Discord.MessageEmbed()
				.setColor(member.roles.highest.color)
				.setTitle(`${member.user.tag}`)
				.setDescription(``)
				.setThumbnail(member.user.avatarURL({ dynamic: true }))
				.setFooter(
					`Joined: ${joined} (${daysSinceJoin} days ago.)\nCreated: ${created} (${daysSinceCreation} days ago.)`,
					member.guild.iconURL({ dynamic: true })
				)
				.addFields(
					{
						name: ':pencil2: **Display Name**',
						value: member.displayName,
						inline: true
					},
					{
						name: ':id: **User ID**',
						value: `${member.user.id}`,
						inline: true
					},
					{
						name: ':arrow_up: **Highest Role**',
						value: member.roles.highest,
						inline: true
					},
					{
						name: `:scroll: **Roles (${member.roles.cache.size - 1})**`,
						value: `${rolemap}`,
						inline: false
					}
				);

			// for badges later on

			/*
    let badges = [
        ''
    ]

    if (isDev) badges.push('<:owner:820998011940241496>')
    if (member.roles.cache.find(r => r.id === "818506873950175264")) badges.push('<:staff:820997808877862912>')
    if (member.roles.cache.find(r => r.id === "809105934672330802")) badges.push('<:nitro:821024073345007647>')
    if (member.roles.cache.find(r => r.id === "811834242383609877")) badges.push('<:dev:820675971711631374>')
    if (member.roles.cache.find(r => r.id === "816015895335665664")) badges.push('<:partner:820997906433441809>') //Do this for each badge
    if (member.roles.cache.find(r => r.id === "774894802889474058")) badges.push('<:early:820997942458449961>')

    if (badges.length) userServerEmbed.setTitle(`${member.user.tag} ${badges.join(' ')}`) */

			// if (isBot) { userServerEmbed.setDescription(`Hey look it\'s me, your friendly neighborhood fox butler. Hope I can be of some use to ya ;)`) }
			//if (isDev) { userServerEmbed.setDescription(`This is my developer Ruffy he also owns [The Corner Store](https://discord.gg/kAbuCpfnCk) which is a server you should join lol.`) }
			// if (isAmb) { userServerEmbed.setDescription(`This is Amber, Ruff\'s bestfriend / mom?? Idek but she owns <@818444584442658856> too and is mod on like a million servers.`) }

			return message.reply(userServerEmbed);
		} // end of in server embed

		const created = moment(member.createdTimestamp).format('llll');
		var daysSinceCreation = moment().diff(created, 'days');

		const userEmbed = new Discord.MessageEmbed()
			.setTitle(member.tag)
			.setColor(foxColor)
			.setThumbnail(member.avatarURL({ dynamic: true }))
			.addFields(
				{
					name: ':pencil2: **Display Name**',
					value: member.username,
					inline: true
				},
				{
					name: ':id: **User ID**',
					value: member.id,
					inline: true
				}
			)
			.setFooter(`Created: ${created} (${daysSinceCreation} days ago.)`, message.guild.iconURL({ dynamic: true }));

		message.channel.send(userEmbed);
	}
};
