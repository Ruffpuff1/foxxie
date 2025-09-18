import { isNullishOrEmpty } from '@sapphire/utilities';

import { LastFMApi } from '../Api/LastFMApi.js';
import { Call, DataSourceUser } from '../Resources/index.js';

export class LastFmRepository {
	public static async GetLfmUserInfo(lastFmUserName: string): Promise<DataSourceUser | null> {
		const queryParams: Record<string, string> = {
			user: lastFmUserName
		};

		const userCall = await LastFMApi.CallApi(queryParams, Call.UserInfo);

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
}
