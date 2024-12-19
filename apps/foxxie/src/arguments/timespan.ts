import { Argument, ArgumentContext, ArgumentResult } from '@sapphire/framework';
import { resolveTimeSpan } from '#utils/resolvers';

export class UserArgument extends Argument<number> {
	public run(parameter: string, context: ArgumentContext): ArgumentResult<number> {
		const resolved = resolveTimeSpan(parameter, context);
		return resolved.isErr() ? this.error({ context, identifier: resolved.unwrapErr(), parameter }) : this.ok(resolved.unwrap());
	}
}
