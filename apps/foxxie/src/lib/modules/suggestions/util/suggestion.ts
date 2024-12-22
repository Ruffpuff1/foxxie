import { ChannelType, RESTPostAPIChannelMessageJSONBody } from '@discordjs/core/http-only';
import { AsyncQueue } from '@sapphire/async-queue';
import { container, Result } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { ReadonlyGuildData, readSettings } from '#lib/database';
import { api } from '#lib/discord';
import { getT, LanguageKeys } from '#lib/i18n';
import { FTFunction, GuildMessage, TypedT } from '#lib/types';
import { ensure } from '#utils/common';
import { Colors } from '#utils/constants';
import { sendLoadingMessage, sendMessage } from '#utils/functions';
import { messageLink } from '#utils/transformers';
import {
	APIMessage,
	APIThreadChannel,
	ButtonStyle,
	channelMention,
	Collection,
	ComponentType,
	EmbedBuilder,
	hyperlink,
	inlineCode,
	Snowflake,
	time
} from 'discord.js';
import slug from 'limax';

import { MessageData } from '../types.js';
import { Id, makeCustomId, makeIntegerString, Status } from './id-creator.js';

const suggestionQueue = new Collection<string, AsyncQueue>();
export function addCount(guildId: Snowflake) {
	const entry = countCache.get(guildId);
	if (!isNullish(entry)) countCache.set(guildId, entry + 1);
}

export async function createSuggestion(message: GuildMessage, user: MessageData['user'], rawInput: string) {
	const guildId = message.guild.id;
	const settings = await readSettings(guildId);
	const t = getT(settings.language);

	if (isNullish(settings.suggestionsChannel)) {
		const content = t(LanguageKeys.Commands.Utility.Suggestion.NewNotConfigured);
		return sendMessage(message, content);
	}

	await sendLoadingMessage(message);

	const queue = suggestionQueue.ensure(guildId, () => new AsyncQueue());
	await queue.wait();

	let id: number;
	let suggestionMessage: APIMessage;
	try {
		// handle possible cooldown;

		const count = await useCount(guildId);
		id = count + 1;

		const input = settings.suggestionsEmbed
			? await useEmbedContent(rawInput, guildId, settings.suggestionsChannel, count)
			: usePlainContent(rawInput);
		const body = makeMessage(settings, { id, message: input, timestamp: time(), user });

		const postResult = await Result.fromAsync(api().channels.createMessage(settings.suggestionsChannel, body));
		if (postResult.isErr()) {
			return sendMessage(
				message,
				t(LanguageKeys.Commands.Utility.Suggestion.NewFailedToSend, {
					channel: channelMention(settings.suggestionsChannel)
				})
			);
		}

		suggestionMessage = postResult.unwrap();
		await container.prisma.suggestion.create({
			data: { authorId: user.id, guildId, id, messageId: suggestionMessage.id },
			select: null
		});

		addCount(guildId);
	} finally {
		queue.shift();
	}

	const errors: string[] = [];

	if (settings.suggestionsAutoThread) {
		const result = await useThread(message, id, { input: rawInput, suggestionMessage });
		result.inspect((value) => value.memberAddResult.inspectErr((error) => errors.push(t(error)))).inspectErr((error) => errors.push(t(error)));
	}

	const header = t(LanguageKeys.Commands.Utility.Suggestion.NewSuccess, {
		id: hyperlink(id.toLocaleString(), messageLink(message.guild.id, settings.suggestionsChannel, suggestionMessage.id))
	});
	const details = errors.length === 0 ? '' : `\n\n- ${errors.join('\n- ')}`;

	const content = header + details;
	return sendMessage(message, content);
}

const contentSeparator = '\u200B\n\n';

export function getOriginalContent(message: APIMessage) {
	if (message.embeds.length) {
		return ensure(message.embeds[0].description);
	}

	const newLine = message.content.indexOf('\n');
	if (newLine === -1) throw new Error('Expected message to have a newline.');

	const index = message.content.indexOf(contentSeparator, newLine);
	return index === -1 ? message.content : message.content.slice(newLine, index);
}

export async function useThread(
	message: GuildMessage,
	id: number | string,
	options: useThread.Options = {}
): Promise<Result<{ memberAddResult: Result<void, TypedT>; thread: APIThreadChannel }, TypedT>> {
	const resolvedMessage = options.suggestionMessage!;
	const input = options.input ?? getOriginalContent(resolvedMessage);

	const name = `${id}-${slug(removeMaskedHyperlinks(input))}`.slice(0, 100);
	const threadCreationResult = await Result.fromAsync(
		api().channels.createThread(options.suggestionMessage!.channel_id, { name, type: ChannelType.PublicThread }, options.suggestionMessage!.id)
	);

	if (threadCreationResult.isErr()) return Result.err(LanguageKeys.Commands.Utility.Suggestion.ThreadChannelCreationFailure);

	const thread = threadCreationResult.unwrap() as APIThreadChannel;
	const result = await Result.fromAsync(api().threads.addMember(thread.id, message.author.id));
	const memberAddResult = result.mapErr(() => LanguageKeys.Commands.Utility.Suggestion.ThreadMemberAddFailure);

	return Result.ok({ memberAddResult, thread });
}

