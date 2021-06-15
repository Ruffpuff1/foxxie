/*
 * Co-Authored by Ruff (http://ruff.cafe)
 * Co-Authored-By: Ravy <ravy@aero.bot> (https://ravy.pink)
 */
const { Command } = require('foxxie');
const { Permissions: { FLAGS }, Role } = require('discord.js');
const GuildReactionCollector = require('../../../lib/extensions/GuildReactionCollector');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'rero',
            aliases: ['reaction-role', 'reros', 'rr'],
            description: language => language.get('COMMAND_RERO_DESCRIPTION'),
            runIn: ['text', 'news'],
            usage: '[add | remove] (Message) [Role]',
            permissions: 'CLIENT_OWNER',
            requiredPermissions: FLAGS.MANAGE_ROLES,
            category: 'admin'
        })

        this.notifier = null;
    }

    async run(msg, [action, message]) {

       if (!action) return msg.responder.error('COMMAND_RERO_NOACTION');

       const role = msg.roles.shift();
       if (!role) return msg.responder.error('COMMAND_RERO_NOROLE');

       if (message instanceof Role) message = null;

        const rero = {
            message, 
            role: role.id
        }
        console.log('after args')
       const filter = item => item.message === rero.message
            && item.role === rero.role && rero.emoji === item.emoji;

        const reros = await msg.guild.settings.get('reros');

        if (action.toLowerCase() === 'add') {
            console.log('in add')
            const { emoji, message: partialMessage } = await this.queryEmoji(msg);
            const mess = await this.client.channels.cache.get(partialMessage.channel.id).messages.fetch(partialMessage.id);
            rero.message = mess.id;
            rero.emoji = emoji.id ? emoji.id : emoji.name;

            const equalReros = reros.filter(item => filter(item));
            console.log(equalReros)
            if (equalReros.length > 0) return msg.responder.error('COMMAND_RERO_EXIST');

            return mess.react(`${emoji.name}${emoji.id ? `:${emoji.id}` : ''}`)
                .then(() => {
                    mess.reactions.resolve(emoji.id ? emoji.id : emoji.name).users.remove(msg.author);
                    rero.emoji = emoji.id ? emoji.id : emoji.name;
                    msg.guild.settings.push('reros', rero);
                    this.notify(msg, 'added');
                })
                .catch(() => {
                    throw 'COMMAND_RERO_INVALIDEMOJI';
                });
        } else if (action.toLowerCase() === 'remove') {
            if (!message) throw 'COMMAND_RERO_NOMESSAGEID';
            const removeReros = reros.filter(item => !filter(item));
            console.log(removeReros.length);

            if (removeReros.length) {
                removeReros?.forEach(rr => msg.guild.settings.pull('reros', rr));
                msg.responder.success('COMMAND_RERO_REMOVED');
            }
        }

        return true;
    }

    async queryEmoji(msg) {
        console.log('in query');
        await this.notify(msg, 'query');
        return new Promise((resolve, reject) => {
            const filter = (_, user) => user.id === msg.author.id;
            
            const collector = new GuildReactionCollector(msg, filter, { time: 30000, max: 1 });
            collector.on('end', collected => {
                if (collected.size > 0) {
                    resolve(collected.first());
                } else {
                    reject('COMMAND_RERO_NOEMOJI')
                }
            })
        })
    }

    async notify(msg, type) {
        if (type === 'query') this.notifier = await msg.responder.info('COMMAND_RERO_QUERYEMOJI');
        if (type === 'added') this.notifier.edit('COMMAND_RERO_ADDED')
    }
}