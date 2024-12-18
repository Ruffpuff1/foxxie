import { container, err, ok, Result } from '@sapphire/framework';
import { isThenable } from '@sapphire/utilities';
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

export function floatPromise(promise: Awaitable<unknown>) {
	if (isThenable(promise)) promise.catch((error: Error) => container.logger.fatal(error));
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
