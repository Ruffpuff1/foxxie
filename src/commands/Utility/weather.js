const weather = require('weather-js');
const Discord = require('discord.js');
const moment = require('moment');
const { zws } = require('../../../lib/util/constants')

module.exports = {
    name: 'weather',
    aliases: ['temp', 'forcast'],
    usage: 'fox weather [city]',
    category: 'utility',
    execute: async (props) => {

        let { message, args, language } = props;

        if (!args[0]) return message.responder.error('COMMAND_WEATHER_ERROR');
        let loading = await message.responder.loading();
        weather.find({ search: args.join(" "), degreeType: 'F' }, function(err, result) {
            if (err) message.channel.send(err.message)
            if (result.length === 0) return message.responder.error('COMMAND_WEATHER_ERROR');
             
            var current = result[0].current;
            var location = result[0].location;
            const day = moment(current.date).format('MMM Do YYYY');

            const embed = new Discord.MessageEmbed()
                .setTitle(language.get('COMMAND_WEATHER_TITLE', current.observationpoint, current.skytext))
                .setThumbnail(current.imageUrl)
                .setColor(message.guild.me.displayColor)
                .setTimestamp()
                .addField(language.get('COMMAND_WEATHER_TIMEZONE'), `UTC ${location.timezone}`, true)
                .addField(zws, zws, true)
                .addField(zws, zws, true)
                .addField(language.get('COMMAND_WEATHER_TEMPERATURE'), language.get('COMMAND_WEATHER_DEGREES_F', current.temperature), true)
                .addField(language.get('COMMAND_WEATHER_FEELS'), language.get('COMMAND_WEATHER_DEGREES_F', current.feelslike), true)
                .addField(language.get('COMMAND_WEATHER_WINDS'), `${current.winddisplay}`, true)
                .addField(language.get('COMMAND_WEATHER_HUMID'), `${current.humidity}%`, true)
                .addField(language.get('COMMAND_WEATHER_DATE'), `${day}`, true)
                .addField(language.get('COMMAND_WEATHER_DAY'), `${current.day}`, true)

            loading.delete();
            message.channel.send(embed)
       })
    }
}