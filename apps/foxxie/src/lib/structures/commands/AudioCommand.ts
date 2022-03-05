import { envParseArray, envParseBoolean } from '#lib/env';
import type { PieceContext } from '@sapphire/framework';
import type { RedisManager } from '../managers';
import { FoxxieCommand } from './FoxxieCommand';

export class AudioCommand extends FoxxieCommand {
    public constructor(context: PieceContext, options: AudioCommand.Options) {
        super(context, {
            ...options,
            enabled: envParseBoolean('AUDIO_ENABLED'),
            allowedGuilds: envParseArray('AUDIO_ALLOWED_GUILDS')
        });
    }

    protected get redis(): RedisManager {
        return this.container.redis!;
    }
}

export namespace AudioCommand {
    export type Options = FoxxieCommand.Options;
    export type Args = FoxxieCommand.Args;
}
