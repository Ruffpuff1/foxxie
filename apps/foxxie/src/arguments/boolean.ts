import { FoxxieArgument } from '#lib/structures';
import { resolveBoolean } from '#utils/resolvers';

export class UserArgument extends FoxxieArgument<boolean> {
	public override handle(...[parameter, context]: FoxxieArgument.HandleArgs<boolean>) {
		return resolveBoolean(parameter, context.args.t);
	}
}
