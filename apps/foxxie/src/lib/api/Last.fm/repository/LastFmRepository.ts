import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/pieces';
import { cast, isNullish, isNullishOrEmpty, sleep } from '@sapphire/utilities';
import { RedisKeyLastFmRecentTracks } from '#lib/types';
import { first, seconds } from '#utils/common';
import { blue } from 'colorette';

import { LastfmApi } from '../api/LastfmApi.js';
import { Call, GetRecentTracksUserResult, GetTopArtistResultArtist, GetUserTopArtistsResult } from '../types/Calls.js';
import { TimePeriod } from '../types/enums/TimePeriod.js';
import { DataSourceUser } from '../types/models/domain/DataSourceUser.js';
import { TimeSettingsModel } from '../types/models/domain/OptionModels.js';
import { RecentTrack, RecentTrackList } from '../types/models/domain/RecentTrack.js';
import { TopArtist, TopArtistList } from '../types/models/domain/TopArtist.js';
import { RecentTrackLfm } from '../types/models/RecentTrackLfm.js';
import { ResponseStatus } from '../types/ResponseStatus.js';
import { parseRecentTrackListResponse } from '../util/cacheParsers.js';
import { Response } from '../util/Response.js';

export class LastFmRepository {
	public async getAuthSession(token: string) {
		const queryParams = {
			token
		};

		const authSessionCall = await LastFmRepository._lastFmApi.callApi(queryParams, Call.GetAuthSession, true);

		return authSessionCall;
	}

	public async getAuthToken() {
		const tokenCall = await LastFmRepository._lastFmApi.callApi({}, Call.GetToken);
		return tokenCall;
	}

	public async getTrackInfo(trackName: string, artistName: string, username: null | string = null) {
		const queryParams = {
			artist: artistName,
			autocorrect: '0',
			extended: '1',
			track: trackName
		} as Record<string, string>;

		if (username) {
			queryParams.username = username;
		}

		const trackCall = await LastFmRepository._lastFmApi.callApi(queryParams, Call.TrackInfo);
		return trackCall;
	}

	public async scrobble(sessionKey: string, artistName: string, trackName: string, albumName: null | string = null, timeStamp: Date | null = null) {
		timeStamp ??= new Date();

		const queryParams = {
			artist: artistName,
			sk: sessionKey,
			timestamp: seconds.fromMilliseconds(timeStamp.getTime()).toString(),
			track: trackName
		} as Record<string, string>;

		if (!isNullishOrEmpty(albumName)) {
			queryParams.album = albumName;
		}

		const scrobbleCall = await LastFmRepository._lastFmApi.callApi(queryParams, Call.TrackScrobble, true);
		return scrobbleCall;
	}

	public async searchTrack(trackName: string, artistName: null | string = null) {
		const queryParams = {
			track: trackName
		} as Record<string, string>;

		if (!isNullishOrEmpty(artistName)) {
			queryParams.artist = artistName;
		}

		const trackSearchCall = await LastFmRepository._lastFmApi.callApi(queryParams, Call.TrackSearch);

		if (!trackSearchCall.success) {
			return new Response({
				content: null,
				error: trackSearchCall.error,
				message: 'Last.fm returned an error',
				success: false
			});
		}

		if (isNullish(trackSearchCall.content) || isNullishOrEmpty(trackSearchCall.content.results.trackmatches.track.length)) {
			return new Response({
				content: null,
				success: true
			});
		}

		const track = first(trackSearchCall.content.results.trackmatches.track);

		if (!track) {
			return new Response({
				content: null,
				success: true
			});
		}

		return new Response({
			content: {
				albumArtist: track.artist,
				artistName: track.artist,
				trackName: track.name
			},
			success: true
		});
	}

