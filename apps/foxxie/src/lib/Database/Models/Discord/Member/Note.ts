import { memberNote } from '@prisma/client';
import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { TFunction } from '@sapphire/plugin-i18next';
import { LanguageKeys } from '#lib/i18n';
import { bold } from 'discord.js';

export class Note {
	public authorId!: string;

	public createdAt!: Date;

	public guildId!: string;

	public id!: number;

	public reason!: null | string;

	public userId!: string;

	public constructor(data: memberNote) {
		Object.assign(this, data);
	}

	public display(t: TFunction) {
		const name = this.author?.username || t(LanguageKeys.Globals.Unknown);
		return [`${bold(t(LanguageKeys.Globals.NumberFormat, { value: this.id }))}.`, this.reason, `- **${name}**`].join(' ');
	}

	public fetchAuthor() {
		return resolveToNull(container.client.users.fetch(this.authorId));
	}

	private get author() {
		return container.client.users.cache.get(this.authorId);
	}
}
