const { Command } = require('foxxie');
const { default: owoify } = require('owoify-js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'owoify',
            aliases: ['owo', 'uwu', 'uvu'],
            description: language => language.get('COMMAND_OWOIFY_DESCRIPTION'),
            usage: '[Text]',
            category: 'fun'
        })
    }

    async run(msg, args) {

        let remove = false;
        const text = args.slice(0).join(' ') || msg.language.get('COMMAND_OWOIFY_NOARGS');
        if (/-delete|-d/i.test(msg.content)) remove = true;

        const content = owoify(text.replace(/-delete|-d/i, '').slice(0, 2000))
			.replace(/`/g, '\\`')
            .replace(/:pweading_face:/gi, '🥺');

        if (remove) msg.delete()
		return msg.channel.send(content);
    }
}