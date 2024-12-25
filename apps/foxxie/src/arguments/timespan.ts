import { FoxxieArgument } from '#lib/structures';
import { resolveTimeSpan } from '#utils/resolvers';

export class UserArgument extends FoxxieArgument<number> {
	public override async handle(...[parameter, context]: FoxxieArgument.HandleArgs<number>) {
		return resolveTimeSpan(parameter, context);
	}
}
