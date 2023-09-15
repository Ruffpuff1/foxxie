/* eslint-disable no-import-assign */
import { ApiService } from '#Api/ApiService';
import { GuildMemberFetchQueue } from '#external/GuildMemberFetchQueue';
import type { LongLivingReactionCollector } from '#external/LongLivingReactionCollector';
import { clientOptions, webhookError } from '#root/config';
import { EnvParse } from '@foxxie/env';
import { isDev } from '@ruffpuff/utilities';
import { Enumerable } from '@sapphire/decorators';
import { SapphireClient, container } from '@sapphire/framework';
import { magentaBright } from 'colorette';
import { WebhookClient } from 'discord.js';
import { UtilityService } from './Container/Utility/Services/UtilityService';
import { WorkerService } from './Container/Workers';
import { InviteManager, RedisManager, ScheduleManager } from './Structures';

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

        container.workers = new WorkerService(3);

        container.schedule = new ScheduleManager();

        container.apis = new ApiService();

        container.utilities = new UtilityService();

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
        await container.apis.init();

        return super.login();
    }

    public destroy(): Promise<void> {
        this.guildMemberFetchQueue.destroy();
        return super.destroy();
    }

    public emit(event: string, ...args: any[]) {
        // console.log(event);
        return super.emit(event, ...args);
    }

    public get development() {
        return isDev();
    }
}
