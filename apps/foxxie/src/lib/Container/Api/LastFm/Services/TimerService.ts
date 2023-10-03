import { hours } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { blue } from 'colorette';

export class TimerService {
    public async updateDiscogsUsers() {
        const usersToUpdate = await container.apis.discogs.getOutdatedDiscogsUsers();
        await container.apis.discogs.updateDiscogsUsers(usersToUpdate);
    }

    public async addUsersToUpdateQueue() {
        const timeFilter = Date.now() - hours(3);
        const usersToUpdate = await container.apis.lastFm.updateService.getOutdatedUsers(timeFilter);

        container.logger.debug(`[${blue('Last.fm')}] found ${usersToUpdate.length} outdated users, adding them to update queue.`);

        await this._updateService.addUsersToUpdateQueue(usersToUpdate);
    }

    private get _updateService() {
        return container.apis.lastFm.updateService
    }
}
