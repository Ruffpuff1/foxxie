import { StatusPageService } from '#apis/statuspage';
import { Task } from '#root/Core/structures/Task';
import { Schedules } from '#utils/constants';
import { ProductionOnlyPiece, RegisterCron, RegisterTask } from '#utils/decorators';

@ProductionOnlyPiece()
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
