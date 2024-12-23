import { RecentTrackList } from '#lib/api/Last.fm/types/models/domain/RecentTrack';
import { Response } from '#lib/api/Last.fm/util/Response';
import { Snowflake } from 'discord.js';

export type AudioCurrentKey = `${AudioKey}:current`;

export type AudioKey = `audio:${Snowflake}`;

export type AudioNextKey = `${AudioKey}:next`;

export type AudioPositionKey = `${AudioKey}:position`;

export type AudioReplayKey = `${AudioKey}:replay`;

export type AudioSkipsKey = `${AudioKey}:skips`;
export type AudioSystemPauseKey = `${AudioKey}:systemPause`;
export type AudioTextKey = `${AudioKey}:text`;
export type AudioVolumeKey = `${AudioKey}:volume`;
export interface QueueKeys {
	readonly current: AudioCurrentKey;
	readonly next: AudioNextKey;
	readonly position: AudioPositionKey;
	readonly replay: AudioReplayKey;
	readonly skips: AudioSkipsKey;
	readonly systemPause: AudioSystemPauseKey;
	readonly text: AudioTextKey;
	readonly volume: AudioVolumeKey;
}
export type RedisData<K extends RedisKey = RedisKey> = K extends RedisKeyLastFmRecentTracks ? Response<RecentTrackList> : NumberBoolean | unknown;
export type RedisKey =
	| AudioCurrentKey
	| AudioKey
	| AudioNextKey
	| AudioPositionKey
	| AudioReplayKey
	| AudioSkipsKey
	| AudioSkipsKey
	| AudioSystemPauseKey
	| AudioVolumeKey
	| RedisKeyLastFmRecentTracks;
export type RedisKeyLastFmRecentTracks = `${string}-lastfm-recent-tracks`;
export type RedisValue<K extends RedisKey = RedisKey> = K extends AudioSystemPauseKey ? NumberBoolean : null | string;

type NumberBoolean = '0' | '1';
