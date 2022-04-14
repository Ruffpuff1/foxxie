import { container, SapphireClient } from '@sapphire/framework';
import { CLIENT_OPTIONS, WEBHOOK_ERROR } from '#root/config';
import { WebhookClient } from 'discord.js';
import { magentaBright } from 'colorette';
import { Enumerable } from '@sapphire/decorators';
import { GuildMemberFetchQueue } from '#external/GuildMemberFetchQueue';
import { SettingsManager } from '#lib/database';
import type { LongLivingReactionCollector } from '#external/LongLivingReactionCollector';
import { AnalyticsManager, InviteManager, RedisManager, WorkerManager } from './structures';
import { isDev } from '@ruffpuff/utilities';
import { Leaderboard } from '#utils/Leaderboard';
import { EnvParse } from '@foxxie/env';
import { MongoClient } from './prisma';

export default class FoxxieClient extends SapphireClient {
    @Enumerable(false)
    public webhookError: WebhookClient | null = WEBHOOK_ERROR ? new WebhookClient(WEBHOOK_ERROR) : null;

    @Enumerable(false)
    public readonly guildMemberFetchQueue = new GuildMemberFetchQueue();

    @Enumerable(false)
    public llrCollectors = new Set<LongLivingReactionCollector>();

    @Enumerable(false)
    public invites = new InviteManager();

    @Enumerable(false)
    public leaderboard = new Leaderboard();

    public constructor() {
        super(CLIENT_OPTIONS);

        container.workers = new WorkerManager(3);

        container.analytics = EnvParse.boolean('INFLUX_ENABLED') ? new AnalyticsManager() : null;

        container.settings = new SettingsManager();

        container.prisma = new MongoClient();

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
        const { shardCount } = CLIENT_OPTIONS;
        container.logger.info(`${magentaBright('Gateway:')} Logging in with ${shardCount ?? 1} shard${(shardCount ?? 1) > 1 ? 's' : ''}`);

        return super.login();
    }

    public destroy(): void {
        this.guildMemberFetchQueue.destroy();
        super.destroy();
    }

    public get development() {
        return isDev();
    }
}
