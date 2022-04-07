const Discord = require('discord.js');
const { foxColor } = require('../../config.json');
const moment = require('moment');
let db = require('quick.db');
module.exports = {
	name: 'testjoin',
	aliases: ['testwelcome', 'tj'],
	description: 'Testing welcome embed',
	usage: 'testjoin (user)',
	guildOnly: true,
	permissions: 'ADMINISTRATOR',
	execute(client, message, args) {
		let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

		let welchn = db.get(`Guilds_${member.guild.id}_Welchannel`);
		if (welchn === null) {
			return;
		}
		message.delete();
		const created = moment(member.user.createdTimestamp).format('llll');
		const joined = moment(member.joinedTimestamp).format('llll');
		const welChannel = message.guild.channels.cache.get(welchn);

		const welcomeEmbed = new Discord.MessageEmbed()
			.setColor(foxColor)
			.setTitle('**Welcome to The Corner Store!**')
			.setThumbnail(member.user.avatarURL())
			.setImage(`https://cdn.discordapp.com/attachments/798807457391968270/798810208310788136/tenor-2.gif`)
			.setDescription(
				`
       **•** Please read <#810039461306957876> to not be suprised by any punishments! If you'd like you could also select some <#800342663495680012> to let us get to know you.
       
       **•** First make an intro in <#795905444702322708> then start head to <#775306696658518027> or <#761518449172021268> to say hi.
       
       **•** Wanna invite a friend? Use the command \`.inv\` in the channel <#797433005425426433>.
       
       **•** If you have any questions feel free to reach out to staff or other server members. We hope you enjoy our shop!`
			)

			.setFooter(`Joined: ${joined}\nCreated: ${created}`, member.guild.iconURL({ dynamic: true }))
			.setTimestamp();
		if (member.guild.id == 761512748898844702) {
			return welChannel
				.send(`<@${member.id}> **Just joined the server. <@&774173127717552139> be sure to welcome them.**`, {
					embed: welcomeEmbed
				})
				.then(msg => {
					setTimeout(() => msg.delete(), 300000);
				});
		}

		member.guild.channels.cache.get(welchn).send(`**<@${member.id}>** just joined the server!`);
	}
};
