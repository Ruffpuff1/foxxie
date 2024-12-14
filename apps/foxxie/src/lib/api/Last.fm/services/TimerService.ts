import { container } from '@sapphire/framework';
import { ScheduleEntry } from '#lib/schedule';
import { days, seconds } from '#utils/common';
import { Schedules } from '#utils/constants';
import { blue, white } from 'colorette';
import _ from 'lodash';

import { IndexService } from './IndexService.js';

export class TimerService {
	#indexService = new IndexService();

	public async addUsersToIndexQueue() {
		container.logger.debug(`[${blue('Last.fm')} ${white('Index')}]: Gettings users to index`);

		const timeToIndex = Date.now() - days(120);

		const usersToIndex = _.take(await this.#indexService.getOutdatedUsers(new Date(timeToIndex)), 2000);

		container.logger.debug(`[${blue('Last.fm')} ${white('Index')}]: Found ${usersToIndex.length} outdated users, adding them to index queue.`);

		let indexDelay = new Date();
		let indexCount = 1;

		for (const userToUpdate of usersToIndex) {
			const updateUserQueueItem = {
				indexQueue: true,
				userId: userToUpdate.userid
			} satisfies ScheduleEntry.IndexUserQueueItem;

			await container.schedule.add(Schedules.IndexUser, indexDelay, {
				data: updateUserQueueItem
			});

			indexDelay = new Date(indexDelay.getTime() + seconds(20));
			indexCount++;
		}
	}
}
