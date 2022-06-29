import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GuildEntity, GuildSettings, writeSettings } from '#lib/database';
import type { GuildMember } from 'discord.js';
import { EventArgs, Events } from '#lib/types';
import { minutes, isDev } from '@ruffpuff/utilities';

@ApplyOptions<ListenerOptions>({
    enabled: !isDev(),
    event: Events.StatsMessage
})
export class UserListener extends Listener<Events.StatsMessage> {
    public timeout = minutes(5);

    public async run(...[guildId, member]: EventArgs<Events.StatsMessage>): Promise<void[]> {
        // if the member hasn't been in the server for five mintutes disgard the messages.
        if (Date.now() - member.joinedTimestamp! < this.timeout) return [];

        return Promise.all([this.countGuild(guildId), this.countMember(member, guildId), this.countClient()]);
    }

    private async countGuild(guildId: string): Promise<void> {
        await writeSettings(guildId, (settings: GuildEntity) => (settings[GuildSettings.MessageCount] += 1));
    }

    private async countMember(member: GuildMember, guildId: string): Promise<void> {
        const memberEntity = await this.container.db.members.ensure(member.id, guildId);
        memberEntity.messageCount += 1;
        await memberEntity.save();
    }

    private async countClient(): Promise<void> {
        const client = await this.container.db.clients.ensure();
        client.messageCount += 1;
        await client.save();
    }
}
