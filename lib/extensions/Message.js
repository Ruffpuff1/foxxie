const { Structures } = require('discord.js');
const Responder = require('../../lib/Responder')
const { Language, Users, Members, Channels, Roles, Emojis } = require('foxxie');
const { reactions: { yes, no } } = require('../util/constants');

Structures.extend('Message', Message => {
    class FoxxieMessage extends Message {
        constructor(client, data, channel){
            super(client, data, channel)
            this.responder = new Responder(this);
            this.language = client.languages.get('en-US');

            const argsMembers = new Members(this);
            const argsUsers = new Users(this);
            const argsChannels = new Channels(this);
            const argsRoles = new Roles(this);
            const argsEmojis = new Emojis(this);
            this.prefixes = null;
            this.stringPrefixes = null;

            this.members = argsMembers.members;
            this.users = argsUsers.users;
            this.channels = argsChannels.channels;
            this.roles = argsRoles.roles;
            this.emojis = argsEmojis.emojis;

            this.getPrefix();
            this.getStringPrefixes();
        }

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
        }

        getPrefix() {
            if (!this.guild) return this.prefixes = [this.client.mentionPrefix, this.client.development ? /^dev/i : /^fox/i, this.client.development ? new RegExp(`^${this.client.options.prefix.development}`) : new RegExp(`^${this.client.options.prefix.production}`)];
            return this.guild?.settings.get('prefixes').then(prefix => {

                let prefixes = [];
                if (!prefix?.length) return this.prefixes = [this.client.mentionPrefix, this.client.development ? /^dev/i : /^fox/i, this.client.development ? new RegExp(`^${this.client.options.prefix.development}`) : new RegExp(`^${this.client.options.prefix.production}`)];
                if (prefix.length) {
                    prefix.forEach(p => {

                        const newPrefix = new RegExp(`^${p}`)
                        prefixes.push(newPrefix);
                    })
                    prefixes.push(this.client.development ? /^dev/i : /^fox/i);
                    prefixes.push(this.client.mentionPrefix);
                }
                return this.prefixes = prefixes;
            })
        }

        getStringPrefixes() {
            if (!this.guild) return this.stringPrefixes = [`<@!${this.client.user.id}>`, this.client.development ? 'dev' : 'fox', this.client.development ? this.client.options.prefix.development : this.client.options.prefix.production];
            return this.guild?.settings.get('prefixes').then(prefix => {

                let prefixes = [];
                if (!prefix?.length) return this.stringPrefixes = [`<@!${this.client.user.id}>`, this.client.development ? 'dev' : 'fox', this.client.development ? this.client.options.prefix.development : this.client.options.prefix.production];
                if (prefix.length) {
                    prefix.forEach(p => {

                        prefixes.push(p);
                    })
                    prefixes.push(this.client.development ? 'dev' : 'fox');
                    prefixes.push(`<@!${this.client.user.id}>`);
                }
                return this.stringPrefixes = prefixes;
            })
        }

        get prefix() {

            const results = [];
            this.prefixes.forEach(p => {
                this.content.match(p) ? results.push(this.content.match(p)[0]) : null;
            })
           if (results.length) return results.shift();
           else return false;
        }

        get commandText() {

            if (this.prefix) {
                const text = this.content.replace(this.prefix, '');
                if (!text.length) return null;
                return text;
            }
            else return null;
        }

        get commandName() {

            if (this.commandText) {
                const commandName = this.commandText.split(/ +/).shift().toLowerCase();
                if (commandName) return commandName;
                else return null;
            }
            else return null;
        }

        get args() {

            const args = this.commandText.split(/ +/);
            args.shift()
            return args;
        }

        get command() {

            if (this.commandText) {
                const command = this.client.commands.get(this.commandName);
                if (command) return command;
                else return null;
            }
            else return null;
        }

        async awaitResponse(message, msg, collectedResponses) {

            const messages = await message.channel.awaitMessages(m => message.author.id === m.author.id, { time: 60000, max: 1, errors: ['time'] }).catch(() => msg.edit(this.language.get('MESSAGE_PROMPT_TIMEOUT')));
            if (!messages.first || messages?.first().content.toLowerCase() === 'cancel') return msg.edit(this.language.get('MESSAGE_PROMPT_CANCELLED'))
            return collectedResponses(message, msg, messages.first());
        }

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