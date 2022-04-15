import { LanguageKeys } from '#lib/i18n';
import type { Warning } from '@prisma/client';
import { toTitleCase } from '@ruffpuff/ts';
import { container } from '@sapphire/framework';
import type { User } from 'discord.js';
import type { TFunction } from 'i18next';

export class WarningModel {
    public userId: string;

    public guildId: string;

    public authorId: string;

    public reason: string | null;

    public createdAt: Date;

    public constructor(data?: Partial<Warning>) {
        if (data) {
            for (const key of this.keys()) {
                // @ts-expect-error keys not allowed
                this[key] = data[key as keyof Warning];
            }
        }
    }

    public display(index: number, t: TFunction): string {
        const name = this.author?.tag || toTitleCase(t(LanguageKeys.Globals.Unknown));
        return [`${t(LanguageKeys.Globals.NumberFormat, { value: index + 1 })}.`, this.reason, `- **${name}**`].join(' ');
    }

    public async save() {
        const { userId, guildId, authorId, reason, createdAt } = this;

        const created = await container.prisma.warning.create({
            data: {
                userId,
                guildId,
                authorId,
                reason,
                createdAt
            }
        });

        return created;
    }

    private keys() {
        return Object.keys(this);
    }

    private get author(): User | null {
        return container.client.users.cache.get(this.authorId) ?? null;
    }
}
