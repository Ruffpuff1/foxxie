import { LanguageKeys, translate } from '#lib/i18n';
import { FoxxieCommand } from '#lib/structures';
import { FoxxieArgs } from '#lib/Structures/commands/FoxxieArgs';
import { EnvKeys, FoxxieEvents } from '#lib/types';
import { clientOwners } from '#root/config';
import { sendTemporaryMessage } from '#utils/functions/messages';
import { EnvParse } from '@foxxie/env';
import { ArgumentError, container, MessageCommand, MessageCommandErrorPayload, UserError } from '@sapphire/framework';
import { fetchT, TFunction } from '@sapphire/plugin-i18next';
import { MessageSubcommandErrorPayload, Subcommand } from '@sapphire/plugin-subcommands';
import { cast, cutText } from '@sapphire/utilities';
import { captureException } from '@sentry/node';
import { codeBlock, DiscordAPIError, Message, RESTJSONErrorCodes, Routes, Snowflake } from 'discord.js';

export class ErrorService {
	private ignoredCodes = [RESTJSONErrorCodes.UnknownChannel, RESTJSONErrorCodes.UnknownMessage];

	public async handleMessageCommandError(error: unknown, payload: MessageCommandErrorPayload | MessageSubcommandErrorPayload) {
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

		if (!(error instanceof Error)) return this.messageStringError(message, t, String(error));
		if (error instanceof ArgumentError) return this.messageArgumentError(message, t, error);
		if (error instanceof UserError) return this.messageUserError(message, t, error);

		const { client, logger } = container;

		if (error.name === 'AbortError' || error.message === 'Internal Server Error') {
			logger.warn(`${this.messageGetWarnError(message)} (${message.author.id}) | ${error.constructor.name}`);
			return sendTemporaryMessage(message, t(LanguageKeys.Listeners.Errors.Abort));
		}

		if (error instanceof DiscordAPIError) {
			if (this.messageIsSilencedError(message, error)) return;
			client.emit(FoxxieEvents.Error, error);
		} else {
			logger.warn(`${this.messageGetWarnError(message)} (${message.author.id}) | ${error.constructor.name}`);
		}

		// await this.messageSendErrorChannel(message, command, parameters, error);

		logger.fatal(`[COMMAND] ${command.location.full}\n${error.stack || error.message}`);
		try {
			await sendTemporaryMessage(message, this.generateUnexpectedErrorMessage(message.author.id, command, t, error));
		} catch (err) {
			client.emit(FoxxieEvents.Error, cast<Error>(err));
		}

		return undefined;
	}

	private messageIsSilencedError(message: Message, error: DiscordAPIError) {
		return this.ignoredCodes.includes(error.code as number) || this.isDirectMessageReplyAfterBlock(message, error);
	}

	private isDirectMessageReplyAfterBlock(message: Message, error: DiscordAPIError) {
		// When sending a message to a user who has blocked the bot, Discord replies with 50007 "Cannot send messages to this user":
		if (error.code !== RESTJSONErrorCodes.CannotSendMessagesToThisUser) return false;

		// If it's not a Direct Message, return false:
		if (message.guild !== null) return false;

		// If the query was made to the message's channel, then it was a DM response:
		return error.url === Routes.channelMessages(message.channel.id);
	}

	private messageStringError(message: Message, t: TFunction, error: string) {
		return this.messageAlert(message, t(LanguageKeys.Listeners.Errors.String, { mention: message.author.toString(), message: error }));
	}

	private messageArgumentError(message: Message, t: TFunction, error: ArgumentError<unknown>) {
		const argument = error.argument.name;
		const identifier = translate(error.identifier);
		const parameter = error.parameter.replaceAll('`', '῾');
		const prefix = Reflect.get(Object(error.context), 'prefix') || EnvParse.string(EnvKeys.ClientPrefix);
		const command = Reflect.get(Object(error.context), 'command') as FoxxieCommand | undefined;
		const commandName = command ? command.name : null;

		return this.messageAlert(
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

	private messageUserError(message: Message, t: TFunction, error: UserError) {
		// `context: { silent: true }` should make UserError silent:
		// Use cases for this are for example permissions error when running the `eval` command.
		if (Reflect.get(Object(error.context), 'silent')) return;

		const prefix = Reflect.get(Object(error.context), 'prefix') || EnvParse.string(EnvKeys.ClientPrefix);
		const command = Reflect.get(Object(error.context), 'command') as FoxxieCommand | undefined;
		const commandName = command ? command.name : null;
		const identifier = translate(error.identifier);
		const content = t(identifier, { ...Object(error.context), prefix, context: commandName }) as string;
		return this.messageAlert(message, content);
	}

	private generateUnexpectedErrorMessage(userId: Snowflake, command: MessageCommand | Subcommand, t: TFunction, error: unknown) {
		if (clientOwners.includes(userId)) return codeBlock('js', String(error));
		if (!EnvParse.boolean(EnvKeys.SentryEnabled)) return t(LanguageKeys.Listeners.Errors.Unexpected);

		try {
			const report = captureException(error, { tags: { command: command.name } });
			return t(LanguageKeys.Listeners.Errors.UnexpectedWithCode, { report });
		} catch (error) {
			return t(LanguageKeys.Listeners.Errors.Unexpected);
		}
	}

	private messageAlert(message: Message, content: string) {
		return sendTemporaryMessage(message, { content, allowedMentions: { users: [message.author.id], roles: [] } });
	}

	private messageGetWarnError(message: Message) {
		return `ERROR: /${message.guild ? `${message.guild.id}/${message.channel.id}` : `DM/${message.author.id}`}/${message.id}`;
	}
}
