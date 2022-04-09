import type { REST } from '@discordjs/rest';
import type { Command, CommandOptions, Args, Awaitable, ChatInputCommandContext, AliasPiece } from '@sapphire/framework';
import type { CommandInteraction } from 'discord.js';
import type { Endpoints } from '@octokit/types';

declare module '@sapphire/pieces' {
    interface Container {
        rest: REST;
    }
}

declare module '@sapphire/framework' {
    declare class Command<PreParseReturn = Args, O extends Command.Options = Command.Options> extends AliasPiece<O> {
        public chatInputRun?(interaction: CommandInteraction, context: ChatInputCommandContext, args?: unknown): Awaitable<unknown>;
    }
}

declare module '@foxxie/env' {
    interface Env {
        CLIENT_VERSION: `${number}.${number}.${number}`;

        DISCORD_TOKEN: string;
        GUILD_IDS: string;

        CELESTIA_ENABLED: BooleanString;
        SAELEM_ENABLED: BooleanString;
        STARDROP_ENABLED: BooleanString;

        CRYPTOCOMPARE_TOKEN: string;
        GITHUB_TOKEN: string;
        WOLFRAM_TOKEN: string;
    }
}
