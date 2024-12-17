import type { Awaitable } from '@sapphire/utilities';
import type { Guild } from 'discord.js';

import { AliasPiece, ArgumentError, UserError } from '@sapphire/framework';
import { Result } from '@sapphire/result';
import { ReadonlyGuildData, SchemaKey } from '#lib/database';
import { LanguageKeys, translate } from '#lib/i18n';
import { FoxxieArgs } from '#lib/Structures/commands/FoxxieArgs';
import { FTFunction, TypedFT } from '#lib/types';

export type AsyncSerializerResult<T> = Promise<Result<T, Error>>;
export type SerializerResult<T> = Result<T, Error>;

export abstract class Serializer<T> extends AliasPiece {
	/**
	 * Check if two entries are equals.
	 * @param left The left value to check against.
	 * @param right The right value to check against.
	 */
	public equals(left: T, right: T): boolean {
		return left === right;
	}

	/**
	 * Check whether or not the value is valid.
	 * @param value The value to check.
	 */
	public abstract isValid(value: T, context: Serializer.UpdateContext): Awaitable<boolean>;

	/**
	 * Resolves a string into a value.
	 * @param value The value to parsed.
	 * @param context The context for the key.
	 */
	public abstract parse(args: Serializer.Args, context: Serializer.UpdateContext): AsyncSerializerResult<T> | SerializerResult<T>;

	/**
	 * The stringify method to be overwritten in actual Serializers
	 * @param data The data to stringify
	 * @param guild The guild given for context in this call
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public stringify(data: Readonly<T>, _context: Serializer.UpdateContext): string {
		return String(data);
	}

	/**
	 * Returns an erroneous result.
	 * @param error The message of the error.
	 */
	protected error(error: string): SerializerResult<T> {
		return Result.err(new Error(error));
	}

	protected errorFromArgument(args: Serializer.Args, error: UserError): SerializerResult<T>;

	/**
	 * Returns an erroneous result given an ArgumentError.
	 * @param args The Args parser.
	 * @param error The error returned by the Argument.
	 */
	protected errorFromArgument<E>(args: Serializer.Args, error: ArgumentError<E>): SerializerResult<T>;

	protected errorFromArgument<E>(args: Serializer.Args, error: ArgumentError<E> | UserError): SerializerResult<T> {
		const argument = error instanceof ArgumentError ? error.argument.name : 'Unknown';
		const identifier = translate(error.identifier);
		return this.error(args.t(identifier as TypedFT<unknown, string>, { ...error, ...(error.context as object), argument }));
	}

	/**
	 * Check the boundaries of a key's minimum or maximum.
	 * @param length The value to check
	 * @param entry The schema entry that manages the key
	 * @param language The language that is used for this context
	 */
	protected minOrMax(value: T, length: number, { entry: { inclusive, maximum, minimum, name }, t }: Serializer.UpdateContext): SerializerResult<T> {
		if (minimum !== null && maximum !== null) {
			if ((length >= minimum && length <= maximum && inclusive) || (length > minimum && length < maximum && !inclusive)) {
				return this.ok(value);
			}

			if (minimum === maximum) {
				return this.error(
					t(inclusive ? LanguageKeys.Serializers.MinMaxExactlyInclusive : LanguageKeys.Serializers.MinMaxExactlyExclusive, {
						min: minimum,
						name
					})
				);
			}

			return this.error(
				t(inclusive ? LanguageKeys.Serializers.MinMaxBothInclusive : LanguageKeys.Serializers.MinMaxBothExclusive, {
					max: maximum,
					min: minimum,
					name
				})
			);
		}

		if (minimum !== null) {
			if ((length >= minimum && inclusive) || (length > minimum && !inclusive)) {
				return this.ok(value);
			}

			return this.error(
				t(inclusive ? LanguageKeys.Serializers.MinMaxMinInclusive : LanguageKeys.Serializers.MinMaxMinExclusive, {
					min: minimum,
					name
				})
			);
		}

		if (maximum !== null) {
			if ((length <= maximum && inclusive) || (length < maximum && !inclusive)) {
				return this.ok(value);
			}

			return this.error(
				t(inclusive ? LanguageKeys.Serializers.MinMaxMaxInclusive : LanguageKeys.Serializers.MinMaxMaxExclusive, {
					max: maximum,
					name
				})
			);
		}

		return this.ok(value);
	}

	/**
	 * Returns a successful result.
	 * @param value The value to return.
	 */
	protected ok<T>(value: T): SerializerResult<T> {
		return Result.ok(value);
	}

	/**
	 * Returns a SerializerResult<T> from a Result<T, UserError>.
	 * @param args The Args parser.
	 * @param result The result to handle.
	 */
	protected result(args: Serializer.Args, result: Result<T, UserError>): SerializerResult<T> {
		return result.mapErrInto((error) => this.errorFromArgument(args, error));
	}
}

export namespace Serializer {
	export type Args = FoxxieArgs;
	export type Name =
		| 'boolean'
		| 'categoryOrTextChannel'
		| 'command'
		| 'commandAutoDelete'
		| 'commandMatch'
		| 'disabledCommandChannel'
		| 'emoji'
		| 'float'
		| 'guild'
		| 'guildCategoryChannel'
		| 'guildTextChannel'
		| 'guildVoiceChannel'
		| 'integer'
		| 'invite'
		| 'language'
		| 'notAllowed'
		| 'number'
		| 'permissionNode'
		| 'reactionRole'
		| 'role'
		| 'sendableChannel'
		| 'snowflake'
		| 'stickyRole'
		| 'string'
		| 'timespan'
		| 'uniqueRoleSet'
		| 'url'
		| 'user'
		| 'word';
	export type Options = AliasPiece.Options;

	export type UpdateContext = SerializerUpdateContext;
}

export interface SerializerUpdateContext {
	entity: ReadonlyGuildData;
	entry: SchemaKey;
	guild: Guild;
	t: FTFunction;
}
