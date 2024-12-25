import type { User } from 'discord.js';

import { FoxxieArgument } from '#lib/structures';
import { resolveUsername } from '#utils/resolvers';

export class UserArgument extends FoxxieArgument<User> {
	public async handle(...[parameter, context]: FoxxieArgument.HandleArgs<User>) {
		return resolveUsername(parameter, context.message.guild!);
	}
}
