import { UserLastFM } from '@prisma/client';

import { RecentTrackList } from '../types/models/domain/RecentTrack.js';
import { Response } from './Response.js';

export function parseLastFmUserResponse(str: null | string | undefined): null | UserLastFM {
	if (!str) return null;
	const parsed = JSON.parse(str) as UserLastFM;

	parsed.lastIndexed = parsed.lastIndexed ? new Date(parsed.lastIndexed) : null!;
	parsed.lastSmallIndexed = parsed.lastSmallIndexed ? new Date(parsed.lastSmallIndexed) : null;
	parsed.lastUsed = parsed.lastUsed ? new Date(parsed.lastUsed) : null;
	parsed.registeredLastFM = parsed.registeredLastFM ? new Date(parsed.registeredLastFM) : null;

	return parsed;
}

export function parseRecentTrackListResponse(str: string): Response<RecentTrackList> {
	const parsed = JSON.parse(str) as Response<RecentTrackList>;
	return new Response<RecentTrackList>({
		content: {
			...parsed.content,
			recentTracks: parsed.content.recentTracks.map((tr) => ({ ...tr, timePlayed: new Date(tr.timePlayed!) }))
		},
		success: parsed.success
	});
}
