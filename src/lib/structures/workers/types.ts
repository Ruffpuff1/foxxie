import type { Highlight } from '#lib/database';
import type { Snowflake } from 'discord.js';

export const enum OutputType {
    Heartbeat,
    Unknown,
    HighlightMatch,
    FilterMatch,
    FilterNoContent
}

export type OutgoingPayload =
    | OutgoingHeartbeatPayload
    | OutgoingUnknownCommandPayload
    | OutgoingHighlightPayload
    | OutgoingWordFilterPayload;

export interface OutgoingHeartbeatPayload {
    type: OutputType.Heartbeat;
}

export interface OutgoingUnknownCommandPayload extends IdPayload {
    type: OutputType.Unknown;
}

export interface OutgoingHighlightPayload extends IdPayload {
    type: OutputType;
    results: HighlightReturnData[];
}

export interface HighlightReturnData {
    userId: Snowflake;
    content: string;
    trigger: string;
}

export interface IdPayload {
    id: number;
}

export type IncomingPayload = RunHighlightPayload<HighlightTypeEnum> | RunWordFilterPayload;

export const enum IncomingType {
    RunHighlightPayload,
    RunWordFilter
}

export interface RunHighlightPayload<T extends HighlightTypeEnum> extends IdPayload {
    type: IncomingType.RunHighlightPayload;
    highlightType: T;
    content: string;
    authorId: Snowflake;
    highlights: Highlight<T>[];
}

export interface RunWordFilterPayload extends IdPayload {
    type: IncomingType.RunWordFilter;
    regex: RegExp;
    content: string;
}

export const enum HighlightTypeEnum {
    Word,
    Regex
}

export interface OutgoingWordFilterPayload extends IdPayload {
    type: OutputType.FilterNoContent | OutputType.FilterMatch;
    filtered?: string;
    highlighted?: string;
    match?: string;
}
