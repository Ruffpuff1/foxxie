import { isThenable } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { handleError } from '../discord';

export function floatPromise<T>(promise: Promise<T>): Promise<T> {
    if (isThenable(promise)) return promise.catch(e => {
        container.logger.fatal(e);
        return promise;
    });
    return promise;
}

export function resolveToNull<T>(promise: Promise<T>): Promise<T | null> {
    if (isThenable(promise)) return promise.catch(() => null);
    return promise;
}

export function resolveToErrorMessage(promise: Promise<unknown>): Promise<unknown> {
    if (isThenable(promise)) return promise.catch(handleError);
    return promise;
}