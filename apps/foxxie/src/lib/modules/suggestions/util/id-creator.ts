import { Colors } from '#utils/constants';

import { IntegerString } from '../types.js';

export const enum Id {
	Suggestions = 'suggestions',
	SuggestionsModal = 'suggestions-modal',
	SuggestionsModalField = 'suggestions-modal.field'
}

export const enum Status {
	Accept = 'accept',
	Consider = 'consider',
	Deny = 'deny'
}

export type CustomIdEntries =
	| [name: Id.Suggestions, action: 'archive' | 'resolve' | 'thread', id: IntegerString, status?: Status] //
	| [name: Id.SuggestionsModal, status: Status, id: IntegerString];

export type Get<I extends Id> = Extract<CustomIdEntries, [name: I, ...tail: any[]]>;
export type Key<E extends CustomIdEntries> = E[0];
export type Values<E extends CustomIdEntries> = E extends [key: any, ...tail: infer Tail] ? Tail : never;

export function getColor(action: Status) {
	switch (action) {
		case Status.Accept:
			return Colors.Green;
		case Status.Consider:
			return Colors.Yellow;
		case Status.Deny:
			return Colors.Red;
	}
}

export function makeCustomId<E extends CustomIdEntries>(key: Key<E>, ...values: Values<E>) {
	// return values.length === 0 ? key : `${key}.${values.join('.')}`;
	return `${key}.${values.join('.')}`;
}

export function makeIntegerString(value: bigint | number): IntegerString {
	return value.toString() as IntegerString;
}
