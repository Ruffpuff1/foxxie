import { acquireSettings, GuildSettings } from '#lib/database';
import { EventArgs, Events, GuildMessage } from '#lib/types';
import { isDev, minutes } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { RateLimitManager } from '@sapphire/ratelimits';

@ApplyOptions({
    event: Events.UserMessage,
    enabled: !isDev()
})
export class UserListener extends Listener<Events.UserMessage> {
    private rateLimits = new RateLimitManager(minutes(1), 1);

    public async run(...[msg]: EventArgs<Events.UserMessage>): Promise<void> {
        // don't run on edits.
        if (msg.editedAt) return;

        if (!(await this.isEnabled(msg))) return;
        if (Date.now() - msg.member.joinedTimestamp! < minutes(5)) return;
        if (this.isRatelimited(msg.author.id)) return;

        this.container.client.emit(Events.PointsUser, msg);
        this.container.client.emit(Events.PointsMember, msg);
    }

    private async isEnabled(msg: GuildMessage): Promise<boolean> {
        const [isEnabled, excluded] = await acquireSettings(msg.guild, [GuildSettings.Leveling.Enabled, GuildSettings.Leveling.IgnoredChannels]);
        if (!isEnabled) return false;

        if (excluded.includes(msg.channel.id)) return false;
        return true;
    }

    private isRatelimited(userId: string): boolean {
        const rateLimit = this.rateLimits.acquire(userId);
        if (rateLimit.limited) return true;

        rateLimit.consume();
        return false;
    }
}
