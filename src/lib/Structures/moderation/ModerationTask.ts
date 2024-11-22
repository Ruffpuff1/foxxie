import { Task } from '#lib/Container/Stores/Tasks/Task';
import { GuildSettings } from '#lib/Database';
import { PartialResponseValue, ResponseType } from '#lib/schedule/manager/ScheduleEntry';
import { SchemaKeys } from '#utils/moderation';
import { LockQueue } from '@foxxie/lock-queue';
import { seconds } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import type { Guild } from 'discord.js';

export abstract class ModerationTask<T = unknown> extends Task {
    private readonly locks = new LockQueue();

    public async run(data: ModerationData<T>): Promise<PartialResponseValue> {
        const guild = this.container.client.guilds.cache.get(data.guildId);
        if (typeof guild === 'undefined') return { type: ResponseType.Ignore };

        if (!guild.available) return { type: ResponseType.Delay, value: seconds(20) };

        await this.locks.write(data.guildId);

        try {
            await this.handle(guild, data);
            // eslint-disable-next-line no-empty
        } finally {
            this.locks.delete(data.guildId);
        }

        return { type: ResponseType.Finished };
    }

    protected async fetchMe(guild: Guild) {
        return guild.members.fetch(process.env.CLIENT_ID!);
    }

    protected async getDmData(guild: Guild): Promise<{ send: boolean }> {
        return {
            send: await container.db.guilds.acquire(guild.id, GuildSettings.Moderation.Dm)
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
    [SchemaKeys.Case]: number;
    [SchemaKeys.CreatedAt]: Date;
    [SchemaKeys.Moderator]: string;
    [SchemaKeys.Reason]: string | null;
    [SchemaKeys.ImageURL]: string | null;
    [SchemaKeys.Type]: number;
    [SchemaKeys.Refrence]: number | null;
    [SchemaKeys.LogChannel]: string | null;
    [SchemaKeys.LogMessageId]: string | null;
    [SchemaKeys.Channel]: string | null;
    [SchemaKeys.Guild]: string;
    [SchemaKeys.User]: string;
    [SchemaKeys.Duration]: number;
    [SchemaKeys.ExtraData]: T;
    [SchemaKeys.Metadata]: any;
    scheduleRetryCount?: number;
}

// eslint-disable-next-line no-redeclare
export namespace ModerationTask {
    export type Options = Task.Options;
}
