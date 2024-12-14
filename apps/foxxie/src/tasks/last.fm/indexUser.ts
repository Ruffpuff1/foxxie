import { ApplyOptions } from '@sapphire/decorators';
import { IndexService } from '#apis/last.fm/services/IndexService';
import { PartialResponseValue, ResponseType, ScheduleEntry, Task } from '#lib/schedule';
import { Schedules } from '#utils/constants';

@ApplyOptions<Task.Options>({
	name: Schedules.IndexUser
})
export class UserTask extends Task {
	#indexService = new IndexService();

	public async run(data: ScheduleEntry.TaskData[Schedules.IndexUser]): Promise<PartialResponseValue> {
		await this.#indexService.indexUser(data);
		return { type: ResponseType.Finished };
	}
}
