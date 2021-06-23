const { Command } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'starboard', 
            aliases: ['sb', 'star', 'starboard-settings'], 
            description: language => language.get('COMMAND_STARBOARD_DESCRIPTION'),
            usage: '[channel | minimum | self | notifs] (Setting)',
            permissions: 'ADMINISTRATOR',
            category: 'settings'
        })
    }

    async run(msg, args) {
        const use = args.shift();
        if (/(channel|location|c)/i.test(use)) return this.channel(msg, args);
        if (/(minimum|number|min|m)/i.test(use)) return this.minimum(msg, args);
        if (/(notifs|n)/i.test(use)) return this.notifications(msg, args);
        if (/(selfstar|self|s)/i.test(use)) return this.self(msg, args);
        return msg.responder.error('COMMAND_STARBOARD_INVALID');
    }

    async channel(msg, [use]) {
        const loading = await msg.responder.loading();
        const channel = msg.channels.shift();
        const starChannel = await msg.guild.settings.get('starboard.channel');

        if (/(none|reset)/i.test(use)) {
            msg.guild.settings.unset('starboard.channel');
            msg.responder.success('COMMAND_STARBOARD_REMOVED');
            return loading.delete();
        }
        if (!channel) {
            if (!starChannel) {
                msg.responder.error('COMMAND_STARBOARD_NOTSET');
                return loading.delete();
            } else {
                msg.responder.info('COMMAND_STARBOARD_CHANNEL', msg.guild.channels.cache.get(starChannel)?.toString());
                return loading.delete();
            }
        } else {
            await msg.guild.settings.set('starboard.channel', channel.id);
            msg.responder.success('COMMAND_STARBOARD_CHANNELSET', channel.toString());
            return loading.delete();
        }
    }

    async minimum(msg, [minimum]) {
        const loading = await msg.responder.loading();
        const starboardMinimum = await msg.guild.settings.get('starboard.minimum');

        if (/(none|reset)/i.test(minimum)) {
            msg.guild.settings.unset('starboard.minimum');
            msg.responder.success('COMMAND_STARBOARD_MINIMUMSET', 3);
            return loading.delete();
        } else {
            if (!minimum || !/^\d+$/.test(minimum)) {
                msg.responder.info('COMMAND_STARBOARD_MINIMUM', starboardMinimum || 3);
                return loading.delete();
            } else {
                await msg.guild.settings.set('starboard.minimum', parseInt(minimum));
                msg.responder.success('COMMAND_STARBOARD_MINIMUMSET', parseInt(minimum));
                return loading.delete();
            }
        }
    }

    async self(msg, [arg]) {
        const starboardSelf = await msg.guild.settings.get('starboard.self');
        const loading = await msg.responder.loading();

        if (/(none|reset|on|true|allow|yes)/i.test(arg)) {
            await msg.guild.settings.unset('starboard.self');
            msg.responder.success('COMMAND_STARBOARD_SELF', true);
            return loading.delete();
        } else if (/(false|off|deny|no)/i.test(arg)) {
            await msg.guild.settings.set('starboard.self', false);
            msg.responder.success('COMMAND_STARBOARD_SELF', false);
            return loading.delete();
        } else {
            msg.responder.info('COMMAND_STARBOARD_SELFNOW', starboardSelf);
            return loading.delete();
        };
    }

    async notifications(msg, [arg]) {
        const loading = await msg.responder.loading();
        const starboardNotifications = await msg.guild.settings.get('starboard.notifications');

        if (/(none|reset|on|true|allow|yes)/i.test(arg)) {
            await msg.guild.settings.unset('starboard.notifications');
            msg.responder.success('COMMAND_STARBOARD_NOTIFICATIONS', true);
            return loading.delete();
        } else if (/false|off|deny|no/i.test(arg)) {
            await msg.guild.settings.set('starboard.notifications', false);
            msg.responder.success('COMMAND_STARBOARD_NOTIFICATIONS', false);
            return loading.delete();
        } else {
            msg.responder.info('COMMAND_STARBOARD_NOTIFICATIONNOW', starboardNotifications);
            return loading.delete();
        }
    }
}