const api = require('novelcovid')
const Discord = require('discord.js')
const { regexes: { covid: { usStates } } } = require('../../../lib/util/constants');
module.exports = {
    name: 'corona',
    aliases: ['cv', 'covid'],
    usage: 'fox corona [country|state|global|world]',
    category: 'utility',
    async execute (props) {

        let { lang, args, message, language } = props
        let search = args.slice(0).join(" ")
        const embed = new Discord.MessageEmbed()
                .setColor(message.guild.me.displayColor)
                .setFooter(language.get('COMMAND_CORONA_EMBED_FOOTER', lang))

        if (!search || /(global|world|worldwide)/i.test(search)) return this._covidGlobal(props, search, embed);
        if (usStates.test(search)) return this._covidState(props, search, embed);
        this._covidCountry(props, search, embed);
    },

    async _covidGlobal({ message, language, lang }, search, embed){
        let loading = await language.send('MESSAGE_LOADING', lang)
        let stats = await api.all()
        if (stats.message) { loading.delete(); return language.send('COMMAND_CORONA_NO_DATA', lang, search) }

        embed
            .setTitle(language.get('COMMAND_CORONA_EMBED_TITLE', lang, search || 'Global'))
            .addField(language.get('COMMAND_CORONA_CASES_TITLE', lang), language.get('COMMAND_CORONA_CASES_VALUE', lang, stats))
            .addField(language.get('COMMAND_CORONA_DEATHS_TITLE', lang), language.get('COMMAND_CORONA_DEATHS_VALUE', lang, stats))
            .addField(language.get('COMMAND_CORONA_RECOVERIES_TITLE', lang), language.get('COMMAND_CORONA_RECOVERIES_VALUE', lang, stats))
            .addField(language.get('COMMAND_CORONA_TESTS_TITLE', lang), language.get('COMMAND_CORONA_TESTS_VALUE', lang, stats))

        await loading.delete();
        return message.channel.send(embed);
    },

    async _covidState({ message, language, lang }, search, embed){
        let loading = await language.send('MESSAGE_LOADING', lang)
        let stats = await api.states({state:search})
        if (stats.message) { loading.delete(); return language.send('COMMAND_CORONA_NO_DATA', lang, search) }

        embed
            .setTitle(language.get('COMMAND_CORONA_EMBED_TITLE', lang, search))
            .addField(language.get('COMMAND_CORONA_CASES_TITLE', lang), language.get('COMMAND_CORONA_CASES_VALUE', lang, stats))
            .addField(language.get('COMMAND_CORONA_DEATHS_TITLE', lang), language.get('COMMAND_CORONA_DEATHS_VALUE', lang, stats))
            .addField(language.get('COMMAND_CORONA_RECOVERIES_TITLE', lang), language.get('COMMAND_CORONA_RECOVERIES_VALUE', lang, stats))
            .addField(language.get('COMMAND_CORONA_TESTS_TITLE', lang), language.get('COMMAND_CORONA_TESTS_VALUE', lang, stats))

        await loading.delete();
        return message.channel.send(embed);
    },

    async _covidCountry({ message, language, lang }, search, embed){
        let loading = await language.send('MESSAGE_LOADING', lang)
        let stats = await api.countries({country:search});
        if (stats.message) { loading.delete(); return language.send('COMMAND_CORONA_NO_DATA', lang, search) }

        embed
            .setTitle(language.get('COMMAND_CORONA_EMBED_TITLE', lang, search))
            .addField(language.get('COMMAND_CORONA_CASES_TITLE', lang), language.get('COMMAND_CORONA_CASES_VALUE', lang, stats))
            .addField(language.get('COMMAND_CORONA_DEATHS_TITLE', lang), language.get('COMMAND_CORONA_DEATHS_VALUE', lang, stats))
            .addField(language.get('COMMAND_CORONA_RECOVERIES_TITLE', lang), language.get('COMMAND_CORONA_RECOVERIES_VALUE', lang, stats))
            .addField(language.get('COMMAND_CORONA_TESTS_TITLE', lang), language.get('COMMAND_CORONA_TESTS_VALUE', lang, stats))

        await loading.delete();
        return message.channel.send(embed);
    }
}