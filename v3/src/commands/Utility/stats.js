/**
 * Co-authored by Ruff <Ruffpuff#0017> (http://ruff.cafe)
 * Co-authored by ravy (https://ravy.pink)
 */
const { ms, Command, version: foxxieVersion } = require('@foxxie/tails');
const { hostname, totalmem, cpus, loadavg } = require('os');
const { version: discordVersion, MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'stats',
            aliases: ["up", 'uptime', 'shards'],
            description: language => language.get('COMMAND_STATS_DESCRIPTION'),
            requiredPermissions: ['EMBED_LINKS'],
            category: 'utility'
        })
    }

    run(message) {
        const total = (totalmem() / 1024 / 1024 / 1024).toFixed(0) * 1024;
        const usage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        const stats = message.language.get('COMMAND_STATS',
            this.client.user.username,
            usage.toLocaleString(),
            total.toLocaleString(),
            (usage / total * 100).toFixed(1),
            (loadavg()[0] * 100).toFixed(1),
			cpus().length,
			(cpus()[0].speed / 1000).toFixed(1),
            ms(ms(ms(process.uptime() * 1000)), { long: true }),
            foxxieVersion, discordVersion, process.version, hostname(),
            (message.guild
				? message.guild.shardID
				: 0) + 1,
			this.client.options.shardCount
        );

        const embed = new MessageEmbed()
            .setAuthor(
                `${this.client.user.username} v${this.client.options.version}`,
                this.client.user.displayAvatarURL({ format: 'png', size: 2048 })
            )
            .setDescription(stats)
            .setColor(message.guild?.me.displayColor || null)

        message.channel.send(embed);
    }
}