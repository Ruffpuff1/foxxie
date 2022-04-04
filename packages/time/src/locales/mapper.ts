import type { LocaleString } from '../types';
import type { BaseHandler } from './baseHandler';
import { EnUsHandler } from './en-US';
import { EsMXHandler } from './es-MX';

export const Locales = new Map<LocaleString, typeof BaseHandler>([
    //
    [EnUsHandler.key, EnUsHandler],
    [EsMXHandler.key, EsMXHandler]
]);
