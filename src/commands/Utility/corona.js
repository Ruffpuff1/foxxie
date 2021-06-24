const { all, states, countries } = require('novelcovid');
const { MessageEmbed } = require('discord.js');
const { Command, LOCATION_REGEX: { usStates } } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'corona',
            aliases: ['cv', 'covid'],
            description: language => language.get('COMMAND_CORONA_DESCRIPTION'),
            usage: '[Country | State | global]',
            category: 'utility'
        })
    }

    async run(msg, [...search]) {
        search = search.join(' ');

        const embed = new MessageEmbed()
                .setColor(msg.guild.me.displayColor)
                .setFooter(msg.language.get('COMMAND_CORONA_FOOTER'))

        if (!search || /(global|world|worldwide)/i.test(search)) return this.global(msg, search, embed);
        if (usStates.test(search)) return this.state(msg, search, embed);
        this.country(msg, search, embed);
    }

    async global(message, search, embed) {

        let loading = await message.responder.loading();
        let stats = await all()
        if (stats.message) { loading.delete(); return message.responder.error('COMMAND_CORONA_NO_DATA', search) }

        embed
            .setTitle(message.language.get('COMMAND_CORONA_TITLE', search || 'Global'))
            .addField(message.language.get('COMMAND_CORONA_CASES_TITLE'), message.language.get('COMMAND_CORONA_CASES_VALUE', stats))
            .addField(message.language.get('COMMAND_CORONA_DEATHS_TITLE'), message.language.get('COMMAND_CORONA_DEATHS_VALUE', stats))
            .addField(message.language.get('COMMAND_CORONA_RECOVERIES_TITLE'), message.language.get('COMMAND_CORONA_RECOVERIES_VALUE', stats))
            .addField(message.language.get('COMMAND_CORONA_TESTS_TITLE'), message.language.get('COMMAND_CORONA_TESTS_VALUE', stats))

        await loading.delete();
        return message.channel.send(embed);
    }

    async state(message, search, embed) {
        let loading = await message.responder.loading();
        let stats = await states({state:search})
        if (stats.message) { loading.delete(); return message.responder.error('COMMAND_CORONA_NO_DATA', search) }

        embed
            .setTitle(message.language.get('COMMAND_CORONA_TITLE', search))
            .addField(message.language.get('COMMAND_CORONA_CASES_TITLE'), message.language.get('COMMAND_CORONA_CASES_VALUE', stats))
            .addField(message.language.get('COMMAND_CORONA_DEATHS_TITLE'), message.language.get('COMMAND_CORONA_DEATHS_VALUE', stats))
            .addField(message.language.get('COMMAND_CORONA_RECOVERIES_TITLE'), message.language.get('COMMAND_CORONA_RECOVERIES_VALUE', stats))
            .addField(message.language.get('COMMAND_CORONA_TESTS_TITLE'), message.language.get('COMMAND_CORONA_TESTS_VALUE', stats))

        await loading.delete();
        return message.channel.send(embed);
    }

        async country(message, search, embed){
        let loading = await message.responder.loading();
        let stats = await countries({country:search});
        if (stats.message) { loading.delete(); return message.responder.error('COMMAND_CORONA_NO_DATA', search) }

        embed
            .setTitle(message.language.get('COMMAND_CORONA_TITLE', search))
            .addField(message.language.get('COMMAND_CORONA_CASES_TITLE'), message.language.get('COMMAND_CORONA_CASES_VALUE', stats))
            .addField(message.language.get('COMMAND_CORONA_DEATHS_TITLE'), message.language.get('COMMAND_CORONA_DEATHS_VALUE', stats))
            .addField(message.language.get('COMMAND_CORONA_RECOVERIES_TITLE'), message.language.get('COMMAND_CORONA_RECOVERIES_VALUE', stats))
            .addField(message.language.get('COMMAND_CORONA_TESTS_TITLE'), message.language.get('COMMAND_CORONA_TESTS_VALUE', stats))

        await loading.delete();
        return message.channel.send(embed);
    }
}