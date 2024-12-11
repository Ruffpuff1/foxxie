import { Collection, Guild } from 'discord.js';
import { ReadonlyGuildData } from '../types.js';
import { Highlight, HighlightData } from '#lib/Database/Models/highlight';
import { writeSettings } from '../index.js';
import { container } from '@sapphire/framework';

export class HighlightManager {
	#cache = new Collection<string, Highlight>();

	#guild: Guild = null!;

	public constructor(settings: ReadonlyGuildData) {
		this.#guild = container.client.guilds.cache.get(settings.id)!;

		for (const highlight of settings.highlights) {
			const constructedHighlight = new Highlight(highlight);
			this.#cache.set(`${constructedHighlight.userId}_${constructedHighlight.word}`, constructedHighlight);
		}
	}

	public async insert(data: HighlightData) {
		const entity = new Highlight(data);
		this.#cache.set(`${entity.userId}_${entity.word}`, entity);

		await writeSettings(this.#guild, (settings) => ({ highlights: [...settings.highlights, data] }));
		return entity;
	}
}
