import type { Guild } from 'discord.js';
import { acquireSettings, GuildSettings } from '#lib/database';
import { LockQueue } from '@foxxie/lock-queue';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { seconds } from '@ruffpuff/utilities';

export abstract class ModerationTask<T = unknown> extends ScheduledTask {
    private readonly locks = new LockQueue();

    public async run(data: ModerationData<T>): Promise<void> {
        const guild = this.container.client.guilds.cache.get(data.guildId);
        if (typeof guild === 'undefined') return;
        if (!guild.available) {
            await this.container.tasks.create(this.name, data, seconds(20));
            return;
        }

        const lock = this.locks.acquire(data.guildId);
        await lock.writeLock();

        try {
            await this.handle(guild, data);
            // eslint-disable-next-line no-empty
        } catch {
        } finally {
            lock.unlock();
        }
    }

    protected async fetchMe(guild: Guild) {
        return guild.me === null ? guild.members.fetch(process.env.CLIENT_ID!) : guild.me;
    }

    protected async getDmData(guild: Guild): Promise<{ send: boolean }> {
        return {
            send: await acquireSettings(guild, GuildSettings.Moderation.Dm)
        };
    }

    protected ctx(duration: number) {
        return {
            context: 'reason',
            duration
        } as const;
    }

    protected abstract handle(guild: Guild, data: ModerationData<T>): unknown;
}

export interface ModerationData<T = unknown> {
    caseId: number;
    userId: string;
    guildId: string;
    duration: number;
    channelId: string;
    moderatorId: string;
    extra: T;
    scheduleRetryCount?: number;
}

// eslint-disable-next-line no-redeclare
export namespace ModerationTask {
    export type Options = ScheduledTask.Options;
}
