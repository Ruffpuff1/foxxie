import type { FTFunction, TypedT } from '#lib/types';

import { container } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { GuildDataKey, ISchemaValue, ReadonlyGuildData, SchemaGroup, Serializer } from '#lib/database';
import { LanguageKeys } from '#lib/i18n';
import { FoxxieArgs } from '#lib/Structures/commands/FoxxieArgs';
import { resolveGuild } from '#utils/functions';

export type ConfigurableKeyValueOptions = { description?: TypedT<string> } & Pick<
	SchemaKey,
	'array' | 'dashboardOnly' | 'default' | 'inclusive' | 'key' | 'maximum' | 'minimum' | 'name' | 'property' | 'type'
>;

export class SchemaKey<K extends GuildDataKey = GuildDataKey> implements ISchemaValue {
	/**
	 * Whether or not this accepts multiple values.
	 */
	public readonly array: boolean;

	/**
	 * Whether this key should only be configurable on the dashboard
	 */
	public readonly dashboardOnly: boolean;

	/**
	 * The default value for this key.
	 */
	public readonly default: unknown;

	/**
	 * The i18n key for the configuration key.
	 */
	public readonly description: TypedT<string>;

	/**
	 * Whether or not the range checks are inclusive.
	 */
	public readonly inclusive: boolean;

	/**
	 * The key that identifies this configuration key from the parent group.
	 */
	public readonly key: string;

	/**
	 * The maximum value for the configuration key.
	 */
	public readonly maximum: null | number;

	/**
	 * The minimum value for the configuration key.
	 */
	public readonly minimum: null | number;

	/**
	 * The visible name of the configuration key.
	 */
	public readonly name: string;

	/**
	 * The parent group that holds this key.
	 */
	public parent: null | SchemaGroup = null;

	/**
	 * The property from the Prisma entity.
	 */
	public readonly property: K;

	/**
	 * The type of the value this property accepts.
	 */
	public readonly type: Serializer.Name;

	public constructor(options: ConfigurableKeyValueOptions) {
		this.key = options.key;
		this.description = options.description || LanguageKeys.Globals.None;
		this.maximum = options.maximum;
		this.minimum = options.minimum;
		this.inclusive = options.inclusive ?? false;
		this.name = options.name;
		this.property = options.property as K;
		this.type = options.type;
		this.array = options.array;
		this.default = options.default;
		this.dashboardOnly = options.dashboardOnly ?? false;
	}

	public display(settings: ReadonlyGuildData, t: FTFunction): string {
		const { serializer } = this;
		const context = this.getContext(settings, t);

		if (this.array) {
			const values = settings[this.property] as readonly any[];
			return isNullish(values) || values.length === 0
				? 'None'
				: `[ ${values.map((value) => serializer.stringify(value, context)).join(' | ')} ]`;
		}

		const value = settings[this.property];
		return isNullish(value) ? t(LanguageKeys.Commands.Configuration.Conf.SettingNotSet) : serializer.stringify(value, context);
	}

	public getContext(settings: ReadonlyGuildData, language: FTFunction): Serializer.UpdateContext {
		return {
			entity: settings,
			entry: this,
			guild: resolveGuild(settings.id),
			t: language
		} satisfies Serializer.UpdateContext;
	}

	public async parse(settings: ReadonlyGuildData, args: FoxxieArgs): Promise<ReadonlyGuildData[K]> {
		const { serializer } = this;
		const context = this.getContext(settings, args.t);

		const result = await serializer.parse(args, context);
		return result.match({
			err: (error) => {
				throw error.message;
			},
			ok: (value) => value
		});
	}

	public stringify(settings: ReadonlyGuildData, t: FTFunction, value: ReadonlyGuildData[K]): string {
		const { serializer } = this;
		const context = this.getContext(settings, t);
		return serializer.stringify(value, context);
	}

	public get serializer(): Serializer<ReadonlyGuildData[K]> {
		const value = container.stores.get('serializers').get(this.type);
		if (typeof value === 'undefined') throw new Error(`The serializer for '${this.type}' does not exist.`);
		return value as unknown as Serializer<ReadonlyGuildData[K]>;
	}
}
