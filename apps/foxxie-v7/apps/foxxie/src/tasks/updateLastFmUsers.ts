import { Task } from '#lib/Container/Stores/Tasks/Task';
import { Schedules } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Task.Options>({
    name: Schedules.UpdateLastFmUsers,
    enabled: true
})
export class UserTask extends Task {
    public async run() {
        await this.container.apis.lastFm.timerService.addUsersToUpdateQueue();
        return null;
    }
}
