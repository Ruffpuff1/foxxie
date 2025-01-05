import { MemberNote } from '@prisma/client';
import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/pieces';
import { LanguageKeys } from '#lib/i18n';
import { FTFunction } from '#lib/types';
import { bold } from 'discord.js';

export class Note {
	public authorId!: string;

	public createdAt!: Date;

	public guildId!: string;

	public id!: number;

	public reason!: null | string;

	public userId!: string;

	public constructor(data: MemberNote) {
		Object.assign(this, data);
	}

	public display(t: FTFunction, index: number) {
		const name = this.author?.username || t(LanguageKeys.Globals.Unknown);
		return [`${bold(t(LanguageKeys.Globals.NumberFormat, { value: index + 1 }))}.`, this.reason, `- **${name}**`].join(' ');
	}

	public fetchAuthor() {
		return resolveToNull(container.client.users.fetch(this.authorId));
	}

	private get author() {
		return container.client.users.cache.get(this.authorId);
	}
}
