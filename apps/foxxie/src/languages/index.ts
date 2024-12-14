import { Handler } from '#lib/I18n/structures/Handler';
import { LocaleString } from 'discord.js';

import { EnglishUnitedStatesHandler } from './en-US/constants.js';
import { SpanishLatinAmericaHandler } from './es-419/constants.js';

export const handlers = new Map<LocaleString, Handler>([
	['en-US', new EnglishUnitedStatesHandler()],
	['es-419', new SpanishLatinAmericaHandler()]
]);

export function getHandler(name: LocaleString): Handler {
	return handlers.get(name) ?? handlers.get('en-US')!;
}
