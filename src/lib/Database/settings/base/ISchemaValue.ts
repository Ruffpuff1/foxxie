import { ReadonlyGuildData, SchemaGroup } from '#lib/database';
import type { TFunction } from '@sapphire/plugin-i18next';

export interface ISchemaValue {
	readonly type: string;
	readonly name: string;
	readonly dashboardOnly: boolean;
	readonly parent: SchemaGroup | null;
	display(settings: ReadonlyGuildData, language: TFunction): string;
}
