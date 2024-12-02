import * as enUS from './en-US/constants';
import * as esMX from './es-ES/constants';

export const localeMap = new Map<string, typeof enUS>([
    ['en-US', enUS],
    ['es-ES', esMX]
]);
