import type { Snowflake } from 'discord.js';

import { Highlight } from './worker.js';

export const enum HighlightTypeEnum {
	Word,
	Regex
}

export const enum IncomingType {
	RunHighlightPayload,
	RunWordFilter
}

export const enum OutputType {
	Heartbeat,
	Unknown,
	HighlightMatch,
	FilterMatch,
	FilterNoContent
}

export interface HighlightReturnData {
	content: string;
	trigger: string;
	userId: Snowflake;
}

export interface IdPayload {
	id: number;
}

export type IncomingPayload = RunHighlightPayload<HighlightTypeEnum> | RunWordFilterPayload;

export interface OutgoingHeartbeatPayload {
	type: OutputType.Heartbeat;
}

export interface OutgoingHighlightPayload extends IdPayload {
	results: HighlightReturnData[];
	type: OutputType;
}

export type OutgoingPayload = OutgoingHeartbeatPayload | OutgoingHighlightPayload | OutgoingUnknownCommandPayload | OutgoingWordFilterPayload;

export interface OutgoingUnknownCommandPayload extends IdPayload {
	type: OutputType.Unknown;
}

export interface OutgoingWordFilterPayload extends IdPayload {
	filtered?: string;
	highlighted?: string;
	match?: string;
	type: OutputType.FilterMatch | OutputType.FilterNoContent;
}

export interface RunHighlightPayload<T extends HighlightTypeEnum> extends IdPayload {
	authorId: Snowflake;
	content: string;
	highlights: Highlight<HighlightTypeEnum>[];
	highlightType: T;
	type: IncomingType.RunHighlightPayload;
}

export interface RunWordFilterPayload extends IdPayload {
	content: string;
	regex: RegExp;
	type: IncomingType.RunWordFilter;
}
