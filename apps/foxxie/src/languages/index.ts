import { Handler } from '#lib/I18n/structures/Handler';
import { LocaleString } from 'discord.js';

import { SpanishLatinAmericaHandler } from './es-419/constants.js';

export const handlers = new Map<LocaleString, Handler>([
	//
	['es-419', new SpanishLatinAmericaHandler()]
]);

export function getHandler(name: LocaleString): Handler {
	return handlers.get(name) ?? handlers.get('es-419')!;
}
