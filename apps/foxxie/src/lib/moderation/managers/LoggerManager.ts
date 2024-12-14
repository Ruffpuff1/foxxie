import { container } from '@sapphire/framework';
import { type Awaitable, isFunction, isNullish, isNullishOrEmpty, type Nullish } from '@sapphire/utilities';
import { type GuildSettingsOfType, writeSettings } from '#lib/database';
import {
	DeleteLoggerTypeManager,
	MuteLoggerTypeManager,
	PruneLoggerTypeManager,
	TimeoutLoggerTypeManager,
	UnmuteLoggerTypeManager
} from '#lib/moderation';
import { toErrorCodeResult } from '#utils/common';
import { getCodeStyle, getLogPrefix } from '#utils/functions/pieces';
import {
	EmbedBuilder,
	type Guild,
	type GuildBasedChannel,
	type GuildTextBasedChannel,
	type MessageCreateOptions,
	PermissionFlagsBits,
	RESTJSONErrorCodes,
	type Snowflake
} from 'discord.js';

export type LoggerManagerSendMessageOptions = EmbedBuilder | EmbedBuilder[] | MessageCreateOptions | null;

export interface LoggerManagerSendOptions {
	/**
	 * The channel ID to send the message to, if any.
	 */
	channelId: Nullish | string;
	/**
	 * The condition to check before sending the message, if any.
	 */
	condition?: (() => boolean) | boolean;
	/**
	 * The settings key to reset if the channel is not found.
	 */
	key: GuildSettingsOfType<Nullish | string>;
	/**
	 * Makes the options for the message to send.
	 * @returns The message options to send.
	 */
	makeMessage: (channel: GuildTextBasedChannel) => Awaitable<LoggerManagerSendMessageOptions>;
	/**
	 * The function to call when the log operation was aborted before calling
	 * {@linkcode makeMessage}.
	 */
	onAbort?: () => void;
}

export class LoggerManager {
	public readonly delete = new DeleteLoggerTypeManager(this);
	public readonly guild: Guild;
	public readonly mute = new MuteLoggerTypeManager(this);
	public readonly prune = new PruneLoggerTypeManager(this);
	public readonly timeout = new TimeoutLoggerTypeManager(this);
	public readonly unmute = new UnmuteLoggerTypeManager(this);

	public constructor(guild: Guild) {
		this.guild = guild;
	}

	/**
	 * Send a message to the specified channel.
	 * @param options The options to send the message.
	 * @returns Whether the message was sent.
	 */
	public async send(options: LoggerManagerSendOptions): Promise<boolean> {
		if (isNullish(options.channelId) || !this.#resolveSendCondition(options.condition)) {
			options.onAbort?.();
			return false;
		}

		const result = await toErrorCodeResult(this.guild.channels.fetch(options.channelId));
		return result.match({
			err: (code) => this.#sendChannelErr(options, code),
			ok: (channel) => this.#sendChannelOk(options, channel)
		});
	}

	#logError(code: RESTJSONErrorCodes, channelId: Snowflake, content: string) {
		container.logger.error(`${LogPrefix} ${getCodeStyle(code)} ${content} ${channelId}`);
	}

	#resolveMessageOptions(options: NonNullable<LoggerManagerSendMessageOptions>) {
		if (Array.isArray(options)) return { embeds: options };
		if (options instanceof EmbedBuilder) return { embeds: [options] };
		return options;
	}

	#resolveSendCondition(condition: (() => boolean) | boolean | Nullish) {
		if (isNullish(condition)) return true;
		if (isFunction(condition)) return condition();
		return condition;
	}

	async #sendChannelErr(options: LoggerManagerSendOptions, code: RESTJSONErrorCodes) {
		options.onAbort?.();

		// If the channel was not found, clear the settings:
		if (code === RESTJSONErrorCodes.UnknownChannel) {
			await writeSettings(this.guild, { [options.key]: null });
		} else {
			this.#logError(code, options.channelId!, 'Failed to fetch channel');
		}

		return false;
	}

	async #sendChannelOk(options: LoggerManagerSendOptions, channel: GuildBasedChannel | null) {
		// Unsupported channel type, should never happen:
		if (isNullish(channel) || !channel.isTextBased()) {
			options.onAbort?.();
			return false;
		}

		const rawOptions = await options.makeMessage(channel);
		if (rawOptions === null) return false;

		const messageOptions = this.#resolveMessageOptions(rawOptions);

		let requiredPermissions = PermissionFlagsBits.SendMessages | PermissionFlagsBits.ViewChannel;
		if (!isNullishOrEmpty(messageOptions.embeds)) requiredPermissions |= PermissionFlagsBits.EmbedLinks;
		if (!isNullishOrEmpty(messageOptions.files)) requiredPermissions |= PermissionFlagsBits.AttachFiles;

		const hasPermissions = channel.permissionsFor(await this.guild.members.fetchMe()).has(requiredPermissions);
		if (!hasPermissions) return false;

		const result = await toErrorCodeResult(channel.send(messageOptions));
		return result //
			.inspectErr((code) => this.#logError(code, options.channelId!, 'Failed to send message in'))
			.isOk();
	}

	/**
	 * Whether or not the bot can view audit logs.
	 */
	public get canViewAuditLogs() {
		return this.guild.members.me!.permissions.has(PermissionFlagsBits.ViewAuditLog);
	}
}

const LogPrefix = getLogPrefix('LoggerManager');
