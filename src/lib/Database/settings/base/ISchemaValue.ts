import type { TFunction } from '@sapphire/plugin-i18next';
import { SchemaGroup } from '../schema/SchemaGroup';
import { ReadonlyGuildData } from '../types';

export interface ISchemaValue {
	readonly type: string;
	readonly name: string;
	readonly dashboardOnly: boolean;
	readonly parent: SchemaGroup | null;
	display(settings: ReadonlyGuildData, language: TFunction): string;
}
