import { resetSpotifyToken } from '#lib/api/Spotify/util';
import { Task } from '#lib/schedule';
import { Schedules } from '#utils/constants';
import { ProductionOnly, RegisterCron, RegisterTask } from '#utils/decorators';

@ProductionOnly()
@RegisterCron('0 * * * *')
@RegisterTask(Schedules.ResetSpotifyToken)
export class UserTask extends Task {
	public async run() {
		await resetSpotifyToken();
		return null;
	}
}
