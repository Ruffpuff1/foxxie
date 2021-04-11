const weather = require('weather-js');
const Discord = require('discord.js');
const moment = require('moment');
module.exports = {
    name: 'weather',
    aliases: ['temp', 'forcast'],
    usage: 'fox weather [city]',
    guildOnly: true,
    execute(lang, message, args) {
        if (!args[0]) return message.channel.send(`Ya gotta enter a **city** for me to give the weather.`)
        message.channel.send(lang.COMMAND_MESSAGE_LOADING).then(resultMessage => {
        weather.find({search: args.join(" "), degreeType: 'F'}, function(err, result) {
            if (err) message.channel.send(err.message)
            if(result.length === 0) {
                message.channel.send('**Please,** Enter A Valid Location.')
                return undefined;
            }
            var current = result[0].current;
            var location = result[0].location;
            const date = moment(current.date).format('MMM Do YYYY');
            const embed = new Discord.MessageEmbed()
                .setTitle(`${current.observationpoint} (Weather: ${current.skytext})`)
                .setThumbnail(current.imageUrl)
                .setColor(message.guild.me.displayColor)
                .setTimestamp()
                .addFields(
                    {
                        name: `**Timezone** :clock12:`,
                        value: `UTC ${location.timezone}`,
                        inline: true
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: true
                    },
                    {
                        name: '\u200B',
                        value: '\u200B',
                        inline: true
                    },
                    {
                        name: '**Temperature** :white_sun_cloud:',
                        value: `${current.temperature} Degrees°F`,
                        inline: true
                    },
                    {
                        name: '**Feels Like** :sunflower:',
                        value: `${current.feelslike} Degrees°F`,
                        inline: true
                    },
                    {
                        name: '**Winds** :wind_blowing_face:',
                        value: `${current.winddisplay}`,
                        inline: true
                    },
                    {
                        name: '**Humidity** :hotsprings:',
                        value: `${current.humidity}%`,
                        inline: true
                    },
                    {
                        name: '**Date** :calendar:',
                        value: `${date}`,
                        inline: true
                    },
                    {
                        name: '**Day** :alarm_clock:',
                        value: `${current.day}`,
                        inline: true
                    }
                )
            message.channel.send(embed)
            resultMessage.delete()
        })
        })
    }
}