import { getPlaylist, getPlaylistTracks } from '#lib/api/Spotify/util';
import { FoxxieCommand } from '#lib/structures';
import { GuildMessage } from '#lib/types';

export class UserCommand extends FoxxieCommand {
	public async messageRun(_: GuildMessage, args: FoxxieCommand.Args): Promise<void> {
		const link = await args.pick('url');
		await getPlaylist(link.toString());
		await getPlaylistTracks(link.toString());
	}
}
