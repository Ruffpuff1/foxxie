import { GuildSettings } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { EventArgs, Events } from '#lib/types';
import { fetchChannel } from '#utils/Discord';
import { isDev, minutes } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import { RateLimitManager } from '@sapphire/ratelimits';
import { PermissionFlagsBits } from 'discord-api-types/v9';

@ApplyOptions<ListenerOptions>({
    event: Events.StatsMemberCount,
    enabled: !isDev()
})
export class UserListener extends Listener<Events.StatsMemberCount> {
    private rateLimits = new RateLimitManager(minutes(10), 2);

    public async run(...[guild, t]: EventArgs<Events.StatsMemberCount>): Promise<void> {
        if (this.isRateLimited(guild.id)) return;

        if (!guild.me?.permissions.has(PermissionFlagsBits.ManageChannels)) return;

        const [template, isCompact] = await this.container.prisma.guilds(guild.id, [
            GuildSettings.Channels.StatsMemberCountTemplate,
            GuildSettings.Channels.StatsMemberCountCompact
        ]);

        const channel = await fetchChannel(guild, GuildSettings.Channels.StatsMemberCount);
        if (!channel) return;

        const memberCount = t(LanguageKeys.Globals[isCompact ? 'NumberCompact' : 'NumberFormat'], { value: guild.memberCount });

        await channel.setName(template ? template.replace(/{count}/gi, memberCount) : `Members: ${memberCount}`);
    }

    private isRateLimited(guildId: string): boolean {
        const rateLimit = this.rateLimits.acquire(guildId);
        if (rateLimit.limited) return true;

        rateLimit.consume();
        return false;
    }
}
