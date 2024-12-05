import { ConsoleState, EventArgs, FoxxieEvents } from '#lib/types';
import { Listener } from '@sapphire/framework';
import { blue } from 'colorette';

export class UserListener extends Listener<FoxxieEvents.MessageCommandLogging> {
	public run(...[msg, command]: EventArgs<FoxxieEvents.MessageCommandLogging>): void {
		const shard = msg.guild ? msg.guild.shardId : 0;

		this.container.client.emit(
			FoxxieEvents.Console,
			ConsoleState.Debug,
			[
				`[${blue(shard)}]`,
				`-`,
				`${blue(command.name)}`,
				msg.author.username,
				`[${blue(msg.author.id)}]`,
				msg.guild!.name,
				`[${blue(msg.guild!.id)}]`
			].join(' ')
		);
	}
}
