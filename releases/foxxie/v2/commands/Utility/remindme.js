const fs = require('fs');
const ms = require('ms');
module.exports = {
	name: 'remindme',
	aliases: ['rm'],
	description: 'Send a reminder message straight to your dms.',
	usage: 'rm [1s/1m/1h/1d] [reason for reminder]',
	guildOnly: true,
	execute(client, message, args) {
		client.msgs = require('../../msgs.json');
		let remindTime = args[0];
		let remindMsg = args.slice(1).join(' ');
		let timeFromNow = ms(ms(remindTime), { long: true });

		if (!remindTime) {
			message.react('❌');
			message.channel.send('❌ You need to specify a proper time for me to remind you, format it like [1s/1m/1h/1d] thx.').then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
			return;
		}

		if (!remindMsg) {
			message.react('❌');
			message.channel.send('❌ You need to provide a reason for the reminder, try again.').then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
			return;
		}

		console.log(timeFromNow);

		client.msgs[message.id] = {
			guild: message.guild.id,
			authID: message.author.id,
			time: Date.now() + ms(remindTime),
			message: remindMsg,
			timeago: timeFromNow
		};
		fs.writeFile('./msgs.json', JSON.stringify(client.msgs, null, 4), err => {
			if (err) throw err;
			message.react('✅');
			message.channel.send(`**Alright,** I'll send that reminder your way in ${timeFromNow}`).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		});
	}
};
