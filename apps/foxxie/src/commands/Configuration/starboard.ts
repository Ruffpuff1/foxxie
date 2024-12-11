import { resolveToNull, toTitleCase } from '@ruffpuff/utilities';
import { ApplyOptions, RequiresClientPermissions, RequiresUserPermissions } from '@sapphire/decorators';
import { CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { cast, cutText } from '@sapphire/utilities';
import { Starboard } from '#lib/Database/Models/starboard';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { GuildMessage } from '#lib/types';
import { minutes } from '#utils/common';
import { Emojis } from '#utils/constants';
import { FoxxiePaginatedMessageEmbedFields } from '#utils/External/FoxxiePaginatedMessageEmbedFields';
import { getGuildStarboard } from '#utils/functions';
import { sendLoadingMessage } from '#utils/functions/messages';
import { resolveClientColor } from '#utils/util';
import {
	blockQuote,
	bold,
	channelMention,
	EmbedBuilder,
	escapeMarkdown,
	inlineCode,
	PermissionFlagsBits,
	TextChannel,
	userMention
} from 'discord.js';

@ApplyOptions<FoxxieSubcommand.Options>({
	aliases: ['sb', 'stars'],
	description: LanguageKeys.Commands.Configuration.Starboard.Description,
	detailedDescription: LanguageKeys.Commands.Configuration.Starboard.DetailedDescription,
	runIn: [CommandOptionsRunTypeEnum.GuildAny],
	subcommands: [{ default: true, messageRun: 'list', name: 'list' }]
})
export class UserCommand extends FoxxieSubcommand {
	@RequiresClientPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions])
	@RequiresUserPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions])
	public async list(msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<void> {
		const loading = await sendLoadingMessage(msg);
		const starboard = getGuildStarboard(msg.guild);
		const starboards = (await this.container.prisma.starboard.findMany({ orderBy: { id: 'desc' }, where: { guildId: msg.guildId } })).map(
			(star) => new Starboard(star).setup(starboard)
		);

		const template = new EmbedBuilder()
			.setTitle(`Starred Messages in ${msg.guild.name}`)
			.setColor(await resolveClientColor(msg))
			.setFooter({ text: `${starboards.length} stars in ${msg.guild.name}` });

		await new FoxxiePaginatedMessageEmbedFields()
			.setTemplate(template)
			.setIdle(minutes(5))
			.setItemsPerPage(5)
			.setItems(
				await Promise.all(
					starboards.map(async (star) => {
						const lines: string[] = [];

						const channel = cast<TextChannel>(
							this.container.client.channels.cache.get(star.channelId) ||
								(await resolveToNull(this.container.client.channels.fetch(star.channelId)))
						);
						if (!channel) return null;
						const message = channel.messages.cache.get(star.messageId) || (await resolveToNull(channel.messages.fetch(star.messageId)));
						if (!message) return null;

						const user = this.container.client.users.cache.get(star.userId);
						const { content, url } = message;

						lines.push(
							args.t(LanguageKeys.Commands.Moderation.Utilities.Case.ListDetailsLocation, {
								channel: channelMention(channel.id),
								emoji: Emojis.Information,
								id: channel.id
							})
						);

						const userInGuild = msg.guild.members.cache.has(star.userId);
						lines.push(
							args.t(LanguageKeys.Commands.Moderation.Utilities.Case.ListDetailsUser, {
								emoji: user ? (user.bot ? Emojis.Bot : Emojis.ShieldMember) : Emojis.ShieldMember,
								mention: user
									? userInGuild
										? userMention(user.id)
										: escapeMarkdown(user.username)
									: toTitleCase(args.t(LanguageKeys.Globals.Unknown)),
								userId: star.userId
							})
						);

						lines.push(`${star.emoji} **Message:** [Here](${url}) (${message.id})`);
						if (content) lines.push(blockQuote(cutText(content, 150)));

						return {
							inline: false,
							name: `${inlineCode(star.id.toString())} → ${bold(star.stars.toLocaleString())} Stars`,
							value: lines.join('\n')
						};
					})
				).then((r) => r.filter((c) => !!c))
			)
			.make()
			.run(msg, msg.author);

		await loading.delete();
	}
}
