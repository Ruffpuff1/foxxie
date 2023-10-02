import { Task } from '#lib/Container/Stores/Tasks/Task';
import { Schedules } from '#utils/constants';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<Task.Options>({
    name: Schedules.UpdateDiscogsUsers
    // enabled: !isDev()
})
export class UserTask extends Task {
    public async run() {
        await this.container.apis.lastFm.timerService.updateDiscogsUsers();
        return null;
    }
}
