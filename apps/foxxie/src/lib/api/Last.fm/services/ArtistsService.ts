import { container } from '@sapphire/framework';
import { minutes } from '#utils/common';
import _ from 'lodash';

import { ArtistRepository } from '../repository/ArtistRepository.js';
import { TopArtistNamePlaycount } from '../types/models/domain/TopArtist.js';

export class ArtistsService {
	public async getUserAllTimeTopArtists(userId: string, useCache = false) {
		const cacheKey = `user-${userId}-topartists-alltime`;
		const cachedValue = useCache ? await container.redis?.get(cacheKey) : null;

		if (cachedValue) {
			return JSON.parse(cachedValue) as TopArtistNamePlaycount[];
		}

		const freshTopArtists = _.orderBy(
			(await ArtistRepository.GetUserArtists(userId)).map(
				(s) =>
					({
						artistName: s.name,
						userPlaycount: s.playCount
					}) as TopArtistNamePlaycount
			),
			(o) => o.userPlaycount,
			'desc'
		);

		if (freshTopArtists.length > 100) {
			void container.redis!.pinsertex(cacheKey, minutes(10), freshTopArtists);
		}

		return freshTopArtists;
	}
}
