const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'welcome',
            aliases: ['ws', 'welcome-settings'],
            description: language => language.get('COMMAND_WELCOME_DESCRIPTION'),
            usage: '[channel | message] (Channel | Message | none)',
            permissions: 'ADMINISTRATOR',
            category: 'settings'
        })
    }

    run(msg, args) {

        if (/(channel|location|c)/i.test(args[0])) return this.channel(msg, args);
        if (/(message|text|m)/i.test(args[0])) return this.message(msg, args);
        return msg.responder.error('COMMAND_WELCOME_INVALID');
    } 

    async channel(msg, [_, arg]) {
        const loading = await msg.responder.loading();

        if (/(none|reset)/i.test(arg)) {
            msg.guild.settings.unset('welcome.channel');
            msg.responder.success('COMMAND_WELCOME_CHANNEL_REMOVED');
            return loading.delete();
        }
        const channel = msg.channels.shift();
        if (!channel && !await msg.guild.settings.get('welcome.channel')) {
            msg.responder.error('COMMAND_WELCOME_CHANNEL_NOCHANNEL');
            return loading.delete();
        }
        else if (!channel) {
            const chn = await msg.guild.settings.get('welcome.channel');
            msg.responder.info('COMMAND_WELCOME_CHANNEL_NOW', msg.guild.channels.cache.get(chn)?.toString());
            return loading.delete();
        }
        else {
            await msg.guild.settings.set('welcome.channel', channel.id);
            msg.responder.success('COMMAND_WELCOME_CHANNEL_SET', channel.toString());
            return loading.delete();
        }
    }

    async message(msg, [_, ...message]) {
        const loading = await msg.responder.loading();

        if (/(none|reset)/i.test(message[0])) {
            msg.guild.settings.unset('welcome.message');
            msg.responder.success('COMMAND_WELCOME_MESSAGE_REMOVED');
            return loading.delete();
        }
        message = message.join(' ');
        if (!message && !await msg.guild.settings.get('welcome.message')) {
            msg.responder.error('COMMAND_WELCOME_MESSAGE_NOMESSAGE');
            return loading.delete();
        }
        else if (!message) {
            const mess = await msg.guild.settings.get('welcome.message');
            msg.responder.info('COMMAND_WELCOME_MESSAGE_NOW', mess);
            return loading.delete()
        } 
        else {
            await msg.guild.settings.set('welcome.message', message);
            msg.responder.success('COMMAND_WELCOME_MESSAGE_SET', message);
            return loading.delete();
        }
    }
}