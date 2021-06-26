const { MessageEmbed } = require('discord.js');
const { Command, weatherjs: { find } } = require('@foxxie/tails');
const { zws, Timestamp } = require('foxxie');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'weather',
            aliases: ['temp', 'forcast'],
            description: language => language.get('COMMAND_WEATHER_DESCRIPTION'),
            usage: '[...City]',
            category: 'utility'
        })

        this.timestamp = new Timestamp('MMM d YYYY');
    }

    async run(msg, args) {

        if (!args[0]) return msg.responder.error('COMMAND_WEATHER_ERROR');
        const loading = await msg.responder.loading();

        find({ search: args.slice(0).join(' '), degreeType: 'F' }, (err, result) => {
            if (err) msg.responder.error('ERROR_GENERIC', err.message);
            if (result.length === 0) return msg.responder.error('COMMAND_WEATHER_ERROR');

            const { date, observationpoint, skytext, imageUrl, temperature, feelslike, winddisplay, humidity, day } = result[0].current;
            const { timezone } = result[0].location;

            const embed = new MessageEmbed()
                .setTitle(msg.language.get('COMMAND_WEATHER_TITLE', observationpoint, skytext))
                .setThumbnail(imageUrl)
                .setColor(msg.guild.me.displayColor)
                .setTimestamp()
                .addField(msg.language.get('COMMAND_WEATHER_TIMEZONE'), `UTC ${timezone}`, true)
                .addField(zws, zws, true)
                .addField(zws, zws, true)
                .addField(msg.language.get('COMMAND_WEATHER_TEMPERATURE'), msg.language.get('COMMAND_WEATHER_DEGREES_F', temperature), true)
                .addField(msg.language.get('COMMAND_WEATHER_FEELS'), msg.language.get('COMMAND_WEATHER_DEGREES_F', feelslike), true)
                .addField(msg.language.get('COMMAND_WEATHER_WINDS'), `${winddisplay}`, true)
                .addField(msg.language.get('COMMAND_WEATHER_HUMID'), `${humidity}%`, true)
                .addField(msg.language.get('COMMAND_WEATHER_DATE'), `${this.timestamp.display(date)}`, true)
                .addField(msg.language.get('COMMAND_WEATHER_DAY'), `${day}`, true)

            msg.channel.send(embed);
            return loading.delete();
        })
    }
}