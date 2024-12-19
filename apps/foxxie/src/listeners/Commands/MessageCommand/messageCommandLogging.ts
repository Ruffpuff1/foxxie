import { Listener } from '@sapphire/framework';
import { isNullish } from '@sapphire/utilities';
import { EventArgs, FoxxieEvents } from '#lib/types';
import { blue } from 'colorette';

export class UserListener extends Listener<FoxxieEvents.MessageCommandLogging> {
	public run(...[msg, command]: EventArgs<FoxxieEvents.MessageCommandLogging>): void {
		const shard = msg.guild ? msg.guild.shardId : 0;

		this.container.logger.debug(
			[
				`[${blue(shard)}]`,
				`-`,
				`${blue(command.name)}`,
				msg.author.username,
				`[${blue(msg.author.id)}]`,
				msg.guild ? msg.guild.name : null,
				msg.guild ? `[${blue(msg.guild.id)}]` : null
			]
				.filter((a) => !isNullish(a))
				.join(' ')
		);
	}
}
