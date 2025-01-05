import { Enumerable } from '@sapphire/decorators';
import { container, SapphireClient } from '@sapphire/framework';
import { getRootData } from '@sapphire/pieces';
import { InternationalizationContext } from '@sapphire/plugin-i18next';
import { envParseBoolean, envParseInteger } from '@skyra/env-utilities';
import { Audio, FoxxieQueue } from '#Foxxie/Audio';
import { EventStore, TaskStore, TextCommandStore } from '#Foxxie/Core';
import { Logger } from '#Foxxie/Logger';
import { readSettings, SerializerStore } from '#lib/database';
import { InviteManager, RedisManager } from '#lib/structures';
import { clientOptions, webhookError } from '#root/config';
import { ScheduleManager } from '#root/Core/structures/schedule/index';
import { isGuildMessage } from '#utils/common';
import { GuildMemberFetchQueue } from '#utils/external/GuildMemberFetchQueue';
import { LongLivingReactionCollector } from '#utils/external/LongLivingReactionCollector';
import { magentaBright } from 'colorette';
import { Message, WebhookClient } from 'discord.js';
import { join } from 'node:path';

import { ApiService } from './api/ApiService.js';
import { DataSourceFactory } from './api/Last.fm/factories/DataSourceFactory.js';
import { SettingsService } from './Container/Services/SettingsService.js';
import { UtilityService } from './Container/Utility/UtilityService.js';
import { WorkerService } from './Container/Workers/WorkerService.js';

export default class FoxxieClient extends SapphireClient {
	@Enumerable(false)
	public override audio: FoxxieQueue | null = null;

	public override developmentRecoveryMode = false;

	@Enumerable(false)
	public override readonly guildMemberFetchQueue = new GuildMemberFetchQueue();

	@Enumerable(false)
	public override invites = new InviteManager();

	public lfm = new DataSourceFactory();

	@Enumerable(false)
	public override llrCollectors = new Set<LongLivingReactionCollector>();

	@Enumerable(false)
	public override webhookError: null | WebhookClient = webhookError ? new WebhookClient(webhookError) : null;

	public constructor() {
		super(clientOptions);

		container.workers = new WorkerService(3);

		container.schedule = new ScheduleManager();

		container.apis = new ApiService();

		container.settings = new SettingsService();

		container.stores.register(new SerializerStore());
		container.stores.register(new TaskStore());
		container.stores.register(new TextCommandStore());
		container.stores.register(new EventStore());

		container.stores.registerPath(join(getRootData().root, 'lib', 'modules', 'starboard'));
		container.stores.registerPath(join(getRootData().root, 'lib', 'modules', 'suggestions'));

		container.redis = envParseBoolean('REDIS_ENABLED')
			? new RedisManager({
					host: process.env.REDIS_HOST,
					lazyConnect: true,
					password: process.env.REDIS_PASSWORD,
					port: envParseInteger('REDIS_PORT')
				})
			: null;

		Audio.Load(clientOptions);
		Logger.Load();
	}

	public override destroy(): Promise<void> {
		this.guildMemberFetchQueue.destroy();
		container.schedule.destroy();
		return super.destroy();
	}

	public override emit(event: string, ...args: any[]) {
		// console.log(event);
		return super.emit(event, ...args);
	}

	public override enabledProdOnlyEvent() {
		if (this.development) {
			return this.developmentRecoveryMode;
		}

		return true;
	}

	/**
	 * Retrieves the language key for the message.
	 * @param message The message that gives context.
	 */
	public fetchLanguage = async (message: InternationalizationContext) => {
		return message.guild ? readSettings(message.guild, 'language') : 'en-US';
	};

	/**
	 * Retrieves the prefix for the guild.
	 * @param message The message that gives context.
	 */
	public override fetchPrefix = async (message: Message) => {
		if (isGuildMessage(message)) {
			if (this.development) {
				if (this.developmentRecoveryMode) {
					return readSettings(message.guild, 'prefix');
				}
				return [process.env.CLIENT_PREFIX] as readonly string[];
			}
			return readSettings(message.guild, 'prefix');
		}
		return [process.env.CLIENT_PREFIX, ''] as readonly string[];
	};

	public override async login(): Promise<string> {
		await container.workers.start();
		container.utilities = new UtilityService();

		const { shardCount } = clientOptions;
		container.logger.info(`${magentaBright('Gateway:')} Logging in with ${shardCount ?? 1} shard${(shardCount ?? 1) > 1 ? 's' : ''}`);

		await container.schedule.init();

		return super.login();
	}

	public override get development() {
		return ['812546582531801118', '840755658793418782'].includes(process.env.CLIENT_ID!);
	}
}
