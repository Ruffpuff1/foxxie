import { cast } from '@ruffpuff/utilities';
import { isFunction, isNumber, isPrimitive } from '@sapphire/utilities';
import { Collection } from 'discord.js';
import { ColumnOptions, ColumnType, getMetadataArgsStorage } from 'typeorm';
import type { GuildEntity } from '../entities/Guild/GuildEntity';
import { NonEmptyArray, SchemaGroup } from './SchemaGroup';
import { ConfigurableKeyValueOptions, SchemaKey } from './SchemaKey';

export const configurableKeys = new Collection<string, SchemaKey>();
export const configurableGroups = new SchemaGroup();

export function ConfigurableKey(options: ConfigurableKeyOptions): PropertyDecorator {
    return (target, property) => {
        const storage = getMetadataArgsStorage();
        const column = storage.columns.find(c => c.target === target.constructor && c.propertyName === cast<string>(property));
        if (!column) throw new Error('Cannot find the metadata column.');

        const name = cast<keyof GuildEntity>(options.name ?? column.options.name);
        if (typeof name === 'undefined') throw new TypeError('The option "name" must be specified.');

        const isArray = options.array ?? column.options.array ?? false;
        const isInclusive = options.inclusive ?? true;
        const minimum = options.minimum ?? null;
        const maximum = options.maximum ?? hydrateLength(column.options.length);
        const type = options.type?.toLowerCase() ?? hydrateType(column.options.type!);
        const df = options.default ?? getDefault(column.options, isArray, minimum);
        const isDashboardOnly = options.dashboardOnly ?? false;
        const value = new SchemaKey({
            target: target.constructor,
            property: cast<keyof GuildEntity>(property),
            ...options,
            array: isArray,
            default: df,
            inclusive: isInclusive,
            maximum,
            minimum,
            name,
            type,
            dashboardOnly: isDashboardOnly
        });

        configurableKeys.set(cast<keyof GuildEntity>(property), value);
        value.parent = configurableGroups.add(cast<NonEmptyArray<string>>(name.split('.')), value);
    };
}

function getDefault(options: ColumnOptions, array: boolean, minimum: number | null) {
    if (isPrimitive(options.default)) return options.default;
    if (array) return [];
    if (isNumber(minimum)) return minimum;
    if (options.nullable) return null;
    if (isFunction(options.default) && options.default() === "'[]'::JSONB") return [];
    throw new TypeError(`The default value for the column '${options.name}' cannot be obtained automatically.`);
}

function hydrateLength(length: string | number | undefined) {
    if (typeof length === 'string') return Number(length);
    if (typeof length === 'number') return length;
    return null;
}

// eslint-disable-next-line complexity
function hydrateType(type: ColumnType) {
    switch (type) {
        case 'number':
        case 'bigint':
        case 'boolean':
        case 'float':
        case 'jsonb':
        case 'string': {
            return type;
        }

        case 'long':
        case 'int2':
        case 'integer':
        case 'int4':
        case 'int8':
        case 'int64':
        case 'unsigned big int':
        case 'tinyint':
        case 'smallint':
        case 'mediumint':
        case 'int': {
            return 'integer';
        }

        case 'float4':
        case 'float8':
        case 'smallmoney':
        case 'money':
        case 'real':
        case 'numeric':
        case 'double precision':
        case 'double': {
            return 'number';
        }

        case 'text':
        case 'nvarchar':
        case 'national varchar':
        case 'varchar':
        case 'varchar2':
        case 'nvarchar2':
        case 'shorttext':
        case 'character varying':
        case 'varying character':
        case 'char varying': {
            return 'string';
        }

        case 'bool': {
            return 'boolean';
        }

        case 'smalldatetime':
        case 'date':
        case 'interval year to month':
        case 'interval day to second':
        case 'interval':
        case 'year':
        case 'datetime':
        case 'datetime2':
        case 'time':
        case 'time with time zone':
        case 'time without time zone':
        case 'timestamp':
        case 'timestamp without time zone':
        case 'timestamp with time zone':
        case 'timestamp with local time zone': {
            return 'date';
        }

        case 'character':
        case 'native character':
        case 'char':
        case 'nchar':
        case 'national char': {
            return 'character';
        }

        default: {
            throw new Error(`Unsupported type ${type}`);
        }
    }
}

type OptionalKeys = 'name' | 'type' | 'inclusive' | 'maximum' | 'minimum' | 'array' | 'default' | 'dashboardOnly';
type ConfigurableKeyOptions = Omit<ConfigurableKeyValueOptions, 'target' | 'property' | OptionalKeys> &
    Partial<Pick<ConfigurableKeyValueOptions, OptionalKeys>>;