	public static async FetchTopArtists(lastFmUserName: string, timePeriod: TimePeriod, count = 2, amountOfPages = 2) {
		// let lastStatsTimeSpan = LastFmRepository.TimePeriodToLastStatsTimeSpan(timePeriod);

		const artists: GetTopArtistResultArtist[] = [];
		let topArtists: Response<GetUserTopArtistsResult>;

		if (amountOfPages === 1) {
			topArtists = await this._lastFmApi.callApi(
				{
					limit: count.toString(),
					page: '1',
					period: 'overall',
					user: lastFmUserName
				},
				Call.UserTopArtists
			);

			if (topArtists.success && topArtists.content?.topartists?.artist.length) {
				artists.push(...topArtists.content.topartists.artist);
			}
		} else {
			topArtists = await this._lastFmApi.callApi(
				{
					limit: count.toString(),
					page: '1',
					period: 'overall',
					user: lastFmUserName
				},
				Call.UserTopArtists
			);
			if (topArtists.success) {
				artists.push(...topArtists.content.topartists.artist);

				if (topArtists.content.topartists.artist.length > 998) {
					for (let i = 2; i <= amountOfPages; i++) {
						topArtists = await this._lastFmApi.callApi(
							{
								limit: count.toString(),
								page: i.toString(),
								period: 'overall',
								user: lastFmUserName
							},
							Call.UserTopArtists
						);

						if (!topArtists.success) break;

						if (topArtists.content.topartists.artist.length) {
							artists.push(...topArtists.content.topartists.artist);

							if (topArtists.content.topartists.artist.length < 1000) break;
						}
					}
				}
			}
		}

		console.log(timePeriod);

		if (isNullish(topArtists.content) || !topArtists.content?.topartists?.artist?.length) {
			return new Response<TopArtistList>({
				content: cast<TopArtistList>([]),
				success: true
			});
		}

		return new Response<TopArtistList>({
			content: {
				topArtists: artists.map(
					(s) =>
						({
							artistName: s.name,
							artistUrl: s.url,
							mbid: isNullishOrEmpty(s.mbid) ? s.mbid : null,
							userPlaycount: parseInt(s.playcount, 10)
						}) as TopArtist
				),
				totalAmount: artists.length
			},
			success: true
		});
	}

	public static async GetLfmUserInfo(lastFmUserName: string): Promise<DataSourceUser | null> {
		const queryParams: Record<string, string> = {
			user: lastFmUserName
		};

		const userCall = await this._lastFmApi.callApi(queryParams, Call.UserInfo);

		return userCall.success
			? ({
					albumcount: Number(userCall.content.user.album_count),
					artistcount: Number(userCall.content.user.artist_count),
					country: userCall.content.user.country,
					image:
						userCall.content.user.image.find((a) => a.size === 'extralarge') &&
						!isNullishOrEmpty(userCall.content.user.image.find((a) => a.size === 'extralarge')?.['#text'])
							? userCall.content.user.image.find((a) => a.size === 'extralarge')?.['#text'].replace('/u/300x300/', '/u/') || null
							: null,
					lfmRegisteredUnix: Number(userCall.content.user.registered.unixtime),
					name: userCall.content.user.realname,
					playcount: Number(userCall.content.user.playcount),
					registered: new Date(Number(userCall.content.user.registered.unixtime) * 1000),
					registeredUnix: Number(userCall.content.user.registered.unixtime),
					subscriber: userCall.content.user.subscriber === `1`,
					trackcount: Number(userCall.content.user.track_count),
					type: userCall.content.user.type,
					url: userCall.content.user.url
				} satisfies DataSourceUser)
			: null;
	}

