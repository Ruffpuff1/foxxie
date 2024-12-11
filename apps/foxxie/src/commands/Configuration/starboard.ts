import { Starboard } from '#lib/Database/Models/starboard';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieSubcommand } from '#lib/Structures/commands/FoxxieSubcommand';
import { GuildMessage } from '#lib/types';
import { minutes } from '#utils/common';
import { Emojis, SubcommandKeys } from '#utils/constants';
import { FoxxiePaginatedMessageEmbedFields } from '#utils/External/FoxxiePaginatedMessageEmbedFields';
import { getGuildStarboard } from '#utils/functions';
import { sendLoadingMessage } from '#utils/functions/messages';
import { resolveClientColor } from '#utils/util';
import { resolveToNull, toTitleCase } from '@ruffpuff/utilities';
import { ApplyOptions, RequiresClientPermissions, RequiresUserPermissions } from '@sapphire/decorators';
import { CommandOptionsRunTypeEnum } from '@sapphire/framework';
import { MessageOptions, send } from '@sapphire/plugin-editable-commands';
import { TFunction } from '@sapphire/plugin-i18next';
import { cast, cutText } from '@sapphire/utilities';
import {
	blockQuote,
	bold,
	channelMention,
	EmbedBuilder,
	escapeMarkdown,
	hyperlink,
	inlineCode,
	italic,
	Message,
	PermissionFlagsBits,
	TextChannel,
	userMention
} from 'discord.js';

const Root = LanguageKeys.Commands.Configuration.Starboard;

@ApplyOptions<FoxxieSubcommand.Options>({
	aliases: ['sb', 'stars'],
	description: Root.Description,
	detailedDescription: Root.DetailedDescription,
	runIn: [CommandOptionsRunTypeEnum.GuildAny],
	subcommands: [
		{ name: SubcommandKeys.List, messageRun: SubcommandKeys.List, default: true },
		{ name: SubcommandKeys.Show, messageRun: SubcommandKeys.Show }
	]
})
export class UserCommand extends FoxxieSubcommand {
	@RequiresClientPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions])
	@RequiresUserPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions])
	public async [SubcommandKeys.List](msg: GuildMessage, args: FoxxieSubcommand.Args): Promise<void> {
		const loading = await sendLoadingMessage(msg);
		await this.#makeList(msg, args.t);
		await loading.delete();
	}

	@RequiresClientPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions])
	@RequiresUserPermissions([PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.AddReactions])
	public async [SubcommandKeys.Show](msg: GuildMessage, args: FoxxieSubcommand.Args) {
		await sendLoadingMessage(msg);
		const entity = await this.#retrieveStarEntry(args);
		await send(msg, await this.#makeDisplay(entity, args.t));
	}

	async #makeDisplay(entity: Starboard, t: TFunction): Promise<MessageOptions> {
		const messageOptions = await entity.getStarContent(t);

		const { starMessageURL } = entity;
		if (starMessageURL) {
			const { content } = messageOptions;
			const linkContent = italic(hyperlink(t(Root.JumpToStarMessage), starMessageURL));

			if (content) messageOptions.content = [content, linkContent].join('\n');
			messageOptions.content = linkContent;
		}

		return messageOptions;
	}

	async #makeList(entity: GuildMessage | FoxxieSubcommand.Interaction, t: TFunction) {
		const starboard = getGuildStarboard(entity.guild!);
		const starboards = (await this.container.prisma.starboard.findMany({ where: { guildId: entity.guildId! }, orderBy: { id: 'desc' } })).map(
			(star) => new Starboard(star).setup(starboard)
		);

		const guild = entity.guild!;
		const user = entity instanceof Message ? entity.author : entity.user;

		const template = new EmbedBuilder()
			.setTitle(`Starred Messages in ${guild.name}`)
			.setColor(await resolveClientColor(entity))
			.setFooter({ text: `${starboards.length} stars in ${guild.name}` });

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
							t(LanguageKeys.Commands.Moderation.Utilities.Case.ListDetailsLocation, {
								emoji: Emojis.Information,
								channel: channelMention(channel.id),
								id: channel.id
							})
						);

						const userInGuild = guild.members.cache.has(star.userId);
						lines.push(
							t(LanguageKeys.Commands.Moderation.Utilities.Case.ListDetailsUser, {
								emoji: user ? (user.bot ? Emojis.Bot : Emojis.ShieldMember) : Emojis.ShieldMember,
								mention: user
									? userInGuild
										? userMention(user.id)
										: escapeMarkdown(user.username)
									: toTitleCase(t(LanguageKeys.Globals.Unknown)),
								userId: star.userId
							})
						);

						lines.push(`${star.emoji} **Message:** [Here](${url}) (${message.id})`);
						if (content) lines.push(blockQuote(cutText(content, 150)));

						return {
							name: `${inlineCode(star.id.toString())} → ${bold(star.stars.toLocaleString())} Stars`,
							value: lines.join('\n'),
							inline: false
						};
					})
					// eslint-disable-next-line no-implicit-coercion
				).then((r) => r.filter((c) => !!c))
			)
			.make()
			.run(entity, user);
	}

	async #retrieveStarEntry(args: FoxxieSubcommand.Args): Promise<Starboard> {
		const entity = await args.pick('starboard').catch(() =>
			this.container.prisma.starboard
				.findMany({
					where: { guildId: args.message.guildId! },
					orderBy: { id: 'desc' }
				})
				.then((stars) => {
					const first = stars[0];
					if (!first) this.error(LanguageKeys.Arguments.StarboardEmpty);

					return new Starboard(first);
				})
		);

		const starMessageChannel = await resolveToNull(this.container.client.channels.fetch(entity.channelId));
		if (!starMessageChannel || !starMessageChannel.isSendable()) this.error(Root.ShowNoChannel);

		const starredMessage = await resolveToNull(starMessageChannel.messages.fetch(entity.messageId));
		if (!starredMessage || !starredMessage.inGuild()) this.error(Root.ShowNoMessage);

		const guildStarboard = getGuildStarboard(args.message.guild!);
		entity.init(guildStarboard, starredMessage as GuildMessage);

		await entity.downloadStarMessage();
		await entity.downloadUserList();

		return entity;
	}
}
