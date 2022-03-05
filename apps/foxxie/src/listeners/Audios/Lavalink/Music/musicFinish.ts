import { ApplyOptions } from '@sapphire/decorators';
import { AudioListener } from '#lib/structures';
import { EventArgs, Events } from '#lib/types';
import { acquireSettings, GuildSettings } from '#lib/database';

@ApplyOptions<AudioListener.Options>({ event: Events.MusicFinish })
export class UserListener extends AudioListener<Events.MusicFinish> {
    public async run(...[queue]: EventArgs<Events.MusicFinish>): Promise<void> {
        const channel = await queue.getTextChannel();
        if (channel) this.container.client.emit(Events.MusicFinishNotify, channel);

        const shouldLeave = await acquireSettings(queue.guildId, GuildSettings.Music.AutoLeave);
        if (shouldLeave) await queue.leave();

        await queue.clear();
    }
}
