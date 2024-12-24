import { ApplyOptions } from '@sapphire/decorators';
import { resetSpotifyToken } from '#lib/api/Spotify/util';
import { Task } from '#lib/schedule';
import { Schedules } from '#utils/constants';

@ApplyOptions<Task.Options>(({ container }) => ({
	enabled: container.client.enabledProdOnlyEvent(),
	name: Schedules.ResetSpotifyToken
}))
export class ResetSpotifyTokenTask extends Task {
	public async run() {
		await resetSpotifyToken();
		return null;
	}
}
