import { LanguageKeys } from '#lib/I18n';
import { cast, toTitleCase } from '@ruffpuff/utilities';
import { NonNullObject, isNullish } from '@sapphire/utilities';
import type { GuildEntity } from '../entities/Guild/GuildEntity';
import type { ISchemaValue, SchemaGroup } from './SchemaGroup';
import { TFunction } from 'i18next';
import { CustomGet } from '#lib/Types';
import { FoxxieArgs } from '#lib/Structures/commands/FoxxieArgs';
import { Serializer, SerializerUpdateContext } from '#lib/Container/Stores/Serializers/Serializer';

export class SchemaKey<K extends keyof GuildEntity = keyof GuildEntity> implements ISchemaValue {
    /**
     * The i18n key for the configuration key.
     */
    public description: CustomGet<string, string>;

    /**
     * The maximum value for the configuration key.
     */
    public maximum: number | null;

    /**
     * The minimum value for the configuration key.
     */
    public minimum: number | null;

    /**
     * Whether or not the range checks are inclusive.
     */
    public inclusive: boolean;

    /**
     * The visible name of the configuration key.
     */
    public name: string;

    /**
     * The property from the TypeORM entity.
     */
    public property: K;

    /**
     * The class this targets.
     */
    public target: NonNullObject;

    /**
     * The type of the value this property accepts.
     */
    public type: string;

    /**
     * Whether or not this accepts multiple values.
     */
    public array: boolean;

    /**
     * The default value for this key.
     */
    public default: unknown;

    /**
     * Whether this key should only be configurable on the dashboard
     */
    public dashboardOnly: boolean;

    /**
     * The parent group that holds this key.
     */
    public parent: SchemaGroup | null = null;

    public constructor(options: ConfigurableKeyValueOptions) {
        this.description = options.description;
        this.maximum = options.maximum;
        this.minimum = options.minimum;
        this.inclusive = options.inclusive ?? false;
        this.name = options.name;
        this.property = cast<K>(options.property);
        this.target = options.target;
        this.type = options.type;
        this.array = options.array;
        this.default = options.default;
        this.dashboardOnly = options.dashboardOnly ?? false;
    }

    public async parse(settings: GuildEntity, args: FoxxieArgs): Promise<GuildEntity[K]> {
        const { serializer } = this;
        const context = this.getContext(settings, args.t);

        const result = await serializer.parse(args, context);
        if (result.success) return result.value;
        throw result.error.message;
    }

    public stringify(settings: GuildEntity, t: TFunction, value: GuildEntity[K]): string {
        const { serializer } = this;
        const context = this.getContext(settings, t);
        return serializer.stringify(value, context);
    }

    public display(settings: GuildEntity, t: TFunction): string {
        const { serializer } = this;
        const context = this.getContext(settings, t);

        if (this.array) {
            const values = cast<readonly any[]>(settings[this.property]);
            return isNullish(values) || values.length === 0
                ? toTitleCase(t(LanguageKeys.Globals.None))
                : `[ ${values.map(value => serializer.stringify(value, context)).join(' | ')} ]`;
        }

        const value = settings[this.property];
        return isNullish(value) ? t(LanguageKeys.Commands.Configuration.ConfNotSet) : serializer.stringify(value, context);
    }

    public getContext(settings: GuildEntity, language: TFunction): SerializerUpdateContext {
        const context: SerializerUpdateContext = {
            entity: settings,
            guild: settings.guild,
            t: language,
            entry: this
        };

        return context;
    }

    public get serializer(): Serializer<GuildEntity[K]> {
        const value = undefined; // container.serializers.get(this.type); FIX
        if (typeof value === 'undefined') throw new Error(`The serializer for '${this.type}' does not exist.`);
        return cast<Serializer<GuildEntity[K]>>(value);
    }
}

export type ConfigurableKeyValueOptions = Pick<
    SchemaKey,
    | 'description'
    | 'maximum'
    | 'minimum'
    | 'inclusive'
    | 'name'
    | 'property'
    | 'target'
    | 'type'
    | 'array'
    | 'default'
    | 'dashboardOnly'
>;
