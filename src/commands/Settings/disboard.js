const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'disboard',
            aliases: ['ds', 'disboard-settings'],
            description: language => language.get('COMMAND_DISBOARD_DESCRIPTION'),
            usage: '[channel | message] (Channel | Message | none)',
            permissions: 'ADMINISTRATOR',
            category: 'settings'
        })
    }

    run(msg, args) {

        if (/(channel|location|c)/i.test(args[0])) return this.channel(msg, args);
        if (/(message|text|m)/i.test(args[0])) return this.message(msg, args);
        return msg.responder.error('COMMAND_DISBOARD_INVALID');
    } 

    async channel(msg, [_, arg]) {
        const loading = await msg.responder.loading();

        if (/(none|reset)/i.test(arg)) {
            msg.guild.settings.unset('disboard.channel');
            msg.responder.success('COMMAND_DISBOARD_CHANNEL_REMOVED');
            return loading.delete();
        }
        const channel = msg.channels.shift();
        if (!channel && !await msg.guild.settings.get('disboard.channel')) {
            msg.responder.error('COMMAND_DISBOARD_CHANNEL_NOCHANNEL');
            return loading.delete();
        }
        else if (!channel) {
            const chn = await msg.guild.settings.get('disboard.channel');
            msg.responder.info('COMMAND_DISBOARD_CHANNEL_NOW', msg.guild.channels.cache.get(chn)?.toString());
            return loading.delete();
        }
        else {
            await msg.guild.settings.set('disboard.channel', channel.id);
            msg.responder.success('COMMAND_DISBOARD_CHANNEL_SET', channel.toString());
            return loading.delete();
        }
    }

    async message(msg, [_, ...message]) {
        const loading = await msg.responder.loading();

        if (/(none|reset)/i.test(message[0])) {
            msg.guild.settings.unset('disboard.message');
            msg.responder.success('COMMAND_DISBOARD_MESSAGE_REMOVED');
            return loading.delete();
        }
        message = message.join(' ');
        if (!message && !await msg.guild.settings.get('disboard.message')) {
            msg.responder.error('COMMAND_DISBOARD_MESSAGE_NOMESSAGE');
            return loading.delete();
        }
        else if (!message) {
            const mess = await msg.guild.settings.get('disboard.message');
            msg.responder.info('COMMAND_DISBOARD_MESSAGE_NOW', mess);
            return loading.delete()
        } 
        else {
            const ping = msg.roles.shift();

            if (!ping) await msg.guild.settings.unset('disboard.ping');
            else await msg.guild.settings.set('disboard.ping', ping);

            await msg.guild.settings.set('disboard.message', message);
            msg.responder.success('COMMAND_DISBOARD_MESSAGE_SET', message);
            return loading.delete();
        }
    }
}