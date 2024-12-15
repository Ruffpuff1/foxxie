import type { TextChannel } from 'discord.js';

import { Argument, ArgumentContext } from '@sapphire/framework';

export class UserArgument extends Argument<TextChannel> {
	public run(argument: string, context: ArgumentContext<TextChannel>) {
		return this.channelName.run(argument, { ...context, filter: (channel: TextChannel) => channel.isSendable() });
	}

	public get channelName(): Argument<TextChannel> {
		return this.store.get('channelName') as Argument<TextChannel>;
	}
}
