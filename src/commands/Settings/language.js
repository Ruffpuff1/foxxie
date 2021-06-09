module.exports = {
    name: 'language',
    aliases: ['lang', 'setlang', 'setlanguage'],
    category: 'settings',
    usage: 'fox language',
    permissions: 'CLIENT_OWNER',
    permissions: 'ADMINISTRATOR',
    execute: async(props) => {

        const { message, language } = props;

        let sent = await message.channel.send(language.get('COMMAND_LANGUAGE_ARRAY'));

        await sent.react("🇺🇸");
        await sent.react("🇲🇽");

        let collector = sent.createReactionCollector(user => user.id === message.author.id);

        collector.on("collect", async reaction => {

            if (reaction._emoji.name === "🇺🇸") {

                message.guild.settings.set('language', 'en-US');
                sent.edit(language.get('COMMAND_LANGUAGE_SUCCESS'));
                return sent.reactions.removeAll().catch(e => e);
            }
            if (reaction._emoji.name === "🇲🇽") {

                message.guild.settings.set('language', 'es-MX');
                sent.edit(language.get('COMMAND_LANGUAGE_SUCCESS'));
                return sent.reactions.removeAll().catch(e => e);
            }
        })
    }
}