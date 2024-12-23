import { envParseBoolean } from '@skyra/env-utilities';
import { RedisManager } from '#lib/structures';
import { GuildMessage } from '#lib/types';
import { Awaitable } from 'discord.js';

import { FoxxieCommand } from './FoxxieCommand.js';

export class AudioCommand extends FoxxieCommand {
	public constructor(context: FoxxieCommand.LoaderContext, options: AudioCommand.Options) {
		super(context, {
			...options,
			enabled: envParseBoolean('AUDIO_ENABLED', false)
		});
	}

	public override messageRun(...[]: AudioCommand.MessageRunArgs): Awaitable<unknown> {
		throw new Error('Missing command implementaion');
	}

	protected get redis(): RedisManager {
		return this.container.redis!;
	}
}

export namespace AudioCommand {
	export type Args = FoxxieCommand.Args;
	export type MessageRunArgs = [message: GuildMessage, args: Args, context: FoxxieCommand.Context];
	export type Options = FoxxieCommand.Options;
}
