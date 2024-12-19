import { resolveToNull } from '@ruffpuff/utilities';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Starboard } from '#lib/Database/Models/starboard';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { GuildMessage } from '#lib/types';
import { defaultPaginationOptions, defaultPaginationOptionsWithoutSelectMenu } from '#root/config';
import { Emojis } from '#utils/constants';
import { RequiresMemberPermissions, RequiresStarboardEntries } from '#utils/decorators';
import { FoxxiePaginatedMessage } from '#utils/External/FoxxiePaginatedMessage';
import { getGuildStarboard } from '#utils/functions';
import { PermissionFlagsBits } from 'discord.js';

@ApplyOptions<FoxxieSubcommand.Options>({
	aliases: ['sb', 'stars'],
	description: LanguageKeys.Commands.Configuration.Starboard.Description,
	detailedDescription: LanguageKeys.Commands.Configuration.Starboard.DetailedDescription,
	runIn: [CommandOptionsRunTypeEnum.GuildAny],
	subcommands: [{ messageRun: 'list', name: 'list' }]
})
export class UserCommand extends FoxxieSubcommand {
	@RequiresClientPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions])
	@RequiresMemberPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions])
	@RequiresStarboardEntries()
	public async list(msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<void> {
		const channel = await args.pick('channelName').catch(() => null);
		const starMessageId = await args.pick('number').catch(() => 1);

		const loading = await send(
			msg,
			channel
				? `${Emojis.Loading} Fetching star messages in ${channel.toString()}...`
				: `${Emojis.Loading} Fetching this servers star messages...`
		);
		const starboard = getGuildStarboard(msg.guild);
		const starboards = (await this.container.prisma.starboard.findMany({ orderBy: { id: 'asc' }, where: { guildId: msg.guildId } })).map(
			(star) => new Starboard(star)
		);

		const channelIds = [...new Set(starboards.map((s) => s.channelId))];
		await Promise.all(channelIds.map((channelId) => resolveToNull(this.container.client.channels.fetch(channelId))));

		const display = new FoxxiePaginatedMessage({
			actions: starboards.length > 25 ? defaultPaginationOptionsWithoutSelectMenu : defaultPaginationOptions
		});

		const filtered = starboards.filter((star) => star.enabled).filter((star) => (channel ? channel.id === star.channelId : true));
		const foundIndex = filtered.findIndex((star) => star.id === starMessageId);

		for (const star of filtered) {
			display.addAsyncPageBuilder(async (builder) => {
				const channel = msg.guild.channels.cache.get(star.channelId);
				if (!channel || !channel.isSendable()) return builder.setContent('no channel');
				const message = await resolveToNull(channel.messages.fetch(star.messageId));
				if (!message) {
					await star.setup(starboard).edit({ enabled: false });
					return builder.setContent(`no message ${star.enabled} ${star.id}`);
				}

				star.init(starboard, message as GuildMessage);

				await star.downloadStarMessage();
				await star.downloadUserList();

				const options = await star.getStarContent(args.t);

				return builder.setContent(options.content!).setEmbeds(options.embeds);
			});
		}

		await display.setIndex(foundIndex === -1 ? 0 : foundIndex).run(loading, msg.author);
	}
}
