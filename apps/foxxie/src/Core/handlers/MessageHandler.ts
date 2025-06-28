import { isStageChannel } from '@sapphire/discord.js-utilities';
import {
	Command,
	container,
	Events,
	MessageCommand,
	MessageCommandAcceptedPayload,
	MessageCommandRunPayload,
	PreMessageCommandRunPayload
} from '@sapphire/framework';
import { get, send } from '@sapphire/plugin-editable-commands';
import { fetchT } from '@sapphire/plugin-i18next';
import { Result } from '@sapphire/result';
import { Stopwatch } from '@sapphire/stopwatch';
import { hasAtLeastOneKeyInMap, isNullish } from '@sapphire/utilities';
import { envParseString } from '@skyra/env-utilities';
import { CommandMatcher, readSettings, writeSettings } from '#lib/database';
import { acquireMember, createMember, updateMember } from '#lib/database/Models/member';
import { getT, LanguageKeys } from '#lib/i18n';
import { DMMessage, EnvKeys, EventArgs, FoxxieEvents, FTFunction, GuildMessage } from '#lib/types';
import { hours, minutes } from '#utils/common';
import { BotIds, Schedules } from '#utils/constants';
import { ProductionOnly, TypingEnabled } from '#utils/decorators';
import { deleteMessage, getCommand, isAdmin, sendMessage } from '#utils/functions';
import {
	ChannelType,
	GatewayDispatchEvents,
	GuildMember,
	GuildTextBasedChannel,
	italic,
	Message,
	PermissionFlagsBits,
	PermissionsBitField,
	userMention
} from 'discord.js';

import { Event } from '../structures/EventDecorators.js';

export class MessageHandler {
	@Event((listener) => listener.setName(FoxxieEvents.MessageCreate).setEvent(FoxxieEvents.MessageCreate))
	public static async Create(...[message]: EventArgs<FoxxieEvents.MessageCreate>) {
		if (isNullish(message.guild) || isNullish(message.member)) {
			if (message.channel.isDMBased()) return MessageHandler.MessageDM(message as DMMessage);
			return;
		}

		if (message.system) {
			return MessageHandler.System(message as GuildMessage);
		}

		if (message.author.bot) {
			await MessageHandler.Bot(message as GuildMessage);
		} else {
			await MessageHandler.User(message as GuildMessage);
		}

		return MessageHandler.Stats(message.guild.id, message.member);
	}

	@Event((listener) => listener.setEvent(FoxxieEvents.MessageDelete).setName(FoxxieEvents.MessageDelete))
	public static Delete(...[message]: EventArgs<FoxxieEvents.MessageDelete>) {
		return Promise.all([MessageHandler.DeleteRemoveResponses(message as Message)]);
	}

	@Event((listener) => listener.setName(FoxxieEvents.RawMessageDelete).setEvent(GatewayDispatchEvents.MessageDelete).setEmitter('ws'))
	public static DeleteRaw(...[data]: EventArgs<FoxxieEvents.RawMessageDelete>) {
		if (!data.guild_id) return;

		const guild = container.client.guilds.cache.get(data.guild_id);
		if (!guild) return;

		const channel = guild.channels.cache.get(data.channel_id) as GuildTextBasedChannel;
		if (!channel) return;

		const message = channel.messages.cache.get(data.id) as GuildMessage | undefined;

		// fire guild message delete events
		container.client.emit(FoxxieEvents.RawGuildMessageDelete, message, guild, channel);
	}

	@Event((listener) => listener.setName(FoxxieEvents.MessageUpdate).setEvent(FoxxieEvents.MessageUpdate))
	public static async Update(...[old, message]: EventArgs<FoxxieEvents.MessageUpdate>) {
		return Promise.all([MessageHandler.UpdateEditMessage(old, message)]);
	}

	private static Bot(...[message]: EventArgs<FoxxieEvents.MessageCreateBot>) {
		switch (message.author.id) {
			case BotIds.Disboard:
				return MessageHandler.BotDisboard(message);
			case BotIds.RealmBot:
				return MessageHandler.BotRealmBot(message);
		}

		return null;
	}

