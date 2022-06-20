import { isThenable } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';

/**
 * Attaches a logging catch method to a promise, "floating it".
 * @param promise The promise to float.
 */
export function floatPromise(promise: Promise<unknown>) {
    if (isThenable(promise))
        promise.catch((error: Error) => {
            container.logger.debug(error);
        });
    return promise;
}
