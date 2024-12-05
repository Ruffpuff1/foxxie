import { Argument, ArgumentContext, ArgumentResult } from '@sapphire/framework';
import type { GuildMember, Message, User } from 'discord.js';

export class UserArgument extends Argument<User> {
	public async run(parameter: string, context: ArgumentContext<User>): Promise<ArgumentResult<User>> {
		const { message } = context;
		if (!message.guild) return this.user.run(parameter, context);

		const member = await this.resolveMember(parameter, message);
		if (!member) return this.user.run(parameter, context);

		return this.ok(member.user);
	}

	private async resolveMember(query: string, message: Message): Promise<GuildMember | null> {
		try {
			const member = await message.guild!.members.fetch({ query });
			return member.first()!;
		} catch {
			return null;
		}
	}

	public get user() {
		return this.store.get('user') as Argument<User>;
	}
}