	@ProductionOnly()
	private static BotDisboard(...[message]: EventArgs<FoxxieEvents.MessageCreateBotDisboard>) {
		const [embed] = message.embeds;
		const description = embed.description?.toLowerCase();

		if (!description || !description.startsWith(`bump done!`)) return;
		return container.schedule.add(Schedules.Disboard, Date.now() + hours(2), {
			data: { guildId: message.guild.id }
		});
	}

	@ProductionOnly()
	private static async BotRealmBot(...[message]: EventArgs<FoxxieEvents.MessageCreateBotRealmBot>) {
		if (!message.embeds.length || message.channel.type !== ChannelType.GuildText || message.channel.id !== '1305722872458772591') return;
		await message.delete();

		const [
			{
				data: { author, description }
			}
		] = message.embeds;

		if (!author || description === `Chat relay has connected`) return;

		const channel = message.guild.channels.cache.get(MessageHandler.RealmBotChannelId);
		if (!channel || channel.type !== ChannelType.GuildText) return;

		const [name, ...rest] = author.name.split(' ');

		const content = rest.length ? italic(rest.join(' ')) : description || null;
		if (!content) return;

		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.find((w) => w.name === name) || (await channel.createWebhook({ name }));
		if (!webhook) return;

		await webhook.send({ content });
		container.logger.debug(`[MINECRAFT] - ${`Sent webhook for ${name}.`}`);
	}

	private static async CommandAccepted(payload: MessageCommandAcceptedPayload) {
		const { command, context, message, parameters } = payload;
		const args = await command.messagePreParse(message, parameters, context);

		const result = await Result.fromAsync(async () => {
			await MessageHandler.Typing(message, command, { ...payload, args });

			const stopwatch = new Stopwatch();
			const result = await command.messageRun(message, args, context);
			const { duration } = stopwatch.stop();

			message.client.emit(Events.MessageCommandSuccess, { ...payload, args, duration, result });

			return duration;
		});

		result.inspectErr((error) => message.client.emit(Events.MessageCommandError, error, { ...payload, args, duration: -1 }));

		message.client.emit(Events.MessageCommandFinish, message, command, {
			...payload,
			args,
			duration: result.unwrapOr(-1),
			success: result.isOk()
		});
	}

	private static async DeleteRemoveResponses(message: Message) {
		const response = get(message);
		if (response === null) return;

		if (await MessageHandler.DeleteRemoveResponsesShouldBeIgnored(message)) return;

		await deleteMessage(response);
	}

	private static DeleteRemoveResponsesCanBeCustomized(message: Message): message is GuildMessage {
		return message.guild !== null;
	}

	private static async DeleteRemoveResponsesShouldBeIgnored(message: Message): Promise<boolean> {
		if (!MessageHandler.DeleteRemoveResponsesCanBeCustomized(message)) return false;

		const settings = await readSettings(message.guild);

		if (settings.messagesAutoDeleteIgnoredAll) return true;

		if (settings.messagesAutoDeleteIgnoredChannels.includes(message.channelId)) return true;

		if (hasAtLeastOneKeyInMap(message.member.roles.cache, settings.messagesAutoDeleteIgnoredRoles)) return true;

		const command = getCommand(message);
		if (command !== null && CommandMatcher.matchAny(settings.messagesAutoDeleteIgnoredCommands, command)) return true;

		return false;
	}

	private static FormatPrefix(prefix: string, t: FTFunction, isAdmin = false): string {
		const lines = [
			t(LanguageKeys.System.PrefixReminder, {
				count: 1,
				prefixes: [prefix]
			})
		];

		if (isAdmin) {
			lines.push(
				t(LanguageKeys.System.PrefixReminder, {
					context: 'admin',
					prefix
				})
			);
		}

		return lines.join('\n');
	}

