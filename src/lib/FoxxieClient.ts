import { clientOptions, webhookError } from '#root/config';
import { LongLivingReactionCollector } from '#utils/External/LongLivingReactionCollector';
import { Enumerable } from '@sapphire/decorators';
import { container, SapphireClient } from '@sapphire/framework';
import { WebhookClient } from 'discord.js';
import { InviteManager, RedisManager } from './Structures';
import { WorkerService } from './Container/Workers';
import { ScheduleManager, TaskStore } from './schedule';
import { ApiService } from './Container/Api/ApiService';
import { SettingsService } from './Container/Services/SettingsService';
import { EnvParse } from '@foxxie/env';
import { UtilityService } from './Container/Utility/UtilityService';
import { magentaBright } from 'colorette';
import { GuildMemberFetchQueue } from './util/External';
import { SerializerStore } from './Database/settings/structures/SerializerStore';

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

		container.redis = EnvParse.boolean('REDIS_ENABLED')
			? new RedisManager({
					host: process.env.REDIS_HOST,
					port: EnvParse.int('REDIS_PORT'),
					password: process.env.REDIS_PASSWORD,
					lazyConnect: true
				})
			: null;
	}

	public override async login(): Promise<string> {
		container.utilities = new UtilityService();

		const { shardCount } = clientOptions;
		container.logger.info(`${magentaBright('Gateway:')} Logging in with ${shardCount ?? 1} shard${(shardCount ?? 1) > 1 ? 's' : ''}`);

		await container.schedule.init();

		return super.login();
	}

	public override destroy(): Promise<void> {
		this.guildMemberFetchQueue.destroy();
		return super.destroy();
	}

	public override emit(event: string, ...args: any[]) {
		// console.log(event);
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

	public override developmentRecoveryMode = false;
}
