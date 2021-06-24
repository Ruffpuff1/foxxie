const { Command } = require('foxxie');
const req = require('@aero/centra');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'pride',
            aliases: ['gay', 'lgbt'],
            description: language => language.get('COMMAND_PRIDE_DESCRIPTION'),
            usage: '(User)',
            permissionLevel: 8,
            category: 'fun'
        })

        this.type = 'pride';
    }

    async run(msg, [id]) {
        let user = msg.users.shift();
        if (!user) user = await this.client.users.fetch(id).catch(() => null);
        if (!user) user = msg.author;

        const avatar = user.displayAvatarURL({ size: 1024, format: 'png' });
        const loading = await msg.responder.loading();

        const img = await req(this.client.options.lgbtURL)
            .path('circle')
            .query({ image: avatar, type: this.type })
            .raw();

        await msg.channel.send({ files: [{
            attachment: img,
            name: 'avatar.png'
          }] })

        return loading.delete();
    }
}