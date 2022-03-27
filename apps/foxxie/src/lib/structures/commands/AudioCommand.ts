import { EnvParse } from '@foxxie/env';
import type { PieceContext } from '@sapphire/framework';
import type { RedisManager } from '../managers';
import { FoxxieCommand } from './FoxxieCommand';

export class AudioCommand extends FoxxieCommand {
    public constructor(context: PieceContext, options: AudioCommand.Options) {
        super(context, {
            ...options,
            enabled: EnvParse.boolean('AUDIO_ENABLED'),
            allowedGuilds: EnvParse.array('AUDIO_ALLOWED_GUILDS')
        });
    }

    protected get redis(): RedisManager {
        return this.container.redis!;
    }
}

// eslint-disable-next-line no-redeclare
export namespace AudioCommand {
    export type Options = FoxxieCommand.Options;
    export type Args = FoxxieCommand.Args;
}
