const { Structures } = require('discord.js');
const Responder = require('../../lib/Responder')
const { Users, Members, Channels, Roles, Emojis } = require('foxxie');
const { reactions: { yes, no } } = require('../util/constants');

Structures.extend('Message', Message => {
    class FoxxieMessage extends Message {
        constructor(client, data, channel){
            super(client, data, channel)
            this.responder = new Responder(this);
            this.language = client.languages.get('en-US');

            this.prefix = this.prefixResolver().then(prefix => prefix);
            this.getStringPrefixes();
            
            //this.prefixes = this.prefixes || [this.client.mentionPrefix, this.client.development ? /^dev\s/i : /^fox\s/i, this.client.development ? new RegExp(`^${this.client.options.prefix.development}`) : new RegExp(`^${this.client.options.prefix.production}`)];;
            this.stringPrefixes = this.stringPrefixes || [`<@!${this.client.user.id}>`, this.client.development ? 'dev ' : 'fox ', this.client.development ? this.client.options.prefix.development : this.client.options.prefix.production];
        }

        get emojis() {
            const args = new Emojis(this);
            return args.emojis;
        }

        get roles() {
            const args = new Roles(this);
            return args.roles;
        };

        get channels() {
            const args = new Channels(this);
            return args.channels;
        };

        get members() {
            const args = new Members(this);
            return args.members
        };

        get users() {
            const args = new Users(this);
            return args.users;
        };

        async confirm(message, key, msg, confirmed) {

            await message.edit(this.language.get(key));
            await message.react(yes);
            await message.react(no);

            let collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id);

            await collector.on('collect', async (reaction, user) => {

                if (reaction._emoji.id === no) {

                    message.delete();
                    return this.responder.success('MESSAGE_PROMPT_CANCELLED');
                }
                if (reaction._emoji.id === yes) return confirmed();
            })
        };

        getPrefix() {
            if (!this.guild) return [this.client.mentionPrefix, this.client.development ? /^dev\s/i : /^fox\s/i, this.client.development ? new RegExp(`^${this.client.options.prefix.development}`) : new RegExp(`^${this.client.options.prefix.production}`)];
            return this.guild?.settings.get('prefixes').then(prefix => {

                let prefixes = [];
                if (!prefix?.length) return [this.client.mentionPrefix, this.client.development ? /^dev\s/i : /^fox\s/i, this.client.development ? new RegExp(`^${this.client.options.prefix.development}`) : new RegExp(`^${this.client.options.prefix.production}`)];
                if (prefix.length) {
                    prefixes.push(this.client.mentionPrefix);
                    prefixes.push(this.client.development ? /^dev\s/i : /^fox\s/i);
                    prefix.forEach(p => {

                        const newPrefix = new RegExp(`^${p.replace('?', '\\?')}`)
                        prefixes.push(newPrefix);
                    })
                }
                return prefixes;
            })
        };

        getStringPrefixes() {
            if (!this.guild) return;
            return this.guild?.settings.get('prefixes').then(prefix => {

                let prefixes = [];
                if (!prefix?.length) return;
                if (prefix.length) {
                    prefixes.push(`<@!${this.client.user.id}>`);
                    prefixes.push(this.client.development ? 'dev ' : 'fox ');
                    prefix.forEach(p => {

                        prefixes.push(p);
                    })
                }
                return this.stringPrefixes = prefixes;
            })
        };

        prefixResolver() {

            const results = [];

            const p = new Promise((resolve, reject) => resolve(this.getPrefix()))

            return p.then(prefix => {
                prefix?.forEach(pre => this.content.match(pre) ? results.push(this.content.match(pre)[0]) : null);
                if (results.length) return results.shift();
                else return false;

            }).catch(() => false)
        };

        get commandText() {
            if (this.prefix) {
                let text = this.content.replace(this.prefix, '');
                if (text.startsWith(' ')) text = text.substring(1, text.length);
                if (!text.length) return null;
                return text;
            }
            else return null;
        };

        get commandName() {
            if (this.commandText) {
                const commandName = this.commandText.split(/ +/).shift().toLowerCase();
                if (commandName) return commandName;
                else return null;
            }
            else return null;
        };

        get args() {

            let args = this.commandText.split(/ +/);
            args.shift()
            return args;
        };

        get command() {

            if (this.commandText) {
                const command = this.client.commands.get(this.commandName);
                if (command) return command;
                else return null;
            }
            else return null;
        };

        async awaitResponse(message, msg, collectedResponses) {

            const messages = await message.channel.awaitMessages(m => message.author.id === m.author.id, { time: 60000, max: 1, errors: ['time'] }).catch(() => msg.edit(this.language.get('MESSAGE_PROMPT_TIMEOUT')));
            if (!messages.first || messages?.first().content.toLowerCase() === 'cancel') return msg.edit(this.language.get('MESSAGE_PROMPT_CANCELLED'))
            return collectedResponses(message, msg, messages.first());
        };

        async exempt () {
            if (!this.guild) return false;
            const exempt = await this.guild.settings.get('mod.exempt');
            if (exempt?.users?.includes(this.author.id)) return true;
            if (exempt?.channels?.includes(this.channel.id)) return true;
            const ignoredRoles = exempt?.roles
            for (const role of this.member.roles.cache.keys()) {
                if (ignoredRoles?.includes(role)) return true;
            }
            return false;
        }
    }
    return FoxxieMessage;
})