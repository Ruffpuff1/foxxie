import { LanguageKeys } from '#lib/I18n/index';
import { memberNote } from '@prisma/client';
import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { bold } from 'discord.js';
import { TFunction } from 'i18next';

export class Note {
    id: number;

    createdAt: Date;

    guildId: string;

    userId: string;

    authorId: string;

    reason: string | null;

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
