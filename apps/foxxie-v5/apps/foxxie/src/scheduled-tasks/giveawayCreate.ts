import type { ScheduleData } from '#lib/types';
import { Schedules } from '#utils/constants';
import { isDev } from '@ruffpuff/utilities';
import { ApplyOptions } from '@sapphire/decorators';
import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';

@ApplyOptions<ScheduledTask.Options>({
    name: Schedules.GiveawayCreate,
    enabled: !isDev()
})
export class UserTask extends ScheduledTask {
    public async run(data: ScheduleData<Schedules.GiveawayCreate>): Promise<void> {
        await this.container.client.giveaways.create(data);
    }
}
