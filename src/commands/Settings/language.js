module.exports = {
    name: 'language',
    aliases: ['lang', 'setlang', 'setlanguage'],
    category: 'settings',
    usage: 'fox language',
    permissions: 'ADMINISTRATOR',
    execute: async(props) => {

        const { message, language, lang } = props;

        let sent = await message.channel.send(language.get('COMMAND_LANGUAGE_ARRAY', lang));

        await sent.react("🇺🇸");
        await sent.react("🇲🇽");

        let collector = sent.createReactionCollector((reaction, user) => user.id === message.author.id);

        collector.on("collect", async (reaction, user) => {

            if (reaction._emoji.name === "🇺🇸") {

                message.guild.settings.set('language', 'en-US');
                sent.edit(language.get('COMMAND_LANGUAGE_SUCCESS', 'en-US'));
                return sent.reactions.removeAll().catch(e => e);
            }
            if (reaction._emoji.name === "🇲🇽") {

                message.guild.settings.set('language', 'en-US');
                sent.edit(language.get('COMMAND_LANGUAGE_SUCCESS', 'en-US'));
                return sent.reactions.removeAll().catch(e => e);
            }
        })
    }
}