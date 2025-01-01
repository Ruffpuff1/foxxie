import type { Snowflake } from 'discord.js';

import { FoxxieArgument } from '#lib/structures';
import { resolveSnowflake } from '#utils/resolvers';

export class UserArgument extends FoxxieArgument<Snowflake> {
	public override handle(...[parameter]: FoxxieArgument.HandleArgs<Snowflake>) {
		return resolveSnowflake(parameter);
	}
}
