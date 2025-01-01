import { sanitize } from '@foxxiebot/sanitize';
import { Listener } from '@sapphire/framework';
import { LastFmDataSourceFactory } from '#apis/last.fm/factories/DataSourceFactory';
import { EventArgs, FoxxieEvents } from '#lib/types';

export class UserListener extends Listener<FoxxieEvents.LastFMScrobbleAudioTrackForMember> {
	#dataSourceFactory = new LastFmDataSourceFactory();

	public async run(...[member, track]: EventArgs<FoxxieEvents.LastFMScrobbleAudioTrackForMember>) {
		const lfmUser = await this.container.prisma.userLastFM.findFirst({ where: { userid: member.id } });
		// if no lfmuser or session key exit
		if (!lfmUser || !lfmUser.scrobbleByMusicBot || !lfmUser.sessionKeyLastFM) return;

		const previousByTrack = await this.container.prisma.userPlay.findMany({
			where: {
				trackName: track.title,
				userId: member.id
			}
		});

		const decodedTrackArtistName = sanitize(track.author.toLowerCase());
		const decodedTrackName = sanitize(track.title.toLowerCase());

		const matchedPreviousByArtist = previousByTrack.find((w) => decodedTrackArtistName.includes(sanitize(w.artistName.toLowerCase())));

		if (matchedPreviousByArtist) {
			return this.#scrobble(
				lfmUser.sessionKeyLastFM,
				matchedPreviousByArtist.artistName,
				matchedPreviousByArtist.trackName,
				matchedPreviousByArtist.albumName
			);
		}

		const previousByArtist = await this.container.prisma.userPlay.findMany({
			where: {
				artistName: track.author,
				userId: member.id
			}
		});

		const matchedPreviousByTrack = previousByArtist.find((w) => decodedTrackName.includes(sanitize(w.trackName.toLowerCase())));

		if (matchedPreviousByTrack) {
			return this.#scrobble(
				lfmUser.sessionKeyLastFM,
				matchedPreviousByTrack.artistName,
				matchedPreviousByTrack.trackName,
				matchedPreviousByTrack.albumName
			);
		}

		// first search for the track with the artist.
		const searchWithAuthor = await this.#dataSourceFactory.searchTrack(track.title, track.author);
		if (searchWithAuthor && searchWithAuthor.content) {
			const trackInfo = await this.#dataSourceFactory.getTrackInfo(searchWithAuthor.content.trackName, searchWithAuthor.content.artistName);
			if (trackInfo?.content && trackInfo.content.track.artist && trackInfo.content.track.name) {
				return this.#scrobble(
					lfmUser.sessionKeyLastFM,
					trackInfo.content.track.artist.name,
					trackInfo.content.track.name,
					trackInfo.content.track.album?.title || null
				);
			}
		}
	}

	async #scrobble(sessionKey: string, artistName: string, trackName: string, albumName: null | string) {
		await this.#dataSourceFactory.scrobble(sessionKey, artistName, trackName, albumName);
	}
}