export namespace useThread {
	export interface Options {
		input?: string;
		suggestionMessage?: APIMessage;
	}
}

const maskedLinkRegExp = /\[([^\]]+)\]\(https?\:[^\)]+\)/g;
function removeMaskedHyperlinks(input: string) {
	return input.replaceAll(maskedLinkRegExp, '$1');
}

const referenceRegExp = /#(\d+)/g;

export async function useEmbedContent(content: string, guildId: Snowflake, channelId: Snowflake, lastId?: number) {
	if (content.length < 2) return content;

	lastId ??= await useCount(guildId);

	const references = new Set<number>();
	const parts: (number | string)[] = [];

	let buffer = '';
	let result: null | RegExpExecArray;
	let lastIndex = 0;

	while ((result = referenceRegExp.exec(content)) !== null) {
		const id = Number(result[1]);
		if (id > lastId) continue;

		if (result.index !== lastIndex) {
			buffer += content.slice(lastIndex, result.index);
			if (buffer.length) parts.push(buffer);

			buffer = '';
		}

		lastIndex = result.index + result[0].length;

		references.add(id);
		parts.push(id);
	}

	if (references.size === 0) return content;

	if (lastIndex !== content.length) {
		buffer += content.slice(lastIndex);
		parts.push(buffer);
	}

	const entries = await container.prisma.suggestion.findMany({
		select: { id: true, messageId: true },
		where: { guildId, id: { in: [...references] } }
	});

	const urls = new Map(entries.map((entry) => [entry.id, hyperlink(inlineCode(`#${entry.id}`), messageLink(guildId, channelId, entry.messageId))]));

	return parts.map((part) => (typeof part === 'string' ? part : urls.get(part)!)).join('');
}

export function usePlainContent(content: string) {
	// Sanitize ZWS, as they are used as content separators.
	return content.replaceAll('\u200B', '');
}

function makeComponents(settings: ReadonlyGuildData, data: MessageData) {
	type MessageComponent = NonNullable<APIMessage['components']>[number];

	const components: MessageComponent[] = [];
	if (!settings.suggestionsButtons) return components;

	const id = makeIntegerString(data.id);
	const t = getT(settings.language);
	const manageRow: MessageComponent = {
		components: [
			{
				custom_id: makeCustomId(Id.Suggestions, 'archive', id),
				label: t(LanguageKeys.Commands.Utility.Suggestion.ComponentsArchive),
				style: ButtonStyle.Danger,
				type: ComponentType.Button
			}
		],
		type: ComponentType.ActionRow
	};
	if (!settings.suggestionsAutoThread) {
		manageRow.components.unshift({
			custom_id: makeCustomId(Id.Suggestions, 'thread', id),
			label: t(LanguageKeys.Commands.Utility.Suggestion.ComponentsCreateThread),
			style: ButtonStyle.Primary,
			type: ComponentType.Button
		});
	}

	components.push(manageRow);

	components.push({
		components: [
			{
				custom_id: makeCustomId(Id.Suggestions, 'resolve', id),
				options: [
					{ label: t(LanguageKeys.Commands.Utility.Suggestion.ComponentsAccept), value: Status.Accept },
					{ label: t(LanguageKeys.Commands.Utility.Suggestion.ComponentsConsider), value: Status.Consider },
					{ label: t(LanguageKeys.Commands.Utility.Suggestion.ComponentsDeny), value: Status.Deny }
				],
				type: ComponentType.StringSelect
			}
		],
		type: ComponentType.ActionRow
	});

	return components;
}

function makeContentMessage(data: MessageData, t: FTFunction) {
	const content = t(LanguageKeys.Commands.Utility.Suggestion.NewMessageContent, data);
	return { content };
}

function makeEmbedMessage(data: MessageData, t: FTFunction): RESTPostAPIChannelMessageJSONBody {
	const name = t(LanguageKeys.Commands.Utility.Suggestion.NewMessageEmbedTitle, data);
	const embed = new EmbedBuilder().setColor(Colors.White).setAuthor({ iconURL: data.user.avatar, name }).setDescription(data.message);

	return { embeds: [embed.toJSON()] };
}

function makeMessage(settings: ReadonlyGuildData, data: MessageData): RESTPostAPIChannelMessageJSONBody {
	const t = getT(settings.language);
	const resolved = settings.suggestionsEmbed ? makeEmbedMessage(data, t) : makeContentMessage(data, t);
	return { ...resolved, allowed_mentions: { roles: [], users: [] }, components: makeComponents(settings, data) };
}

const countCache = new Collection<string, number>();
const promiseCountCache = new Collection<string, Promise<number>>();
export async function useCount(guildId: string): Promise<number> {
	const cachedCount = countCache.get(guildId);
	if (!isNullish(cachedCount)) return cachedCount;

	const promiseEntry = promiseCountCache.get(guildId);
	if (!isNullish(promiseEntry)) return promiseEntry;

	try {
		const promise = container.prisma.suggestion.count({ where: { guildId } }).then((count) => (countCache.set(guildId, count), count));
		promiseCountCache.set(guildId, promise);

		return await promise;
	} finally {
		promiseCountCache.delete(guildId);
	}
}
