import { isOnServer, minutes } from '../../lib/util';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { GuildEntity, guildSettings, writeSettings } from '../../lib/database';
import type { GuildMember } from 'discord.js';

@ApplyOptions<ListenerOptions>({
    enabled: isOnServer()
})
export default class extends Listener {

    public timeout: number = minutes(5);

    public async run(guildId: string, member: GuildMember): Promise<void[]> {
        // if the member hasn't been in the server for five mintutes disgard the messages.
        if (Date.now() - (member.joinedTimestamp as number) < this.timeout) return [];

        return Promise.all([this.countGuild(guildId), this.countMember(member, guildId), this.countClient()]);
    }

    async countGuild(guildId: string): Promise<void> {
        await writeSettings(guildId, (settings: GuildEntity) => settings[guildSettings.messageCount] += 1);
    }

    async countMember(member: GuildMember, guildId: string): Promise<void> {
        const memberEntity = await this.container.db.members.ensure(member.id, guildId);
        memberEntity.messageCount += 1;
        memberEntity.save();
    }

    async countClient(): Promise<void> {
        const client = await this.container.db.clients.ensure();
        client.messageCount += 1;
        client.save();
    }

}