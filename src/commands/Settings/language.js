const { Command } = require('@foxxie/tails');
const { language } = require('~/lib/util/constants').emojis;

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'language',
            aliases: ['lang', 'setlang', 'setlanguage'],
            description: language => language.get('COMMAND_LANGUAGE_DESCRIPTION'),
            permissions: 'ADMINISTRATOR',
            permissionLevel: 10,
            category: 'settings'
        })
    }

    async run(msg) {
        const message = await msg.channel.send(msg.language.get('COMMAND_LANGUAGE_ARRAY'));
        await message.react('🇺🇸');
        await message.react('🇲🇽');

        let collector = message.createReactionCollector((_, user) => user.id === msg.author.id, { time: 30000, max: 1 });

        collector.on("collect", async reaction => {

            if (reaction._emoji.name === '🇺🇸') {

                msg.guild.settings.set('language', 'en-US');
                message.edit(this.client.languages.get('en-US').language['COMMAND_LANGUAGE_SUCCESS']);
                return message.reactions.removeAll().catch(() => null);
            }
            if (reaction._emoji.name === '🇲🇽') {

                msg.guild.settings.set('language', 'es-MX');
                message.edit(this.client.languages.get('es-MX').language['COMMAND_LANGUAGE_SUCCESS']);
                return message.reactions.removeAll().catch(() => null);
            }
        })
    }
}