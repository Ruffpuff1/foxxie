import { resetSpotifyToken } from '#utils/API';
import { Schedules } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';

@ApplyOptions<ScheduledTask.Options>({
    name: Schedules.ResetSpotifyToken,
    cron: '0 * * * *',
    bullJobOptions: {
        removeOnComplete: true
    }
})
export class UserTask extends ScheduledTask {
    public async run() {
        await resetSpotifyToken();
        return null;
    }
}
