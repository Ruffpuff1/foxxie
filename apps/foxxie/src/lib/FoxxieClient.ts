import { GuildMemberFetchQueue } from '#external/GuildMemberFetchQueue';
import type { LongLivingReactionCollector } from '#external/LongLivingReactionCollector';
import { clientOptions, webhookError } from '#root/config';
import { getApiHandlers } from '#utils/apiHandler';
import { EnvParse } from '@foxxie/env';
import { isDev } from '@ruffpuff/utilities';
import { Enumerable } from '@sapphire/decorators';
import { container, SapphireClient } from '@sapphire/framework';
import { magentaBright } from 'colorette';
import { WebhookClient } from 'discord.js';
import { InviteManager, RedisManager, ScheduleManager, WorkerManager } from './structures';

export default class FoxxieClient extends SapphireClient {
    @Enumerable(false)
    public webhookError: WebhookClient | null = webhookError ? new WebhookClient(webhookError) : null;

    @Enumerable(false)
    public readonly guildMemberFetchQueue = new GuildMemberFetchQueue();

    @Enumerable(false)
    public llrCollectors = new Set<LongLivingReactionCollector>();

    @Enumerable(false)
    public invites = new InviteManager();

    public constructor() {
        super(clientOptions);

        container.workers = new WorkerManager(3);

        container.schedule = new ScheduleManager();

        container.apis = getApiHandlers();

        container.redis = EnvParse.boolean('REDIS_ENABLED')
            ? new RedisManager({
                  host: process.env.REDIS_HOST,
                  port: EnvParse.int('REDIS_PORT'),
                  password: process.env.REDIS_PASSWORD,
                  lazyConnect: true
              })
            : null;
    }

    public async login(): Promise<string> {
        const { shardCount } = clientOptions;
        container.logger.info(
            `${magentaBright('Gateway:')} Logging in with ${shardCount ?? 1} shard${(shardCount ?? 1) > 1 ? 's' : ''}`
        );

        await container.schedule.init();
        await container.apis.spotify.initSpotify();

        return super.login();
    }

    public destroy(): Promise<void> {
        this.guildMemberFetchQueue.destroy();
        return super.destroy();
    }

    public get development() {
        return isDev();
    }
}
