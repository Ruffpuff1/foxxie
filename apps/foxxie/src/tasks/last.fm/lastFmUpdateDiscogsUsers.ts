import { DiscogsService } from '#apis/last.fm/services/third-party/DiscogsService';
import { Task } from '#lib/schedule';
import { Schedules } from '#utils/constants';
import { ProductionOnly, RegisterCron, RegisterTask } from '#utils/decorators';

@ProductionOnly()
@RegisterCron('0 12 * * *')
@RegisterTask(Schedules.LastFMUpdateDiscogsUsers)
export class UserTask extends Task {
	#discogsService = new DiscogsService();

	public async run() {
		const usersToUpdate = await this.#discogsService.getOutdatedDiscogsUsers();
		await this.#discogsService.updateDiscogsUsers(usersToUpdate);
		return null;
	}
}
