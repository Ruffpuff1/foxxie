import type { Highlight } from '#lib/database';
import { seconds } from '@ruffpuff/utilities';
import { isMainThread, parentPort } from 'node:worker_threads';
import {
    HighlightTypeEnum,
    IncomingPayload,
    IncomingType,
    OutgoingHighlightPayload,
    OutgoingPayload,
    OutgoingWordFilterPayload,
    OutputType,
    RunHighlightPayload,
    RunWordFilterPayload
} from './types';
import { sanitize } from '@foxxie/sanitize';

if (isMainThread || parentPort === null) throw new Error('This worker can only be ran using worker_threads.');

function post(message: OutgoingPayload) {
    parentPort!.postMessage(message);
}

post({ type: 0 });

setInterval(() => {
    post({ type: 0 });
}, seconds(45)).unref();

parentPort.on('message', (message: IncomingPayload) => {
    post(handleMessage(message));
});

function handleMessage(message: IncomingPayload): OutgoingPayload {
    switch (message.type) {
        case IncomingType.RunHighlightPayload:
            return handleHighlight(message);
        case IncomingType.RunWordFilter:
            return runWordFilter(message);
        default:
            return { id: (message as Record<string, number>).id, type: OutputType.Unknown };
    }
}

function handleHighlight(message: RunHighlightPayload<HighlightTypeEnum>): OutgoingHighlightPayload {
    const { highlightType: type, content, id, authorId } = message;
    const data: OutgoingHighlightPayload = { type: OutputType.HighlightMatch, id, results: [] };

    switch (type) {
        case HighlightTypeEnum.Word:
            {
                const split = content.toLowerCase().split(/\s*\b\s*/);
                for (const { word, userId } of message.highlights.filter(
                    word => word.type === HighlightTypeEnum.Word
                ) as Highlight<HighlightTypeEnum.Word>[]) {
                    if (!split.includes(word.toLowerCase())) continue;
                    const parsed = content.replace(
                        new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
                        match => `__${match}__`
                    );
                    if (userId === authorId) continue;
                    data.results.push({ userId, content: parsed, trigger: word });
                }
            }
            break;
        case HighlightTypeEnum.Regex:
            {
                for (const { word, userId } of message.highlights.filter(
                    word => word.type === HighlightTypeEnum.Regex
                ) as Highlight<HighlightTypeEnum.Regex>[]) {
                    if (!word.test(content)) continue;
                    const parsed = content.trim().replace(word, match => {
                        if (match.trim().length > 0) return `__${match}__`;
                        return match;
                    });
                    if (userId === authorId) continue;
                    data.results.push({ userId, content: parsed, trigger: word.toString() });
                }
            }
            break;
    }

    return data;
}

function runWordFilter(message: RunWordFilterPayload): OutgoingWordFilterPayload {
    const result = filter(sanitize(message.content), message.regex);
    if (result === null) return { id: message.id, type: OutputType.FilterNoContent };

    return {
        id: message.id,
        type: OutputType.FilterMatch,
        filtered: result.filtered,
        highlighted: result.highlighted,
        match: result.match
    };
}

function filter(str: string, regex: RegExp) {
    const matches = str.match(regex);
    if (matches === null) return null;

    let last = 0;
    let next = 0;

    const filtered: string[] = [];
    const highlighted: string[] = [];
    for (const match of matches) {
        next = str.indexOf(match, last);
        const section = str.slice(last, next);
        if (section) {
            filtered.push(section, '*'.repeat(match.length));
            highlighted.push(section, `__${match}__`);
        } else {
            filtered.push('*'.repeat(match.length));
            highlighted.push(`__${match}__`);
        }
        last = next + match.length;
    }

    if (last !== str.length) {
        const end = str.slice(last);
        filtered.push(end);
        highlighted.push(end);
    }

    return {
        filtered: filtered.join(''),
        highlighted: highlighted.join(''),
        match: matches[0]
    };
}
