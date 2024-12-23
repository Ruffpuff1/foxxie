import { container, err, ok, Result } from '@sapphire/framework';
import { isThenable } from '@sapphire/utilities';
import { Emojis } from '#utils/constants';
import { Awaitable, DiscordAPIError, RESTJSONErrorCodes } from 'discord.js';

export interface ReferredPromise<T> {
	promise: Promise<T>;
	reject(error?: Error): void;
	resolve(value?: T): void;
}

/**
 * Create a referred promise.
 */
export function createReferPromise<T>(): ReferredPromise<T> {
	let resolve: (value: T) => void;
	let reject: (error?: Error) => void;
	const promise: Promise<T> = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	});

	// noinspection JSUnusedAssignment
	return { promise, reject: reject!, resolve: resolve! };
}

/**
 * Attaches a logging catch method to a promise, "floating it".
 * @param promise The promise to float.
 */
export function floatPromise(promise: Awaitable<unknown>) {
	if (isThenable(promise))
		promise.catch((error: Error) => {
			container.logger.debug(error);
		});
	return promise;
}

export function getDiscogsFormatEmote(format: string): null | string {
	switch (format) {
		case 'Box Set':
			return ':package:';
		case 'Cassette':
			return Emojis.Cassette;
		case 'CD':
			return ':cd:';
		case 'Vinyl':
			return Emojis.Vinyl;
	}

	return null;
}

export function keyIntToPitchString(key: number) {
	switch (key) {
		case 0:
			return 'C';
		case 1:
			return 'C#';
		case 10:
			return 'A#';
		case 11:
			return 'B';
		case 2:
			return 'D';
		case 3:
			return 'D#';
		case 4:
			return 'E';
		case 5:
			return 'F';
		case 6:
			return 'F#';
		case 7:
			return 'G';
		case 8:
			return 'G#';
		case 9:
			return 'A';
		default:
			return null;
	}
}

export async function resolveOnErrorCodes<T>(promise: Promise<T>, ...codes: readonly RESTJSONErrorCodes[]) {
	try {
		return await promise;
	} catch (error) {
		if (error instanceof DiscordAPIError && codes.includes(error.code as RESTJSONErrorCodes)) return null;
		throw error;
	}
}

export async function toErrorCodeResult<T>(promise: Promise<T>): Promise<Result<T, RESTJSONErrorCodes>> {
	try {
		return ok(await promise);
	} catch (error) {
		if (error instanceof DiscordAPIError) return err(error.code as RESTJSONErrorCodes);
		throw error;
	}
}
