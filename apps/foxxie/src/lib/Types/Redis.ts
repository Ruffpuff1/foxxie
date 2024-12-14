import { RecentTrackList } from '#lib/api/Last.fm/types/models/domain/RecentTrack';
import { Response } from '#lib/api/Last.fm/util/Response';

export type RedisData<K extends RedisKey = RedisKey> = K extends RedisKeyLastFmRecentTracks ? Response<RecentTrackList> : never;

export type RedisKey = RedisKeyLastFmRecentTracks;

export type RedisKeyLastFmRecentTracks = `${string}-lastfm-recent-tracks`;

export type RedisValue<K extends RedisKey = RedisKey> = K;
