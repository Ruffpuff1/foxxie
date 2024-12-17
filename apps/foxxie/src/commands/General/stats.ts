import makeRequest from '@aero/http';
import { version as sapphireVersion } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { sendLoadingMessage } from '#utils/functions';
import { resolveClientColor } from '#utils/util';
import { EmbedBuilder, time, TimestampStyles } from 'discord.js';
import { version as discordVersion } from 'discord.js';
import { cpus, hostname, loadavg, totalmem } from 'node:os';

export class UserCommand extends FoxxieCommand {
	#deps = [`Node.js ${process.version}`, `Discord.js v${discordVersion}`, `Sapphire v${sapphireVersion}`];

	public async messageRun(message: GuildMessage, args: FoxxieCommand.Args) {
		await sendLoadingMessage(message);
		const hash = await this.#fetchCommit();
		const head = hash ? ` [${hash}]` : '';

		const shard = (message.guild ? message.guild.shardId : 0) + 1;
		const {
			cpuCount,
			cpuSpeed,
			cpuUsage,
			memoryPercent,
			memoryUsed,
			process: pross,
			totalmemory,
			totalShards,
			uptime
		} = this.#getServerDetails();

		const [guilds, totalMessageCount] = await this.container.prisma.guilds
			.findMany()
			.then((guilds) => [guilds, guilds.reduce((acc, r) => (acc += r.messageCount), 0)] as const);

		const description = [
			`**My current statistics!**`,
			`**•** ${memoryPercent}% of RAM (${memoryUsed} / ${totalmemory} MB) and`,
			`**•** ${cpuUsage}% of CPU (${cpuCount}c @ ${cpuSpeed}GHz).`,
			`**•** Reading ${args.t(LanguageKeys.Globals.NumberFormat, { value: totalMessageCount })} messages, from ${args.t(LanguageKeys.Globals.NumberFormat, { value: guilds.length })} servers, and ${args.t(LanguageKeys.Globals.NumberFormat, { value: this.container.client.users.cache.filter((user) => this.container.client.guilds.cache.some((a) => a.members.cache.has(user.id))).size })} users.`,
			`**I've been running**`,
			`**•** As of ${time(uptime, TimestampStyles.RelativeTime)} on ${pross} (shard ${shard} / ${totalShards})`,
			`**•** Using ${args.t(LanguageKeys.Globals.And, { value: this.#deps })}.`
		];

		const embed = new EmbedBuilder()
			.setAuthor({
				iconURL: this.client.user?.displayAvatarURL(),
				name: `${this.client.user?.username} v${process.env.VERSION_NUM}${this.container.client.enabledProdOnlyEvent() ? '' : '-dev'}${head}`,
				url: `https://github.com/Ruffpuff1/foxxie/commit/${hash}`
			})
			.setDescription(description.join('\n'))
			.setColor(await resolveClientColor(message, message.member.displayColor))
			.setFooter({ text: `© ${process.env.COPYRIGHT_YEAR} ${this.container.client.user!.username}` });

		await send(message, { content: null!, embeds: [embed] });
	}

	#fetchCommit() {
		return makeRequest('https://api.github.com/repos/Ruffpuff1/foxxie/commits/main') //
			.json()
			.then((data: any) => data.sha.substring(0, 7))
			.catch(() => null);
	}

	#getServerDetails() {
		const totalmemory = ((totalmem() / 1024 / 1024 / 1024) * 1024).toFixed(0);
		const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
		return {
			cpuCount: cpus().length,
			cpuSpeed: (cpus()[0].speed / 1000).toFixed(1),
			cpuUsage: (loadavg()[0] * 10).toFixed(1),
			memoryPercent: ((parseInt(memoryUsed, 10) / parseInt(totalmemory, 10)) * 100).toFixed(1),
			memoryUsed,
			process: hostname(),
			totalmemory,
			totalShards: this.container.client.options.shardCount || 1,
			uptime: new Date(Date.now() - this.container.client.uptime!),
			version: process.env.CLIENT_VERSION!
		};
	}
}
