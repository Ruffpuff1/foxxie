import { container, version as sapphireVersion } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { FTFunction, GuildMessage } from '#lib/types';
import { GuildOnlyCommand, RegisterCommand, RequiresMemberPermissions } from '#utils/decorators';
import { sendLoadingMessage } from '#utils/functions';
import { fetchCommit, getServerDetails, resolveClientColor } from '#utils/util';
import { EmbedBuilder, GuildMember, PermissionFlagsBits } from 'discord.js';
import { version as discordVersion } from 'discord.js';

@GuildOnlyCommand()
@RegisterCommand((command) =>
	command
		.setAliases('uptime', 'up')
		.setDescription(StatsCommand.Language.Description)
		.setDetailedDescription(StatsCommand.Language.DetailedDescription)
		.setRequiredClientPermissions(PermissionFlagsBits.EmbedLinks)
)
export class StatsCommand extends FoxxieCommand {
	@RequiresMemberPermissions(PermissionFlagsBits.EmbedLinks)
	public async messageRun(message: GuildMessage, args: FoxxieCommand.Args) {
		await sendLoadingMessage(message);
		const embed = await StatsCommand.StatsMenu(message.member, args.t);
		await send(message, { content: null!, embeds: [embed] });
	}

	private static async StatsMenu(member: GuildMember, t: FTFunction) {
		const { guild } = member;
		const hash = await fetchCommit();
		const head = hash ? ` [${hash}]` : '';

		const shard = (guild ? guild.shardId : 0) + 1;
		const { cpuCount, cpuSpeed, cpuUsage, memoryPercent, memoryUsed, process: pross, totalmemory, totalShards, uptime } = getServerDetails();

		const [guilds, totalMessageCount] = await container.prisma.guilds
			.findMany()
			.then((guilds) => [guilds, guilds.reduce((acc, r) => (acc += r.messageCount), 0)] as const);

		const description = t(StatsCommand.Language.Menu, {
			cpuCount,
			cpuSpeed,
			cpuUsage,
			deps: StatsCommand.Dependencies,
			memoryPercent,
			memoryUsed,
			messages: totalMessageCount,
			process: pross,
			servers: guilds.length,
			shard,
			shardTotal: totalShards,
			totalmemory,
			uptime,
			users: container.client.users.cache.filter((user) => container.client.guilds.cache.some((a) => a.members.cache.has(user.id))).size
		});

		return new EmbedBuilder()
			.setAuthor({
				iconURL: container.client.user?.displayAvatarURL(),
				name: `${container.client.user?.username} v${process.env.VERSION_NUM}${container.client.enabledProdOnlyEvent() ? '' : '-dev'}${head}`,
				url: `https://github.com/Ruffpuff1/foxxie/commit/${hash}`
			})
			.setDescription(description.join('\n'))
			.setColor(await resolveClientColor(guild, member.displayColor))
			.setFooter({ text: `© ${process.env.COPYRIGHT_YEAR} ${container.client.user!.username}` });
	}

	public static Language = LanguageKeys.Commands.General.Stats;

	protected static Dependencies = [`Node.js ${process.version}`, `Discord.js v${discordVersion}`, `Sapphire v${sapphireVersion}`];
}
