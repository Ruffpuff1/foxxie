import { resetSpotifyToken } from '#lib/api/Spotify/util';
import { Task } from '#root/Core/structures/Task';
import { Schedules } from '#utils/constants';
import { ProductionOnlyPiece, RegisterCron, RegisterTask } from '#utils/decorators';

@ProductionOnlyPiece()
@RegisterCron('0 * * * *')
@RegisterTask(Schedules.ResetSpotifyToken)
export class UserTask extends Task {
	public async run() {
		await resetSpotifyToken();
		return null;
	}
}
