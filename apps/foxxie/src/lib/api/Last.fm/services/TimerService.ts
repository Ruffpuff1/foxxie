/* eslint-disable perfectionist/sort-decorators */
import { container } from '@sapphire/pieces';
import { ProductionOnlyTask, Task } from '#Foxxie/Core';
import { ResponseType, ScheduleEntry } from '#root/Core/structures/schedule/index';
import { days, seconds, take } from '#utils/common';
import { Schedules } from '#utils/constants';
import { blue, white } from 'colorette';
import _ from 'lodash';

import { IndexService } from './IndexService.js';
import { DiscogsService } from './third-party/DiscogsService.js';
import { UpdateService } from './UpdateService.js';

export class TimerService {
	@Task((task) => task.setCron('0 8 * * *').setName(Schedules.AddUsersToIndexQueue))
	@ProductionOnlyTask()
	public static async AddUsersToIndexQueue() {
		container.logger.debug(`[${blue('Last.fm')} ${white('Index')}]: Gettings users to index`);

		const timeToIndex = Date.now() - days(120);
		const usersToIndex = take(await IndexService.GetOutdatedUsers(new Date(timeToIndex)), 2000);

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
		return null;
	}

	@Task(Schedules.IndexUser)
	@ProductionOnlyTask()
	public static async IndexUser(data: ScheduleEntry.TaskData[Schedules.IndexUser]) {
		await IndexService.IndexUser(data);
		return { type: ResponseType.Finished };
	}

	@Task(Schedules.LastFMUpdateArtistsForUser)
	@ProductionOnlyTask()
	public static async UpdateArtistsForUser({ playUpdate, userId }: ScheduleEntry.TaskData[Schedules.LastFMUpdateArtistsForUser]) {
		const user = await container.prisma.userLastFM.findFirst({ where: { userid: userId } });
		if (!user) return null;

		const userArtists = await UpdateService.GetUserArtists(userId);
		await UpdateService.UpdateArtistsForUser(user!, playUpdate.addedPlays, userArtists);

		return { type: ResponseType.Finished };
	}

	@Task((task) => task.setCron('0 12 * * *').setName(Schedules.LastFMUpdateDiscogsUsers))
	@ProductionOnlyTask()
	public static async UpdateDiscogsUsers() {
		const usersToUpdate = await DiscogsService.GetOutdatedDiscogsUsers();
		await DiscogsService.UpdateDiscogsUsers(usersToUpdate);
		return null;
	}
}