	public static async GetRecentTracks(
		lastFmUserName: string,
		count = 2,
		useCache = false,
		sessionKey: null | string = null,
		fromUnixTimestamp: null | number = null,
		amountOfPages = 1
	): Promise<Response<RecentTrackList>> {
		const cacheKey = `${lastFmUserName}-lastfm-recent-tracks` as RedisKeyLastFmRecentTracks;
		const queryParams: Record<string, string> = { extended: '1', limit: count.toString(), user: lastFmUserName };
		const errorRetries = 3;

		if (!isNullishOrEmpty(sessionKey)) {
			queryParams.sk = sessionKey;
		}
		if (fromUnixTimestamp !== null) {
			queryParams.from = fromUnixTimestamp.toString();
		}

		if (useCache) {
			const cached = await resolveToNull(container.redis!.get(cacheKey));

			if (!isNullish(cached)) {
				const cachedRecentTracks = parseRecentTrackListResponse(cached);
				if (cachedRecentTracks && cachedRecentTracks.content.recentTracks.length && cachedRecentTracks.content.recentTracks.length >= count) {
					return cachedRecentTracks;
				}
			}
		}

		try {
			const recentTracksCall = await LastFmRepository._lastFmApi.callApi(queryParams, Call.RecentTracks, sessionKey ? true : false);
			console.log(recentTracksCall);

			if (
				amountOfPages > 1 &&
				recentTracksCall.success &&
				recentTracksCall.content.recenttracks &&
				recentTracksCall.content.recenttracks.track.length >= count - 2 &&
				count >= 400
			) {
				const failureDelay = [500, 2500, 5000, 10000, 25000];

				for (let i = 1; i < amountOfPages; i++) {
					queryParams.page = (i + 1).toString();
					console.log(i);

					let pageResponse: null | Response<GetRecentTracksUserResult> = null;
					let pageFetchedSuccessfully = false;
					let attempts = 0;

					while (attempts < errorRetries && !pageFetchedSuccessfully) {
						if (attempts > 0) {
							await sleep(failureDelay[attempts - 1]);
						}

						pageResponse = await LastFmRepository._lastFmApi.callApi(queryParams, Call.RecentTracks, sessionKey ? true : false);

						attempts++;

						if (pageResponse.success && pageResponse.content.recenttracks) {
							pageFetchedSuccessfully = true;
						}
					}

					if (pageFetchedSuccessfully) {
						recentTracksCall.content.recenttracks.track.push(...pageResponse!.content.recenttracks.track);

						if (pageResponse!.content.recenttracks.track.length < count - 2) break;
					} else {
						container.logger.warn(`Failed to fetch page ${i + 1} for ${lastFmUserName} after ${attempts} attemps. Stopping pagination.`);
					}
				}
			}

			if (recentTracksCall.success && recentTracksCall.content.recenttracks) {
				const response = new Response<RecentTrackList>({
					content: {
						recentTracks: recentTracksCall.content.recenttracks.track.map((track) => LastFmRepository.LastfmTrackToRecentTrack(track)),
						totalAmount: Number(recentTracksCall.content.recenttracks['@attr'].total),
						userRecentTracksUrl: `https://www.last.fm/user/${lastFmUserName}/library`,
						userUrl: `https://www.last.fm/user/${lastFmUserName}`
					},
					success: true
				});

				await container.redis?.pinsertex(cacheKey, seconds(14), response);
				return response;
			}

			return new Response<RecentTrackList>({
				error: recentTracksCall.error,
				message: recentTracksCall.message,
				success: false
			});
		} catch (e) {
			container.logger.error(`[${blue('LastFmRepository')}] Error in getRecentTracksAsync for ${lastFmUserName}`, e);
			throw e;
		}
	}

	public static async GetTopArtists(lastFmUserName: string, timeSettings: TimeSettingsModel, count = 2, amountOfPages = 1) {
		try {
			let response: Response<TopArtistList> = new Response({
				success: false
			});

			if (
				!timeSettings.useCustomTimePeriod ||
				!timeSettings.startDateTime ||
				!timeSettings.endDateTime ||
				timeSettings.timePeriod === TimePeriod.AllTime
			) {
				response = await LastFmRepository.FetchTopArtists(lastFmUserName, timeSettings.timePeriod!, count, amountOfPages);
			}
			// else {
			// 	response = await LastFmRepository.GetTopArtistsForCustomTimePeriod(
			// 		lastFmUserName,
			// 		timeSettings.startDateTime,
			// 		timeSettings.endDateTime,
			// 		count
			// 	);
			// }

			return response;
		} catch (e) {
			container.logger.error(`LastFmRepository: Error in GetTopArtistsAsync for ${lastFmUserName}`, e);
			return new Response<TopArtistList>({
				error: ResponseStatus.Unknown,
				message: 'error while deserializing Last.fm response',
				success: false
			});
		}
	}

	private static LastfmTrackToRecentTrack(recentTrackLfm: RecentTrackLfm): RecentTrack {
		return {
			albumCoverUrl:
				recentTrackLfm.image?.find((a) => a.size === 'extralarge') &&
				!isNullishOrEmpty(recentTrackLfm.image?.find((a) => a.size === 'extralarge')?.['#text']) &&
				!recentTrackLfm.image.find((a) => a.size === 'extralarge')?.['#text'].includes('2a96cbd8b46e442fc41c2b86b821562f.png')
					? recentTrackLfm.image.find((a) => a.size === 'extralarge')!['#text'].replace('/u/300x300/', '/u/')
					: null,
			albumName: isNullishOrEmpty(recentTrackLfm.album?.['#text']) ? null : recentTrackLfm.album['#text'],
			albumUrl: recentTrackLfm.album.mbid,
			artistName: recentTrackLfm.artist.name || '',
			artistUrl: recentTrackLfm.artist.url,
			loved: recentTrackLfm.loved === '1',
			nowPlaying: (recentTrackLfm['@attr'] && recentTrackLfm['@attr']?.nowplaying === 'true') || false,
			timePlayed: recentTrackLfm.date?.uts ? new Date(parseInt(recentTrackLfm.date.uts, 10) * 1000) : null,
			trackName: recentTrackLfm.name,
			trackUrl: recentTrackLfm.url
		};
	}

	private static _lastFmApi = new LastfmApi();
}
