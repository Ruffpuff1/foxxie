const { Command, owoify } = require('foxxie');

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

        const text = args.slice(0).join(' ') || msg.language.get('COMMAND_OWOIFY_NOARGS');

        const content = owoify(text).slice(0, 2000)
			.replace(/`/g, '\\`')
            .replace(/:pweading_face:/gi, '🥺');

        msg.delete()
		return msg.channel.send(content);
    }
}