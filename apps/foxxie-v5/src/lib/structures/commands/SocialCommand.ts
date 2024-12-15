import { isDev } from '@ruffpuff/utilities';
import { CommandOptionsRunTypeEnum, PieceContext } from '@sapphire/framework';
import { FoxxieCommand } from './FoxxieCommand';

export abstract class SocialCommand extends FoxxieCommand {
    protected constructor(context: PieceContext, options: SocialCommand.Options) {
        super(context, {
            runIn: [CommandOptionsRunTypeEnum.GuildAny],
            ...options,
            enabled: !isDev()
        });
    }
}

export namespace SocialCommand {
    export type Options = FoxxieCommand.Options;
    export type Args = FoxxieCommand.Args;
    export type Context = FoxxieCommand.Context;
}
