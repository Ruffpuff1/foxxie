const { Structures } = require('discord.js');
const Responder = require('../../lib/Responder')
const { Language, Users, Members, Channels } = require('foxxie');
const { reactions: { yes, no } } = require('../util/constants')

Structures.extend('Message', Message => {
    class FoxxieMessage extends Message {
        constructor(client, data, channel){
            super(client, data, channel)
            this.responder = new Responder(this);
            this.language = new Language(this);

            const argsMembers = new Members(this);
            const argsUsers = new Users(this);
            const argsChannels = new Channels(this);

            this.members = argsMembers.members;
            this.users = argsUsers.users;
            this.channels = argsChannels.channels;
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

        async awaitResponse(props, msg, collectedResponses) {
            const { message } = props;
            const messages = await message.channel.awaitMessages(m => message.author.id === m.author.id, { time: 60000, max: 1, errors: ['time'] }).catch(() => msg.edit(this.language.get('MESSAGE_PROMPT_TIMEOUT')));
            if (!messages.first || messages?.first().content.toLowerCase() === 'cancel') return msg.edit(this.language.get('MESSAGE_PROMPT_CANCELLED'))
            return collectedResponses(props, msg, messages.first());
        }
    }
    return FoxxieMessage;
})