	private static async MentionPrefixOnly(...[message]: EventArgs<FoxxieEvents.MentionPrefixOnly>) {
		if (message.inGuild()) {
			const { language, prefix } = await readSettings(message.guild);
			const t = getT(language);

			const content = MessageHandler.FormatPrefix(prefix, t, isAdmin(message.member!));

			return sendMessage(message as GuildMessage, content);
		}

		const prefix =
			(await container.client.fetchPrefix(message)) ?? envParseString(EnvKeys.ClientPrefix) ?? `${userMention(container.client.id!)} `;
		const t = await fetchT(message);

		const content = MessageHandler.FormatPrefix(Array.isArray(prefix) ? prefix[0] : prefix, t);

		return send(message, content);
	}

	private static MessageDM(message: DMMessage) {
		return message;
	}

	private static async MessagePreParseCanRunInChannel(message: GuildMessage): Promise<boolean> {
		const me = await message.guild.members.fetchMe();
		if (isNullish(me)) return false;

		const { channel } = message;
		const permissionsFor = channel.permissionsFor(me);
		if (!permissionsFor) return false;

		return permissionsFor.has(MessageHandler.MessagePreParseRequiredPermissions, true);
	}

	private static PrefixedMessage(message: GuildMessage, prefix: RegExp | string) {
		const { client, stores } = container;

		const commandPrefix = MessageHandler.PrefixedMessageGetCommandPrefix(message.content, prefix);
		const prefixLess = message.content.slice(commandPrefix.length).trim();

		const spaceIndex = prefixLess.indexOf(' ');
		const commandName = spaceIndex === -1 ? prefixLess : prefixLess.slice(0, spaceIndex);
		if (commandName.length === 0) {
			client.emit(Events.UnknownMessageCommandName, { commandPrefix, message, prefix });
			return;
		}

		const command =
			stores.get('textcommands').get(client.options.caseInsensitiveCommands ? commandName.toLowerCase() : commandName) ||
			stores.get('commands').get(client.options.caseInsensitiveCommands ? commandName.toLowerCase() : commandName);
		if (!command) {
			client.emit(Events.UnknownMessageCommand, { commandName, commandPrefix, message, prefix });
			return;
		}

		if (!command.messageRun) {
			client.emit(Events.CommandDoesNotHaveMessageCommandHandler, { command: command as unknown as Command, commandPrefix, message, prefix });
			return;
		}

		const parameters = spaceIndex === -1 ? '' : prefixLess.substring(spaceIndex + 1).trim();
		return MessageHandler.PreMessageCommandRun({
			command: command as unknown as MessageCommand,
			context: { commandName, commandPrefix, prefix },
			message,
			parameters
		});
	}

	private static PrefixedMessageGetCommandPrefix(content: string, prefix: RegExp | string): string {
		return typeof prefix === 'string' ? prefix : prefix.exec(content)![0];
	}

	private static async PreMessageCommandRun(payload: PreMessageCommandRunPayload) {
		const { command, message } = payload;

		const globalResult = await container.stores.get('preconditions').messageRun(message, command, payload as any);
		if (globalResult.isErr()) {
			message.client.emit(Events.MessageCommandDenied, globalResult.unwrapErr(), payload);
			return;
		}

		const localResult = await command.preconditions.messageRun(message, command, payload as any);
		if (localResult.isErr()) {
			message.client.emit(Events.MessageCommandDenied, localResult.unwrapErr(), payload);
			return;
		}

		return MessageHandler.CommandAccepted(payload);
	}

	private static async PreParse(...[message]: EventArgs<'preMessageParsed'>) {
		const canRun = await MessageHandler.MessagePreParseCanRunInChannel(message as GuildMessage);
		if (!canRun) return;

		let prefix: null | RegExp | string = null;
		const mentionPrefix = MessageHandler.PreParseGetMentionPrefix(message);
		const { client } = container;
		const { regexPrefix } = client.options;

		if (mentionPrefix) {
			if (message.content.length === mentionPrefix.length) {
				return MessageHandler.MentionPrefixOnly(message);
			}

			prefix = mentionPrefix;
		} else if (regexPrefix?.test(message.content)) {
			prefix = regexPrefix;
		} else {
			const prefixes = await client.fetchPrefix(message);
			const parsed = MessageHandler.PreParseGetPrefix(message.content, prefixes);
			if (parsed !== null) prefix = parsed;
		}

		if (isNullish(prefix)) client.emit(Events.NonPrefixedMessage, message);
		else return MessageHandler.PrefixedMessage(message as GuildMessage, prefix);
	}

