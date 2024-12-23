import { ReadonlyGuildData, SettingsContext } from '#lib/database';
import { Collection, type Snowflake } from 'discord.js';

const cache = new Collection<Snowflake, SettingsContext>();

export function deleteSettingsContext(guildId: Snowflake) {
	cache.delete(guildId);
}

export function getSettingsContext(settings: ReadonlyGuildData): SettingsContext {
	return cache.ensure(settings.id, () => new SettingsContext(settings));
}

export function getSettingsContextByGuildId(guildId: Snowflake): null | SettingsContext {
	return cache.get(guildId) ?? null;
}

export function updateSettingsContext(settings: ReadonlyGuildData, data: Partial<ReadonlyGuildData>): void {
	const existing = cache.get(settings.id);
	if (existing) {
		existing.update(settings, data);
	} else {
		const context = new SettingsContext(settings);
		cache.set(settings.id, context);
	}
}
