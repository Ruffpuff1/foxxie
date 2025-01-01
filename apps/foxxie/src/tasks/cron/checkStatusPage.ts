import { StatusPageService } from '#apis/statuspage';
import { Task } from '#lib/schedule';
import { Schedules } from '#utils/constants';
import { ProductionOnly, RegisterCron, RegisterTask } from '#utils/decorators';

@ProductionOnly()
@RegisterCron('*/5 * * *')
@RegisterTask(Schedules.CheckStatusPage)
export class UserTask extends Task {
	public async run() {
		try {
			await Promise.all(await StatusPageService.RunGuilds());
			return null;
		} catch {
			return null;
		}
	}
}
