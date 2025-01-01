import { LoadType } from '@foxxiebot/audio';
import { Argument } from '@sapphire/framework';
import { parseURL } from '@sapphire/utilities';
import { extractSongsFromPlaylist, getSongData, SpotifyPlaylistRegExp, SpotifySongRegExp } from '#lib/api/Spotify/util';
import { GuildMessage } from '#lib/types';

export class UserArgument extends Argument<string[]> {
	public async run(parameter: string, context: Argument.Context) {
		const message = context.message as GuildMessage;
		let tracks: null | string[];

		if (SpotifyPlaylistRegExp.test(parameter) || SpotifySongRegExp.test(parameter)) tracks = await this.handleSpotify(message, parameter);
		else tracks = (await this.fetchURL(message, parameter)) ?? (await this.handleYouTube(message, parameter));

		if (tracks === null || tracks.length === 0) {
			return this.error({
				context,
				identifier: 'arguments:song',
				parameter
			});
		}

		return this.ok(tracks);
	}

	private async fetchURL(message: GuildMessage, param: string) {
		const url = parseURL(param.replace(/^<(.+)>$/g, '$1'));
		if (url === null) return null;

		return this.getResults(message, url.href);
	}

	private async getResults(message: GuildMessage, param: string) {
		const audio = this.container.client.audio!.players.get(message.guild.id);
		try {
			const response = await audio.node.load(param);

			if (response.loadType === LoadType.NoMatches) throw 'arguments:song';

			if (response.tracks.length === 0) return response.tracks.map((track) => track.track);

			return [response.tracks[0].track];
		} catch {
			return [];
		}
	}

	private async handleSpotify(message: GuildMessage, param: string): Promise<null | string[]> {
		if (SpotifyPlaylistRegExp.test(param)) {
			const songs = await extractSongsFromPlaylist(param);
			const data = await Promise.all(songs.map(async (song) => this.handleYouTube(message, song)));
			return data.filter((a) => Boolean(a)).map((ids) => ids![0]);
		} else if (SpotifySongRegExp.test(param)) {
			const song = await getSongData(param);
			const data = await this.handleYouTube(message, song!);
			return data;
		}

		return [];
	}

	private handleYouTube(message: GuildMessage, arg: string): Promise<null | string[]> {
		return this.getResults(message, `ytsearch: ${arg}`);
	}
}
