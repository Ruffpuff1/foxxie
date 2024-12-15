import { UserPlay } from '@prisma/client';
import { countArray, days, first } from '#utils/common';
import _ from 'lodash';

import { PlaySource } from '../types/enums/PlaySource.js';
import { TimePeriod } from '../types/enums/TimePeriod.js';
import { DataSourceUser } from '../types/models/domain/DataSourceUser.js';
import { ImportUser } from '../types/models/domain/ImportUser.js';
import { TimeSettingsModel } from '../types/models/domain/OptionModels.js';
import { TopArtist, TopArtistList } from '../types/models/domain/TopArtist.js';
import { Response } from '../util/Response.js';
import { PlayRepository } from './PlayRepository.js';

export class PlayDataSourceRepository {
	public async getAllTopArtists(user: ImportUser, timePeriod: TimePeriod, playDays: number, count = 2) {
		let plays: UserPlay[] = [];

		if (timePeriod === TimePeriod.AllTime) {
			plays = await PlayRepository.getUserPlays(user.userId, user.dataSource);
		} else {
			plays = await PlayRepository.getUserPlays(user.userId, user.dataSource, undefined, new Date(Date.now() - days(playDays)));
		}

		return PlayDataSourceRepository.PlaysToTopArtists(plays, count);
	}

	public async getLfmUserInfo(user: ImportUser, dataSourceUser: DataSourceUser) {
		const plays = await PlayRepository.getUserPlays(user.userId, user.dataSource);

		dataSourceUser.playcount = plays.length;
		dataSourceUser.artistcount = new Set(plays.map((g) => g.artistName.toLowerCase())).size;
		dataSourceUser.albumcount = new Set(plays.filter((w) => w.albumName).map((g) => g.albumName?.toLowerCase())).size;
		dataSourceUser.trackcount = new Set(plays.map((g) => g.trackName.toLowerCase())).size;

		if (plays.length) {
			const registered = _.minBy(plays, (o) => o.timePlayed)?.timePlayed;
			if (registered) dataSourceUser.registered = registered;
			dataSourceUser.registeredUnix = dataSourceUser.registered.getTime();
		}

		return dataSourceUser;
	}

	public async getScrobbleCountFromDate(user: ImportUser, from: null | number = null) {
		const fromTimeStamp = from ? new Date(from) : new Date(2000, 0, 1);

		return PlayRepository.GetUserPlayCount(user.userId, user.dataSource, fromTimeStamp);
	}

	public async getTopArtists(user: ImportUser, timeSettings: TimeSettingsModel, count = 2) {
		if (
			!timeSettings.useCustomTimePeriod ||
			!timeSettings.startDateTime ||
			!timeSettings.endDateTime ||
			timeSettings.timePeriod === TimePeriod.AllTime
		) {
			return this.getAllTopArtists(user, timeSettings.timePeriod!, timeSettings.playDays!, count);
		}
		throw 'unreachable';
	}

	private static DeterminePlaySources(plays: UserPlay[]) {
		if (!plays) return [PlaySource.LastFm];

		const playSources: PlaySource[] = [];

		if (plays.some((a) => a.playSource === PlaySource.SpotifyImport)) playSources.push(PlaySource.SpotifyImport);
		if (plays.some((a) => a.playSource === PlaySource.AppleMusicImport)) playSources.push(PlaySource.AppleMusicImport);
		if (plays.some((a) => a.playSource === PlaySource.LastFm)) playSources.push(PlaySource.LastFm);

		return playSources;
	}

	private static PlaysToTopArtists(plays: UserPlay[], count: number) {
		const topArtists = Object.entries(_.groupBy(plays, (g) => g.artistName.toLowerCase()));

		return new Response<TopArtistList>({
			content: {
				topArtists: _.take(
					topArtists
						.map(
							([, entries]) =>
								({
									artistName: first(entries).artistName,
									artistUrl: ``,
									firstPlay: first(entries.sort((a, b) => a.timePlayed.getTime() - b.timePlayed.getTime())).timePlayed,
									timeListened: {
										countedTracks: Object.entries(_.groupBy(entries, (g) => g.trackName)).map(([tKey, plays]) => ({
											countedPlays: plays.length,
											name: tKey
										})),
										msPlayed: _.sumBy(entries, (s) => s.msPlayed || 0) ?? 0,
										playsWithPlayTime: countArray(entries, (s) => s.msPlayed !== null)
									},
									userPlaycount: entries.length
								}) satisfies TopArtist
						)
						.sort((a, b) => b.userPlaycount - a.userPlaycount),
					count
				),
				totalAmount: topArtists.length
			} satisfies TopArtistList,
			playSources: PlayDataSourceRepository.DeterminePlaySources(plays),
			success: true
		});
	}
}
