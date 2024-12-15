import { ApplyOptions } from '@sapphire/decorators';
import { DiscogsService } from '#apis/last.fm/services/third-party/DiscogsService';
import { Task } from '#lib/schedule';

@ApplyOptions<Task.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	name: 'lastFmUpdateDiscogsUsers'
}))
export class UserTask extends Task {
	#discogsService = new DiscogsService();

	public async run() {
		const usersToUpdate = await this.#discogsService.getOutdatedDiscogsUsers();
		await this.#discogsService.updateDiscogsUsers(usersToUpdate);
		return null;
	}
}
