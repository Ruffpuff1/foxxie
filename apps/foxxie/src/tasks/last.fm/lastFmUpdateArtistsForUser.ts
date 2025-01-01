import { UpdateService } from '#apis/last.fm/services/UpdateService';
import { PartialResponseValue, ResponseType, ScheduleEntry, Task } from '#lib/schedule';
import { Schedules } from '#utils/constants';
import { RegisterTask } from '#utils/decorators';

@RegisterTask(Schedules.LastFMUpdateArtistsForUser)
export class UserTask extends Task<Schedules.LastFMUpdateArtistsForUser> {
	public async run({ playUpdate, userId }: ScheduleEntry.TaskData[Schedules.LastFMUpdateArtistsForUser]): Promise<null | PartialResponseValue> {
		const user = await this.container.prisma.userLastFM.findFirst({ where: { userid: userId } });
		if (!user) return null;

		const userArtists = await UpdateService.GetUserArtists(userId);
		await UpdateService.UpdateArtistsForUser(user!, playUpdate.addedPlays, userArtists);

		return { type: ResponseType.Finished };
	}
}
