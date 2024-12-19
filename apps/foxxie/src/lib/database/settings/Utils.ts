import { UserError } from '@sapphire/framework';
import { GuildData, ISchemaValue, ReadonlyGuildData, SchemaGroup, SchemaKey } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieArgs } from '#lib/Structures/commands/FoxxieArgs';

export function isSchemaGroup(groupOrKey: ISchemaValue): groupOrKey is SchemaGroup {
	return groupOrKey.type === 'Group';
}

export function isSchemaKey(groupOrKey: ISchemaValue): groupOrKey is SchemaKey {
	return groupOrKey.type !== 'Group';
}

export async function remove(settings: ReadonlyGuildData, key: SchemaKey, args: FoxxieArgs): Promise<Partial<GuildData>> {
	const parsed = await key.parse(settings, args);
	if (key.array) {
		const { serializer } = key;
		const values = settings[key.property] as any[];

		const index = values.findIndex((value) => serializer.equals(value, parsed));
		if (index === -1) {
			throw new UserError({
				context: { path: key.name, value: key.stringify(settings, args.t, parsed) },
				identifier: LanguageKeys.Settings.Gateway.MissingValue
			});
		}

		return { [key.property]: values.toSpliced(index, 1) };
	}

	return { [key.property]: key.default };
}

export function reset(key: SchemaKey): Partial<GuildData> {
	return { [key.property]: key.default };
}

export async function set(settings: ReadonlyGuildData, key: SchemaKey, args: FoxxieArgs): Promise<Partial<GuildData>> {
	const parsed = await key.parse(settings, args);
	const { serializer } = key;

	if (key.array) {
		const values = settings[key.property] as any[];
		const index = values.findIndex((value) => serializer.equals(value, parsed));

		return index === -1 //
			? { [key.property]: values.concat(parsed) }
			: { [key.property]: values.with(index, parsed) };
	}

	if (serializer.equals(settings[key.property], parsed)) {
		throw new UserError({
			context: {
				path: key.name,
				value: key.stringify(settings, args.t, parsed)
			},
			identifier: LanguageKeys.Settings.Gateway.DuplicateValue
		});
	}

	return { [key.property]: parsed };
}
