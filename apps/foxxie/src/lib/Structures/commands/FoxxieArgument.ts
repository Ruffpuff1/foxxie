import { Argument, ArgumentContext, Err, Identifiers, Ok } from '@sapphire/framework';
import { TypedFT, TypedT } from '#lib/types';
import { Awaitable } from 'discord.js';

export abstract class FoxxieArgument<T = unknown> extends Argument<T> {
	public abstract handle(parameter: string, context: ArgumentContext<T>): Awaitable<Err<Identifiers | TypedFT<any> | TypedT, any> | Ok<T, any>>;

	public async run(parameter: string, context: ArgumentContext<T>) {
		const handled = await this.handle(parameter, context);
		return handled.isErr() ? this.error({ context, identifier: handled.unwrapErr(), parameter }) : this.ok(handled.unwrap());
	}
}

export namespace FoxxieArgument {
	export type HandleArgs<T = unknown> = [parameter: string, context: ArgumentContext<T>];
}
