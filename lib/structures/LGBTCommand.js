/**
 * Authored by Ruff <Ruffpuff#0017> (http://ruff.cafe)
 */
const { Command } = require('@foxxie/tails');
const req = require('@aero/centra');

module.exports = class LGBTCommand extends Command {

    constructor(name, aliases, ...args) {
        super(...args, {
            name,
            aliases,
            description: language => language.get(`COMMAND_${name.toUpperCase()}_DESCRIPTION`),
            usage: '(User)',
            permissionLevel: 8,
            category: 'fun'
        })

        this.name = name;
    }

    async run(msg, [id]) {
        const user = msg.users.shift() || await msg.client.users.fetch(id).catch(() => null) || msg.author;
        const avatar = user.displayAvatarURL({ size: 1024, format: 'png' });
        const loading = await msg.responder.loading();

        const img = await req(msg.client.options.lgbtURL)
            .path('circle')
            .query({ image: avatar, type: this.name })
            .raw();

        await msg.channel.send({ files: [{ 
            attachment: img,
            name: 'avatar.png'
        }] });

        return loading.delete();
    }
}