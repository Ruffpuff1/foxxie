import { Events } from '#lib/types';
import { Schedules } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';
import { container } from '@sapphire/framework';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { blueBright } from 'colorette';

const header = blueBright('Analytics:');

@ApplyOptions<ScheduledTask.Options>({
    name: Schedules.PostAnalytics,
    enabled: Boolean(container.analytics),
    cron: '*/1 * * * *',
    bullJobOptions: {
        removeOnComplete: true
    }
})
export class UserTask extends ScheduledTask {
    public run() {
        const { client, logger, analytics } = this.container;

        if (!analytics) return null;

        const guildCount = client.guilds.cache.size;
        const userCount = client.guilds.cache.reduce((acc, val) => acc + (val.memberCount ?? 0), 0);

        this.container.client.emit(Events.AnalyticsSync, guildCount, userCount);

        logger.debug(`${header} Posted analytics, Users: ${userCount}. Guilds: ${guildCount}`);
        return null;
    }
}
