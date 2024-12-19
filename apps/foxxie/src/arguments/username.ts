import type { User } from 'discord.js';

import { Argument, ArgumentContext, ArgumentResult } from '@sapphire/framework';
import { resolveUsername } from '#utils/resolvers';

export class UserArgument extends Argument<User> {
	public async run(parameter: string, context: ArgumentContext<User>): Promise<ArgumentResult<User>> {
		const resolved = await resolveUsername(parameter, context.message.guild!);
		return resolved.isErr() ? this.error({ context, identifier: resolved.unwrapErr(), parameter }) : this.ok(resolved.unwrap());
	}
}
