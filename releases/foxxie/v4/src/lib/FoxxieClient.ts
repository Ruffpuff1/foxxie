import { SapphireClient, container, SapphirePrefix } from '@sapphire/framework';
import { CLIENT_OPTIONS } from '../config';
import { dependencies as deps } from '../../package.json';
import { yellow, green, magenta, bold } from 'colorette';
import { hostname } from 'os';
import { aquireSettings, guildSettings, SettingsManager } from './database';
import type * as Sentry from '@sentry/node';
import type { Message } from 'discord.js';
import { Player } from 'discord-player';
import { ScheduleManager } from './structures/managers';
import { Enumerable } from '@sapphire/decorators';
import { GuildMemberFetchQueue } from './discord';
import type { LongLivingReactionCollector } from './util';

const AUDIO_ENABLED = process.env.AUDIO_ENABLED === 'true';

class FoxxieClient extends SapphireClient {

    sentry: typeof Sentry | null;

    audio: Player | null;

    @Enumerable(false)
    public readonly guildMemberFetchQueue = new GuildMemberFetchQueue();

    @Enumerable(false)
    public llrCollectors = new Set<LongLivingReactionCollector>();

    @Enumerable(false)
    public schedules: ScheduleManager;

    constructor(sentry: typeof Sentry | null) {
        super(CLIENT_OPTIONS);

        if (sentry) {
            this.sentry = sentry;
            const sentryV = this.sentry.SDK_VERSION;

            this.sentry.setTag('host', hostname());
            this.sentry.setTag('discord.js', deps['discord.js']);
            this.sentry.setTag('sapphire', deps['@sapphire/framework']);
            container.logger.info(`${bold(magenta(`[SENTRY]`))} ${green(`Connected with version ${sentryV}`)}`);
        } else this.sentry = null;

        this.audio = AUDIO_ENABLED ? new Player(this, this.options.audio) : null;

        container.settings = new SettingsManager();

        this.schedules = new ScheduleManager();
        container.schedule = this.schedules;
    }

    get development(): boolean {
        return this.user?.id === '825130284382289920';
    }

    public fetchPrefix = async (message: Message): Promise<SapphirePrefix> => {
        if (message.guild) return aquireSettings(message.guild, guildSettings.prefix);
        return [process.env.CLIENT_PREFIX, ''] as readonly string[];
    };

    async _login({ shardCount }: { shardCount: number | string }): Promise<string> {
        await this.schedules.init();
        container.logger.info(`${bold(magenta(`[GATEWAY]`))} ${green(`Logging in with [${yellow(shardCount)}] shard${shardCount > 1 ? 's' : ''}`)}`);
        return super.login(process.env.DEV);
    }

    public async destroy(): Promise<void> {
        this.schedules.destroy();
        this.guildMemberFetchQueue.destroy();
        return super.destroy();
    }

}

export default FoxxieClient;