import { TimerService } from '#apis/last.fm/services/TimerService';
import { Task } from '#lib/schedule';
import { Schedules } from '#utils/constants';
import { ProductionOnly, RegisterCron, RegisterTask } from '#utils/decorators';

@ProductionOnly()
@RegisterCron('0 8 * * *')
@RegisterTask(Schedules.AddUsersToIndexQueue)
export class UserTask extends Task {
	#timerService = new TimerService();

	public async run() {
		await this.#timerService.addUsersToIndexQueue();
		return null;
	}
}
