import EnUsHandler from './en-US/constants';
import EsMXHandler from './es-MX/constants';
import type { Handler } from '../lib/i18n';

export const cache = new Map<string, Handler>([
    ['en-US', new EnUsHandler()],
    ['es-MX', new EsMXHandler()]
]);

export function getCache(key: string | undefined): Handler {
    return cache.get(key as string) ?? cache.get('en-US') as Handler;
}