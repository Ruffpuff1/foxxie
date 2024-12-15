import { ApplyOptions } from '@sapphire/decorators';
import { TimerService } from '#apis/last.fm/services/TimerService';
import { Task } from '#lib/schedule';

@ApplyOptions<Task.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	name: 'addUsersToIndexQueue'
}))
export class UserTask extends Task {
	#timerService = new TimerService();

	public async run() {
		await this.#timerService.addUsersToIndexQueue();
		return null;
	}
}
