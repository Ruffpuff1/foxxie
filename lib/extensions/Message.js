const { Structures } = require('discord.js');
const Responder = require('../../lib/Responder')
const Language = require('../../lib/Language');
const { reactions: { yes, no } } = require('../util/constants')

Structures.extend('Message', Message => {
    class FoxxieMessage extends Message {
        constructor(client, data, channel){
            super(client, data, channel)
            this.responder = new Responder(this);
            this.language = new Language(this);
        }

        async confirm(message, key, lang, msg, confirmed) {

            await message.edit(this.language.get(key, lang));
            await message.react(yes);
            await message.react(no);

            let collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id);

            await collector.on('collect', async (reaction, user) => {

                if (reaction._emoji.id === no) {

                    message.delete();
                    return this.language.send('MESSAGE_CANCELLED', lang);
                }
                if (reaction._emoji.id === yes) return confirmed();
            })
        }

        async awaitResponse(props, msg, collectedResponses) {

            const { message, args, lang, language } = props;
            const messages = await message.channel.awaitMessages(m => message.author.id === m.author.id, { time: 60000, max: 1, errors: ['time'] })
            if (messages.first().content.toLowerCase() === 'cancel') return msg.edit(this.language.get('MESSAGE_CANCELLED', lang))

            return collectedResponses(props, msg, messages.first());
        }
    }
    return FoxxieMessage;
})