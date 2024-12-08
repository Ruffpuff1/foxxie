import { getSupportedUserLanguageT, LanguageKeys, translate } from '#lib/i18n';
import { FoxxieArgs, FoxxieCommand } from '#lib/structures';
import { EnvKeys, FoxxieEvents } from '#lib/types';
import { clientOwners } from '#root/config';
import { getCodeStyle, getLogPrefix, sendTemporaryMessage } from '#utils/functions';
import { ArgumentError, Command, container, MessageCommand, MessageCommandErrorPayload, ResultError, UserError } from '@sapphire/framework';
import { fetchT, type TFunction } from '@sapphire/plugin-i18next';
import { ChatInputSubcommandErrorPayload, MessageSubcommandErrorPayload, Subcommand } from '@sapphire/plugin-subcommands';
import { cast, cutText } from '@sapphire/utilities';
import { captureException } from '@sentry/node';
import { envParseBoolean, envParseString } from '@skyra/env-utilities';
import { codeBlock, DiscordAPIError, HTTPError, Message, RESTJSONErrorCodes, Routes, Snowflake } from 'discord.js';
import { exists } from 'i18next';

const Root = LanguageKeys.Listeners.Errors;

export function stringifyError(t: TFunction, error: unknown): string {
	switch (typeof error) {
		case 'string':
			return stringifyErrorString(t, error);
		case 'number':
		case 'bigint':
		case 'boolean':
		case 'undefined':
		case 'symbol':
		case 'function':
			return String(error);
		case 'object':
			return stringifyErrorObject(t, error);
	}
}

function stringifyErrorString(t: TFunction, error: string): string {
	return exists(error) ? (t(error) as string) : error;
}

function stringifyErrorObject(t: TFunction, error: object | null): string {
	return error instanceof Error ? stringifyErrorException(t, error) : String(error);
}

const isSuppressedError =
	typeof SuppressedError === 'undefined'
		? (error: Error): error is SuppressedError => 'error' in error && 'suppressed' in error
		: (error: Error): error is SuppressedError => error instanceof SuppressedError;

function stringifyErrorException(t: TFunction, error: Error): string {
	if (error.name === 'AbortError') return t(LanguageKeys.Listeners.Errors.Abort);
	if (error instanceof UserError) return t(error.identifier, error.context as any) as string;
	if (error instanceof ResultError) return stringifyError(t, error.value);
	if (error instanceof DiscordAPIError) return stringifyDiscordAPIError(t, error);
	if (error instanceof HTTPError) return stringifyHTTPError(t, error);
	if (error instanceof AggregateError) return error.errors.map((value) => stringifyError(t, value)).join('\n');
	if (isSuppressedError(error)) return stringifyError(t, error.suppressed);
	return error.message;
}

function stringifyDiscordAPIError(t: TFunction, error: DiscordAPIError) {
	const key = getDiscordError(Number(error.code));
	return t(key!);
}

function stringifyHTTPError(t: TFunction, error: HTTPError) {
	const key = getHttpError(error.status);
	return t(key!);
}

const ignoredDiscordCodes = [RESTJSONErrorCodes.UnknownChannel, RESTJSONErrorCodes.UnknownMessage];

export async function handleMessageCommandError(error: unknown, payload: MessageCommandErrorPayload | MessageSubcommandErrorPayload) {
	const { message, command } = payload;
	let t: TFunction;
	let parameters: string;
	if ('args' in payload) {
		t = cast<FoxxieArgs>(payload.args).t;
		parameters = payload.parameters;
	} else {
		t = await fetchT(message);
		parameters = message.content.slice(payload.context.commandPrefix.length + payload.context.commandName.length).trim();
	}

	console.log(parameters);

	if (!(error instanceof Error)) return messageStringError(message, String(error));
	if (error instanceof ArgumentError) return messageArgumentError(message, t, error);
	if (error instanceof UserError) return messageUserError(message, t, error);

	const { client, logger } = container;

	if (error.name === 'AbortError' || error.message === 'Internal Server Error') {
		logger.warn(`${messageGetWarnError(message)} (${message.author.id}) | ${error.constructor.name}`);
		return sendTemporaryMessage(message, t(LanguageKeys.Listeners.Errors.Abort));
	}

	if (error instanceof DiscordAPIError) {
		if (messageIsSilencedError(message, error)) return;
		client.emit(FoxxieEvents.Error, error);
	} else {
		logger.warn(`${messageGetWarnError(message)} (${message.author.id}) | ${error.constructor.name}`);
	}

	// await this.messageSendErrorChannel(message, command, parameters, error);

	logger.fatal(`[COMMAND] ${command.location.full}\n${error.stack || error.message}`);
	try {
		await sendTemporaryMessage(message, generateUnexpectedErrorMessage(message.author.id, command, t, error));
	} catch (err) {
		client.emit(FoxxieEvents.Error, cast<Error>(err));
	}

	return undefined;
}

function messageIsSilencedError(message: Message, error: DiscordAPIError) {
	return ignoredDiscordCodes.includes(error.code as number) || messageIsDirectMessageReplyAfterBlock(message, error);
}

function messageIsDirectMessageReplyAfterBlock(message: Message, error: DiscordAPIError) {
	// When sending a message to a user who has blocked the bot, Discord replies with 50007 "Cannot send messages to this user":
	if (error.code !== RESTJSONErrorCodes.CannotSendMessagesToThisUser) return false;

	// If it's not a Direct Message, return false:
	if (message.guild !== null) return false;

	// If the query was made to the message's channel, then it was a DM response:
	return error.url === Routes.channelMessages(message.channel.id);
}

