const { MessageEmbed } = require('discord.js');
const { botOwner } = require('../../config.json');

module.exports = {
	name: 'eval',
	description: 'Evaluates js code',
	accessableby: 'client Owner',
	category: 'owner',
	aliases: ['ev'],
	usage: 'eval <input>',
	execute: async (client, message, args) => {
		if (message.author.id !== botOwner) return;
		const msg = message;
		const Discord = require('discord.js');
		const db = require('quick.db');
		let prefix = '.';

		let codein = args.slice(0).join(' ');
		if (!codein.toLowerCase().includes('token') && !codein.toLowerCase().includes('config')) {
			try {
				let code = eval(codein);
				console.log(typeof code);
				let type = typeof code;

				if (codein.length < 1 && !codein) return message.channel.send(`**Output**: \n\`\`\`javascript\nundefined\n\`\`\``);
				if (typeof code !== 'string') code = require('util').inspect(code, { depth: 0 });

				message.channel
					.send(
						`
**Output**:\n\`\`\`javascript
${code.length > 1024 ? 'Character Over!' : code}
\`\`\`\n**Type**:
\`\`\`javascript
${type}
\`\`\``
					)
					.then(resultMessage => {
						const time = resultMessage.createdTimestamp - message.createdTimestamp;
						resultMessage.edit(`
**Output**:\n\`\`\`javascript
${code.length > 1024 ? 'Character Over!' : code}
\`\`\`\n**Type**:
\`\`\`javascript
${type}
\`\`\`
:stopwatch: ${time}ms
`);
					});
			} catch (e) {
				let eType = typeof e;
				message.channel
					.send(
						`
**Output**:\n\`\`\`javascript
${e.length > 1024 ? 'Character Over!' : e}
\`\`\`\n**Type**:
\`\`\`javascript
${eType}
\`\`\``
					)
					.then(resultMessage => {
						const time = resultMessage.createdTimestamp - message.createdTimestamp;
						resultMessage.edit(`
    **Output**:\n\`\`\`javascript
${e.length > 1024 ? 'Character Over!' : e}
\`\`\`\n**Type**:
\`\`\`javascript
${eType}
\`\`\`
:stopwatch: ${time}ms
`);
					});
			}
		} else {
			message.channel.send(`**Output**: \n\`\`\`javascript\nundefined token\n\`\`\``); // Prevent take token :)
		}
	}
};
