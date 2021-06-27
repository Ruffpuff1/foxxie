const { Command } = require('@foxxie/tails');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'goodbye',
            aliases: ['gs', 'goodbye-settings'],
            description: language => language.get('COMMAND_GOODBYE_DESCRIPTION'),
            usage: '[channel | message] (Channel | Message | none)',
            category: 'settings'
        })

        this.permissions = 'ADMINISTRATOR';
    }

    run(msg, args) {

        if (/(channel|location|c)/i.test(args[0])) return this.channel(msg, args);
        if (/(message|text|m)/i.test(args[0])) return this.message(msg, args);
        return msg.responder.error('COMMAND_GOODBYE_INVALID');
    } 

    async channel(msg, [_, arg]) {
        const loading = await msg.responder.loading();

        if (/(none|reset)/i.test(arg)) {
            msg.guild.settings.unset('goodbye.channel');
            msg.responder.success('COMMAND_GOODBYE_CHANNEL_REMOVED');
            return loading.delete();
        }
        const channel = msg.channels.shift();
        if (!channel && !await msg.guild.settings.get('goodbye.channel')) {
            msg.responder.error('COMMAND_GOODBYE_CHANNEL_NOCHANNEL');
            return loading.delete();
        }
        else if (!channel) {
            const chn = await msg.guild.settings.get('goodbye.channel');
            msg.responder.info('COMMAND_GOODBYE_CHANNEL_NOW', msg.guild.channels.cache.get(chn)?.toString());
            return loading.delete();
        }
        else {
            await msg.guild.settings.set('goodbye.channel', channel.id);
            msg.responder.success('COMMAND_GOODBYE_CHANNEL_SET', channel.toString());
            return loading.delete();
        }
    }

    async message(msg, [_, ...message]) {
        const loading = await msg.responder.loading();

        if (/(none|reset)/i.test(message[0])) {
            msg.guild.settings.unset('goodbye.message');
            msg.responder.success('COMMAND_GOODBYE_MESSAGE_REMOVED');
            return loading.delete();
        }
        message = message.join(' ');
        if (!message && !await msg.guild.settings.get('goodbye.message')) {
            msg.responder.error('COMMAND_GOODBYE_MESSAGE_NOMESSAGE');
            return loading.delete();
        }
        else if (!message) {
            const mess = await msg.guild.settings.get('goodbye.message');
            msg.responder.info('COMMAND_GOODBYE_MESSAGE_NOW', mess);
            return loading.delete()
        } 
        else {
            await msg.guild.settings.set('goodbye.message', message);
            msg.responder.success('COMMAND_GOODBYE_MESSAGE_SET', message);
            return loading.delete();
        }
    }
}