import type { PokemonSpriteTypes } from '#utils/APIs';
import type { ChatInputCommandContext } from '@sapphire/framework';
import type { TFunction } from '@sapphire/plugin-i18next';
import type { Days, Sunsigns } from '@skyra/saelem';
import type { CommandInteraction, Role } from 'discord.js';

export type ChatInputArgs<T = unknown> = [interaction: CommandInteraction, context: ChatInputCommandContext, args?: T extends CommandName ? CommandArgs<T> : unknown];

export enum CommandName {
    AnimalCrossing = 'animalcrossing',
    Color = 'color',
    Currency = 'currency',
    Donate = 'donate',
    Eval = 'eval',
    Github = 'github',
    Invite = 'invite',
    Owoify = 'owoify',
    Npm = 'npm',
    Pokemon = 'pokemon',
    Pride = 'pride',
    Setcolor = 'setcolor',
    StardewValley = 'stardewvalley',
    Stats = 'stats',
    Support = 'support',
    Wolfram = 'wolfram',
    Zodiac = 'zodiac'
}

interface BaseArgs {
    t: TFunction;
}

interface EphemeralArgs extends BaseArgs {
    ephemeral?: boolean;
}

interface EvalArgs extends BaseArgs {
    code: string;
    depth?: number;
    language?: string;
    'output-to'?: string;
    async?: boolean;
    'no-timeout'?: boolean;
    silent?: boolean;
    'show-hidden'?: boolean;
}

export interface PokemonArgs extends BaseArgs {
    dex: {
        pokemon: string;
        sprite?: PokemonSpriteTypes;
    };
    move: {
        move: string;
    };
}

export interface GithubArgs extends BaseArgs {
    user: {
        user: string;
    };
    repo: {
        owner: string;
        repo: string;
        number?: number;
    };
}

export interface NpmArgs extends EphemeralArgs {
    package: string;
}

export interface AnimalCrossingArgs extends BaseArgs {
    villager: {
        villager: string;
    };
}

export interface StardewValleyArgs extends BaseArgs {
    character: {
        villager: string;
    };
}

export interface PrideArgs extends EphemeralArgs {
    flag: 'agender' | 'asexual' | 'bisexual' | 'genderfluid' | 'lesbian' | 'nonbinary' | 'pansexual' | 'pride' | 'transgender';
    'guild-avatar'?: boolean;
}

export interface OwoifyArgs extends EphemeralArgs {
    text: string;
    mode?: 'owo' | 'uwu' | 'uvu';
}

export type CommandArgs<T extends CommandName> = T extends CommandName.Donate
    ? EphemeralArgs
    : T extends CommandName.Invite
    ? EphemeralArgs
    : T extends CommandName.Support
    ? EphemeralArgs
    : T extends CommandName.Color
    ? EphemeralArgs & { color: string }
    : T extends CommandName.Wolfram
    ? EphemeralArgs & { graphical?: boolean; query: string }
    : T extends CommandName.Zodiac
    ? EphemeralArgs & { day?: Days; sign: Sunsigns }
    : T extends CommandName.Eval
    ? EvalArgs
    : T extends CommandName.Pokemon
    ? PokemonArgs
    : T extends CommandName.Currency
    ? EphemeralArgs & { amount?: number; from: string; to: string }
    : T extends CommandName.Github
    ? GithubArgs
    : T extends CommandName.AnimalCrossing
    ? AnimalCrossingArgs
    : T extends CommandName.Pride
    ? PrideArgs
    : T extends CommandName.Setcolor
    ? BaseArgs & { role: Role; color: string; reason?: string }
    : T extends CommandName.Stats
    ? EphemeralArgs
    : T extends CommandName.StardewValley
    ? StardewValleyArgs
    : T extends CommandName.Owoify
    ? OwoifyArgs
    : T extends CommandName.Npm
    ? NpmArgs
    : never;
