import { ApplyOptions } from '@sapphire/decorators';
import { Task } from '#lib/schedule';

@ApplyOptions<Task.Options>({
	name: 'addUsersToIndexQueue'
})
export class UserTask extends Task {
	public async run() {
		// addUsersToIndexQueue
		return null;
	}
}
