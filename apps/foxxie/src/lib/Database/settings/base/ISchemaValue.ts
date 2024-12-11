import type { TFunction } from '@sapphire/plugin-i18next';

import { ReadonlyGuildData, SchemaGroup } from '#lib/database';

export interface ISchemaValue {
	readonly dashboardOnly: boolean;
	display(settings: ReadonlyGuildData, language: TFunction): string;
	readonly name: string;
	readonly parent: null | SchemaGroup;
	readonly type: string;
}
