import { container } from '@sapphire/framework';
import type { TFunction } from '@foxxie/i18n';
import type { User } from 'discord.js';
import { LanguageKeys } from '#lib/i18n';
import { BaseEntity, Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { toTitleCase } from '@ruffpuff/utilities';

@Entity('warning', { schema: 'public' })
export class WarningEntity extends BaseEntity {
    @ObjectIdColumn()
    public _id!: string;

    @PrimaryColumn({ length: 19 })
    public id!: string;

    @PrimaryColumn('varchar', { length: 19 })
    public guildId: string | null = null;

    @Column('varchar', { default: process.env.CLIENT_ID })
    public author: string = process.env.CLIENT_ID as string;

    @Column('varchar', { nullable: true, length: 2000, default: () => 'null' })
    public reason: string | null = null;

    @Column('timestamp without time zone', {
        nullable: true,
        default: () => 'null'
    })
    public createdAt: Date | null = null;

    public display(index: number, t: TFunction) {
        const name = this._author?.tag || toTitleCase(t(LanguageKeys.Globals.Unknown));
        return [`${t(LanguageKeys.Globals.NumberFormat, { value: index + 1 })}.`, this.reason, `- **${name}**`].join(' ');
    }

    private get _author(): User | null {
        return container.client.users.cache.get(this.author!) ?? null;
    }
}
