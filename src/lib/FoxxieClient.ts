import { InviteManager, RedisManager } from '#lib/structures';
import { clientOptions, webhookError } from '#root/config';
import { GuildMemberFetchQueue } from '#utils/External/GuildMemberFetchQueue';
import { LongLivingReactionCollector } from '#utils/External/LongLivingReactionCollector';
import { Enumerable } from '@sapphire/decorators';
import { container, SapphireClient } from '@sapphire/framework';
import { Message, WebhookClient } from 'discord.js';
import { WorkerService } from './Container/Workers/WorkerService.js';
import { ScheduleManager, TaskStore } from '#lib/schedule';
import { ApiService } from './Container/Api/ApiService.js';
import { SettingsService } from './Container/Services/SettingsService.js';
import { readSettings, SerializerStore } from '#lib/database';
import { envParseBoolean, envParseInteger } from '@skyra/env-utilities';
import { UtilityService } from './Container/Utility/UtilityService.js';
import { magentaBright } from 'colorette';
import { isGuildMessage } from '#utils/common';
import { InternationalizationContext } from '@sapphire/plugin-i18next';

export default class FoxxieClient extends SapphireClient {
	@Enumerable(false)
	public override webhookError: WebhookClient | null = webhookError ? new WebhookClient(webhookError) : null;

	@Enumerable(false)
	public override readonly guildMemberFetchQueue = new GuildMemberFetchQueue();

	@Enumerable(false)
	public override llrCollectors = new Set<LongLivingReactionCollector>();

	@Enumerable(false)
	public override invites = new InviteManager();

	public constructor() {
		super(clientOptions);

		container.workers = new WorkerService(3);

		container.schedule = new ScheduleManager();

		container.apis = new ApiService();

		container.settings = new SettingsService();

		container.stores.register(new SerializerStore());
		container.stores.register(new TaskStore());

		container.redis = envParseBoolean('REDIS_ENABLED')
			? new RedisManager({
					host: process.env.REDIS_HOST,
					port: envParseInteger('REDIS_PORT'),
					password: process.env.REDIS_PASSWORD,
					lazyConnect: true
				})
			: null;
	}

	public override async login(): Promise<string> {
		await container.workers.start();
		container.utilities = new UtilityService();

		const { shardCount } = clientOptions;
		container.logger.info(`${magentaBright('Gateway:')} Logging in with ${shardCount ?? 1} shard${(shardCount ?? 1) > 1 ? 's' : ''}`);

		await container.schedule.init();

		return super.login();
	}

	public override destroy(): Promise<void> {
		this.guildMemberFetchQueue.destroy();
		container.schedule.destroy();
		return super.destroy();
	}

	public override emit(event: string, ...args: any[]) {
		return super.emit(event, ...args);
	}

	public override get development() {
		return ['840755658793418782', '812546582531801118'].includes(process.env.CLIENT_ID!);
	}

	public override enabledProdOnlyEvent() {
		if (this.development) {
			return this.developmentRecoveryMode;
		}

		return true;
	}

	/**
	 * Retrieves the prefix for the guild.
	 * @param message The message that gives context.
	 */
	public override fetchPrefix = async (message: Message) => {
		if (isGuildMessage(message)) {
			if (this.development) {
				if (this.developmentRecoveryMode) {
					return (await readSettings(message.guild)).prefix;
				}
				return [process.env.CLIENT_PREFIX] as readonly string[];
			}
			return (await readSettings(message.guild)).prefix;
		}
		return [process.env.CLIENT_PREFIX] as readonly string[];
	};

	/**
	 * Retrieves the language key for the message.
	 * @param message The message that gives context.
	 */
	public fetchLanguage = async (message: InternationalizationContext) => {
		return message.guild ? (await readSettings(message.guild)).language : 'en-US';
	};

	public override developmentRecoveryMode = false;
}
