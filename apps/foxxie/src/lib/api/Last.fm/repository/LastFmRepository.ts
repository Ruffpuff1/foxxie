import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { isNullish, isNullishOrEmpty } from '@sapphire/utilities';
import { RedisKeyLastFmRecentTracks } from '#lib/types';
import { seconds } from '#utils/common';
import { blue } from 'colorette';

import { LastfmApi } from '../api/LastfmApi.js';
import { Call, GetRecentTracksUserResult } from '../types/Calls.js';
import { DataSourceUser } from '../types/models/domain/DataSourceUser.js';
import { RecentTrack, RecentTrackList } from '../types/models/domain/RecentTrack.js';
import { RecentTrackLfm } from '../types/models/RecentTrackLfm.js';
import { ResponseStatus } from '../types/ResponseStatus.js';
import { parseRecentTrackListResponse } from '../util/cacheParsers.js';
import { Response } from '../util/Response.js';

export class LastFmRepository {
	private readonly _lastFmApi: LastfmApi;

	public constructor() {
		this._lastFmApi = new LastfmApi();
	}

	public async getLfmUserInfo(lastFmUserName: string): Promise<DataSourceUser | null> {
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

	public async getRecentTracks(
		lastFmUserName: string,
		count = 2,
		useCache = false,
		sessionKey: null | string = null,
		fromUnixTimestamp: null | number = null,
		amountOfPages = 1
	): Promise<Response<RecentTrackList>> {
		const cacheKey = `${lastFmUserName}-lastfm-recent-tracks` as RedisKeyLastFmRecentTracks;
		const queryParams: Record<string, string> = { extended: '1', limit: count.toString(), user: lastFmUserName };

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
			let recentTracksCall: Response<GetRecentTracksUserResult>;
			if (amountOfPages === 1) {
				recentTracksCall = await this._lastFmApi.callApi(queryParams, Call.RecentTracks);
			} else {
				recentTracksCall = await this._lastFmApi.callApi(queryParams, Call.RecentTracks);

				if (
					recentTracksCall.success &&
					recentTracksCall.content.recenttracks &&
					recentTracksCall.content.recenttracks.track.length >= count - 2 &&
					count >= 400
				) {
					for (let i = 1; i < amountOfPages; i++) {
						queryParams.page = (i + 1).toString();
						let pageResponse = await this._lastFmApi.callApi(queryParams, Call.RecentTracks);

						if (pageResponse.success && pageResponse.content?.recenttracks?.track) {
							recentTracksCall.content.recenttracks.track.push(...pageResponse.content.recenttracks.track);
							if (pageResponse.content.recenttracks.track.length < 1000) break;
						} else if (pageResponse.error === ResponseStatus.Failure) {
							pageResponse = await this._lastFmApi.callApi(queryParams, Call.RecentTracks);

							if (pageResponse.success) {
								recentTracksCall.content.recenttracks.track.push(...pageResponse.content.recenttracks.track);
								if (pageResponse.content.recenttracks.track.length < 1000) break;
							} else break;
						} else break;
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
}
