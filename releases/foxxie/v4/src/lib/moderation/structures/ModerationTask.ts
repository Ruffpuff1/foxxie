import { ApplyOptions } from '@sapphire/decorators';
import type { Guild } from 'discord.js';
import { isOnServer } from 'lib/util/util';
import { aquireSettings, guildSettings, PartialResponseValue, ResponseType, Task } from '../../database';

@ApplyOptions<Task.Options>({
    enabled: isOnServer()
})
export abstract class ModerationTask<T = unknown> extends Task {

    public async run(data: ModerationData<T>): Promise<PartialResponseValue> {
        const guild = this.container.client.guilds.cache.get(data.guildId);
        if (typeof guild === 'undefined') return { type: ResponseType.Ignore };

        if (!guild.available) return { type: ResponseType.Delay, value: 20000 };

        try {
            await this.handle(guild, data);
        // eslint-disable-next-line no-empty
        } catch {

        }

        return { type: ResponseType.Finished };
    }

    protected async getDmData(guild: Guild): Promise<{ send: boolean }> {
        return {
            send: Boolean(await aquireSettings(guild, guildSettings.moderation.dm))
        };
    }

    protected abstract handle(guild: Guild, data: ModerationData<T>): unknown;

}

export interface ModerationData<T = unknown> {
	caseId: number;
	userId: string | string[];
    guildId: string;
    duration: number;
    channelId: string;
    moderatorId: string;
	extra: T;
	scheduleRetryCount?: number;
}