function messageStringError(message: Message, error: string) {
	return messageAlert(message, error);
}

function messageArgumentError(message: Message, t: TFunction, error: ArgumentError<unknown>) {
	const argument = error.argument.name;
	const identifier = translate(error.identifier);
	const parameter = error.parameter.replaceAll('`', '῾');
	const prefix = Reflect.get(Object(error.context), 'prefix') || envParseString(EnvKeys.ClientPrefix);
	const command = Reflect.get(Object(error.context), 'command') as FoxxieCommand | undefined;
	const commandName = command ? command.name : null;

	return messageAlert(
		message,
		t(identifier, {
			...error,
			...(error.context as object),
			argument,
			parameter: cutText(parameter, 50),
			prefix,
			context: commandName
		})
	);
}

function messageUserError(message: Message, t: TFunction, error: UserError) {
	// `context: { silent: true }` should make UserError silent:
	// Use cases for this are for example permissions error when running the `eval` command.
	if (Reflect.get(Object(error.context), 'silent')) return;

	const prefix = Reflect.get(Object(error.context), 'prefix') || envParseString(EnvKeys.ClientPrefix);
	const command = Reflect.get(Object(error.context), 'command') as FoxxieCommand | undefined;
	const commandName = command ? command.name : null;
	const identifier = translate(error.identifier);
	const content = t(identifier, { ...Object(error.context), prefix, context: commandName }) as string;
	return messageAlert(message, content);
}

function generateUnexpectedErrorMessage(userId: Snowflake, command: MessageCommand | Subcommand, t: TFunction, error: unknown) {
	if (clientOwners.includes(userId)) return codeBlock('js', String(error));
	if (!envParseBoolean(EnvKeys.SentryEnabled)) return t(LanguageKeys.Listeners.Errors.Unexpected);

	try {
		const report = captureException(error, { tags: { command: command.name } });
		return t(LanguageKeys.Listeners.Errors.UnexpectedWithCode, { report });
	} catch (error) {
		return t(LanguageKeys.Listeners.Errors.Unexpected);
	}
}

function messageAlert(message: Message, content: string) {
	return sendTemporaryMessage(message, { content, allowedMentions: { users: [message.author.id], roles: [] } });
}

function messageGetWarnError(message: Message) {
	return `ERROR: /${message.guild ? `${message.guild.id}/${message.channel.id}` : `DM/${message.author.id}`}/${message.id}`;
}

export async function handleChatInputCommandError(error: unknown, payload: ChatInputSubcommandErrorPayload) {
	const { interaction } = payload;
	const t = getSupportedUserLanguageT(interaction);
	const resolved = flattenError(payload.command, error);
	const content = resolved ? resolveError(t, resolved) : generateUnexpectedErrorMessage(interaction.user.id, payload.command, t, error);

	try {
		if (interaction.replied) await interaction.followUp({ content, ephemeral: true });
		else if (interaction.deferred) await interaction.editReply({ content });
		else await interaction.reply({ content, ephemeral: true });
	} catch (e) {
		console.log(e);
	}
}

export function resolveError(t: TFunction, error: UserError | string) {
	return typeof error === 'string' ? resolveStringError(t, error) : resolveUserError(t, error);
}

function flattenError(command: Command, error: unknown): UserError | string | null {
	if (typeof error === 'string') return error;

	if (!(error instanceof Error)) {
		container.logger.fatal(getLogPrefix(command), 'Unknown unhandled error:', error);
		return null;
	}

	if (error instanceof ResultError) return flattenError(command, error.value);
	if (error instanceof UserError) return error;

	if (error instanceof DiscordAPIError) {
		container.logger.error(getLogPrefix(command), getCodeStyle(error.code.toString()), 'Unhandled error:', error);
		return getDiscordError(error.code as number);
	}

	if (error instanceof HTTPError) {
		container.logger.error(getLogPrefix(command), getCodeStyle(error.status.toString()), 'Unhandled error:', error);
		return getHttpError(error.status);
	}

	if (error.name === 'AbortError') {
		return LanguageKeys.Listeners.Errors.Abort;
	}

	container.logger.fatal(getLogPrefix(command), error);
	return null;
}

function resolveStringError(t: TFunction, error: string) {
	return exists(error) ? t(error) : error;
}

function resolveUserError(t: TFunction, error: UserError) {
	const identifier = translate(error.identifier);
	return t(
		identifier,
		error instanceof ArgumentError
			? { ...error, ...(error.context as object), argument: error.argument.name, parameter: cutText(error.parameter.replaceAll('`', '῾'), 50) }
			: (error.context as any)
	) as string;
}

function getDiscordError(code: RESTJSONErrorCodes) {
	switch (code) {
		case RESTJSONErrorCodes.UnknownChannel:
			return Root.GenericUnknownChannel;
		case RESTJSONErrorCodes.UnknownGuild:
			return Root.GenericUnknownGuild;
		case RESTJSONErrorCodes.UnknownMember:
			return Root.GenericUnknownMember;
		case RESTJSONErrorCodes.UnknownMessage:
			return Root.GenericUnknownMessage;
		case RESTJSONErrorCodes.UnknownRole:
			return Root.GenericUnknownRole;
		case RESTJSONErrorCodes.MissingAccess:
			return Root.GenericMissingAccess;
		default:
			return null;
	}
}

function getHttpError(status: number) {
	switch (status) {
		case 500:
			return Root.GenericDiscordInternalServerError;
		case 502:
		case 504:
			return Root.GenericDiscordGateway;
		case 503:
			return Root.GenericDiscordUnavailable;
		default:
			return null;
	}
}
