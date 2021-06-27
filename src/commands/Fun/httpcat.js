const req = require('@aero/centra');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'httpcat',
            aliases: ['hcat', 'http'],
            description: language => language.get('COMMAND_HTTPCAT_DESCRIPTION'),
            requiredPermissions: ['EMBED_LINKS'],
            usage: '[Number]',
            category: 'fun'
        })

        this.baseURL = 'https://http.cat';
    }

    async run(msg, [code]) {
        const loading = await msg.responder.loading();
		const res = await req(this.baseURL)
			.path(code.toString())
			.send();

		if (res.statusCode !== 200) {
            loading.delete();
            throw 'COMMAND_HTTPCAT_INVALID';
        };

        const embed = new MessageEmbed()
            .setColor(msg.guild.me.displayColor)
            .attachFiles(new MessageAttachment(res.body, 'cat.jpg'))
            .setImage('attachment://cat.jpg')

		msg.channel.send(embed);
        return loading.delete()
	}
}