	private static PreParseGetMentionPrefix(message: Message): null | string {
		if (container.client.disableMentionPrefix) return null;

		if (message.content.length < 20 || !message.content.startsWith('<@')) return null;

		const [offset, id] =
			message.content[2] === '&'
				? [3, message.guild?.roles.botRoleFor(container.client.id!)?.id]
				: [message.content[2] === '!' ? 3 : 2, container.client.id];
		if (isNullish(id)) return null;

		const offsetWithId = offset + id.length;

		if (message.content[offsetWithId] !== '>') return null;

		const mentionId = message.content.substring(offset, offsetWithId);
		if (mentionId === id) return message.content.substring(0, offsetWithId + 1);

		return null;
	}

	private static PreParseGetPrefix(content: string, prefixes: null | readonly string[] | string): null | string {
		if (isNullish(prefixes)) return null;
		const { caseInsensitivePrefixes } = container.client.options;

		if (caseInsensitivePrefixes) content = content.toLowerCase();

		if (typeof prefixes === 'string') {
			return content.startsWith(caseInsensitivePrefixes ? prefixes.toLowerCase() : prefixes) ? prefixes : null;
		}

		return prefixes.find((prefix) => content.startsWith(caseInsensitivePrefixes ? prefix.toLowerCase() : prefix)) ?? null;
	}

	@ProductionOnly()
	private static Stats(...[guildId, member]: EventArgs<FoxxieEvents.MessageCreateStats>) {
		// if the member hasn't been in the server for five mintutes disregard the messages.
		if (Date.now() - member.joinedTimestamp! < minutes(5)) return;

		return Promise.all([MessageHandler.StatsGuild(guildId), MessageHandler.StatsMember(member, guildId)]);
	}

	private static StatsGuild(guildId: string) {
		return writeSettings(guildId, (settings) => ({ messageCount: settings.messageCount + 1 }));
	}

	private static async StatsMember(member: GuildMember, guildId: string) {
		const memberSettings = await acquireMember(member.id, guildId);

		if (isNullish(memberSettings)) {
			return createMember(member.id, guildId, { messageCount: 1 });
		}

		return updateMember(member.id, guildId, { messageCount: memberSettings.messageCount + 1 });
	}

	private static System(...[message]: EventArgs<FoxxieEvents.SystemMessage>) {
		return message;
	}

	@TypingEnabled()
	private static async Typing(message: Message, command: MessageCommand, payload: MessageCommandRunPayload) {
		if (!command.typing || isStageChannel(message.channel)) {
			return;
		}

		if (message.channel.type === ChannelType.GroupDM) {
			return;
		}

		try {
			await message.channel.sendTyping();
		} catch (error) {
			message.client.emit(Events.MessageCommandTypingError, error as Error, { ...payload, command, message });
		}
	}

	private static async UpdateEditMessage(...[old, message]: EventArgs<FoxxieEvents.MessageUpdate>) {
		// If the contents of both messages are the same, return:
		if (old.content === message.content) return;

		// If the message was sent by a webhook, return:
		if (message.webhookId !== null) return;

		// If the message was sent by the Discord system, return:
		if (message.system) return;

		// If the message was sent by a bot, return:
		if (message.author?.bot) return;

		if (!message.guild) return;

		// Run the message parser.
		return MessageHandler.PreParse(message as GuildMessage);
	}

	private static User(...[message]: EventArgs<FoxxieEvents.UserMessage>) {
		return MessageHandler.PreParse(message);
	}

	private static MessagePreParseRequiredPermissions = new PermissionsBitField([
		PermissionFlagsBits.ViewChannel,
		PermissionFlagsBits.SendMessages
	]).freeze();

	private static RealmBotChannelId = '1305722872458772591';
}
