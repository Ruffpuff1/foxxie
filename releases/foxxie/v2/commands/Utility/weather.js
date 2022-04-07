const weather = require('weather-js');
const Discord = require('discord.js');
const moment = require('moment');
const { foxColor } = require('../../config.json');
module.exports = {
	name: 'weather',
	aliases: ['temp', 'forcast'],
	description: 'Provides the weather for a city. Supports any city in the world, will provide weather, timezone, humidity, and more.',
	usage: 'weather [city]',
	guildOnly: false,
	execute(client, message, args) {
		if (!args[0]) return message.channel.send('Go ahead and tell me a city you want the weather for.');

		weather.find({ search: args.join(' '), degreeType: 'F' }, function (err, result) {
			if (err) message.channel.send(err.message);

			if (result.length === 0) {
				message.channel.send('**Please Enter A Valid Location.**');
				return undefined;
			}

			var current = result[0].current;
			var location = result[0].location;
			const date = moment(current.date).format('MMM Do YYYY');

			const embed = new Discord.MessageEmbed()
				.setTitle(`${current.observationpoint} (Weather: ${current.skytext})`)
				.setThumbnail(current.imageUrl)
				.setColor(foxColor)
				.addField('**Timezone** :clock12:', `UTC ${location.timezone}`, true)
				.addField('**Degree Type** :thermometer:', `${location.degreetype}`, true)
				.addField('**Temperature** :white_sun_cloud:', `${current.temperature} Degrees`, true)
				.addField('**Feels Like** :sunflower:', `${current.feelslike} Degrees`, true)
				.addField('**Winds** :wind_blowing_face:', `${current.winddisplay}`, true)
				.addField('**Humidity** :hotsprings:', `${current.humidity}%`, true)
				.addField('**Date** :calendar:', `${date}`, true)
				.addField('**Day** :alarm_clock:', `${current.day}`, true)
				.setTimestamp();

			message.channel.send({ embed });
		});
	}
};
