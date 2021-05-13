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

        let { lang, message, args, language } = props;

        if (!args[0]) return message.channel.send(language.get('COMMAND_WEATHER_ERROR', lang))
        let loading = await message.channel.send(language.get("MESSAGE_LOADING", lang))
        weather.find({ search: args.join(" "), degreeType: 'F' }, function(err, result) {
            if (err) message.channel.send(err.message)
            if (result.length === 0) return message.channel.send(language.get('COMMAND_WEATHER_ERROR', lang))
             
            var current = result[0].current;
            var location = result[0].location;
            const day = moment(current.date).format('MMM Do YYYY');

            const embed = new Discord.MessageEmbed()
                .setTitle(language.get('COMMAND_WEATHER_TITLE', lang, current.observationpoint, current.skytext))
                .setThumbnail(current.imageUrl)
                .setColor(message.guild.me.displayColor)
                .setTimestamp()
                .addField(language.get('COMMAND_WEATHER_TIMEZONE', lang), `UTC ${location.timezone}`, true)
                .addField(zws, zws, true)
                .addField(zws, zws, true)
                .addField(language.get('COMMAND_WEATHER_TEMPERATURE', lang), language.get('COMMAND_WEATHER_DEGREES_F', lang, current.temperature), true)
                .addField(language.get('COMMAND_WEATHER_FEELS', lang), language.get('COMMAND_WEATHER_DEGREES_F', lang, current.feelslike), true)
                .addField(language.get('COMMAND_WEATHER_WINDS', lang), `${current.winddisplay}`, true)
                .addField(language.get('COMMAND_WEATHER_HUMID', lang), `${current.humidity}%`, true)
                .addField(language.get('COMMAND_WEATHER_DATE', lang), `${day}`, true)
                .addField(language.get('COMMAND_WEATHER_DAY', lang), `${current.day}`, true)

            loading.delete();
            message.channel.send(embed)
       })
    }
}