import { sanitize } from '@foxxiebot/sanitize';
import { cast } from '@sapphire/utilities';
import { seconds } from '#utils/common';
import { isMainThread, parentPort } from 'node:worker_threads';

import {
	HighlightTypeEnum,
	IncomingPayload,
	IncomingType,
	OutgoingHighlightPayload,
	OutgoingPayload,
	OutputType,
	RunHighlightPayload
} from './types.js';
import { OutgoingWordFilterPayload, RunWordFilterPayload } from './types.js';

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

export interface Highlight<T extends HighlightTypeEnum> {
	type: T;
	userId: string;
	word: T extends HighlightTypeEnum.Regex ? RegExp : string;
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

function handleHighlight(message: RunHighlightPayload<HighlightTypeEnum>): OutgoingHighlightPayload {
	const { authorId, content, highlightType: type, id } = message;
	const data: OutgoingHighlightPayload = { id, results: [], type: OutputType.HighlightMatch };

	switch (type) {
		case HighlightTypeEnum.Word:
			{
				const split = content.toLowerCase().split(/\s*\b\s*/);
				for (const { userId, word } of cast<Highlight<HighlightTypeEnum.Word>[]>(
					message.highlights.filter((word) => word.type === HighlightTypeEnum.Word)
				)) {
					if (!split.includes(word.toLowerCase())) continue;
					const parsed = content.replace(new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), (match) => `__${match}__`);
					if (userId === authorId) continue;
					data.results.push({ content: parsed, trigger: word, userId: userId! });
				}
			}
			break;
		case HighlightTypeEnum.Regex:
			{
				for (const { userId, word } of cast<Highlight<HighlightTypeEnum.Regex>[]>(
					message.highlights.filter((word) => word.type === HighlightTypeEnum.Regex)
				)) {
					if (!word.test(content)) continue;
					const parsed = content.trim().replace(word, (match) => {
						if (match.trim().length > 0) return `__${match}__`;
						return match;
					});
					if (userId === authorId) continue;
					data.results.push({ content: parsed, trigger: word.toString(), userId: userId! });
				}
			}
			break;
	}

	return data;
}

function handleMessage(message: IncomingPayload): OutgoingPayload {
	switch (message.type) {
		case IncomingType.RunHighlightPayload:
			return handleHighlight(message);
		case IncomingType.RunWordFilter:
			return runWordFilter(message);
		default:
			return { id: cast<Record<string, number>>(message).id, type: OutputType.Unknown };
	}
}

function runWordFilter(message: RunWordFilterPayload): OutgoingWordFilterPayload {
	const result = filter(sanitize(message.content), message.regex);
	if (result === null) return { id: message.id, type: OutputType.FilterNoContent };

	return {
		filtered: result.filtered,
		highlighted: result.highlighted,
		id: message.id,
		match: result.match,
		type: OutputType.FilterMatch
	};
}
