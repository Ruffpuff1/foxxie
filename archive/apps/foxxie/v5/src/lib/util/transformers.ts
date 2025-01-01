import type { TFunction } from '@sapphire/plugin-i18next';
import { DiscordAPIError, Guild, GuildMember, MessageEmbed, Permissions } from 'discord.js';
import { time, TimestampStyles } from '@discordjs/builders';
import { BrandingColors } from './constants';
import { PermissionFlagsBits } from 'discord-api-types/v9';
import { PokemonEnum } from '@favware/graphql-pokemon';
import { toTitleCase, UserOrMemberMentionRegex } from '@ruffpuff/utilities';
import type { FoxxieCommand } from '#lib/structures';
import { cleanMentions } from './util';
import * as GuildSettings from '#database/Keys';
import { TwemojiRegex } from '@sapphire/discord.js-utilities';
import { getCode, isLetterOrDigit, isWhiteSpace } from '@skyra/char';

export enum Pronouns {
    'he/him',
    'he/it',
    'he/she',
    'he/they',
    'it/its',
    'she/her',
    'she/it',
    'she/they',
    'they/it',
    'they/she',
    'they/them',
    'any pronouns',
    'other pronouns',
    'ask for pronouns',
    'use name'
}

type PronounKey =
    | typeof GuildSettings.Roles.Pronouns.HeHim
    | typeof GuildSettings.Roles.Pronouns.SheHer
    | typeof GuildSettings.Roles.Pronouns.TheyThem
    | typeof GuildSettings.Roles.Pronouns.ItIts;

const heHimRegex = /he|him/g;
const sheHerRegex = /she|her/g;
const theyThemRegex = /they|them/g;
const itItsRegex = /it|its/g;
const anyRegex = /any pronouns/g;

export function getPronounKey(key: string): PronounKey[] {
    const keys: PronounKey[] = [];

    if (heHimRegex.test(key) || anyRegex.test(key)) keys.push(GuildSettings.Roles.Pronouns.HeHim);
    if (sheHerRegex.test(key) || anyRegex.test(key)) keys.push(GuildSettings.Roles.Pronouns.SheHer);
    if (theyThemRegex.test(key) || anyRegex.test(key)) keys.push(GuildSettings.Roles.Pronouns.TheyThem);
    if (itItsRegex.test(key) || anyRegex.test(key)) keys.push(GuildSettings.Roles.Pronouns.ItIts);

    return keys;
}

/**
 * Transforms a pronoun integer into a string, or vice versa.
 * @param key Pronoun string, integer, or null.
 * @returns Pronoun string, integer, or null.
 */
export function pronouns(key: Pronouns | null): string | null | number {
    if (key === null) return null;
    return Pronouns[key];
}

/**
 * Formats a message url link.
 * @param guildId The Guildid of the message
 * @param channelId The channelId of the message
 * @param messageId The id of the message
 * @returns string
 */
export function messageLink<G extends string, C extends string, M extends string>(guildId: G, channelId: C, messageId: M): `https://discord.com/channels/${G}/${C}/${M}` {
    return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
}

/**
 * Parses a Bulbapedia-like URL to be properly embeddable on Discord
 * @param url URL to parse
 */
export const bulbapediaURL = (url: string) => url.replace(/[ ]/g, '_').replace(/\(/g, '%28').replace(/\)/g, '%29');

/**
 * Formats an initial giveaway embed.
 * @param guild The guild in which the giveaway is hosted.
 * @param author The guild member who started the giveaway.
 * @param formattedEmoji The formattedEmoji for the embed.
 * @param t The guild's TFunction.
 * @param Options The raw giveaway options.
 * @returns The formatted {@link MessageEmbed}.
 */
export function formatInitialGiveawayEmbed(
    guild: Guild,
    author: GuildMember,
    formattedEmoji: string,
    t: TFunction,
    { requiredRole = null, endsAt, minimumWinners = 1, title, authorId, startedAt = new Date() }: RawGiveawayOptions
): MessageEmbed {
    const description: string[] = [
        t('listeners/events:giveawayEmbedEndsAt', {
            time: time(Math.round(endsAt?.getTime() / 1000), TimestampStyles.RelativeTime)
        }),
        t('listeners/events:giveawayEmbedHostedBy', {
            author: `<@${authorId}>`
        })
    ];

    if (requiredRole) {
        const role = guild?.roles.cache.get(requiredRole) ?? null;
        if (role)
            description.push(
                t('listeners/events:giveawayEmbedRequiredRole', {
                    role: role.toString()
                })
            );
    }

    if (minimumWinners !== 1)
        description.push(
            t('listeners/events:giveawayEmbedNumberOfWinners', {
                count: minimumWinners
            })
        );
    description.push(
        t('listeners/events:giveawayEmbedReactEmoji', {
            emoji: formattedEmoji.replace(/[<>]/g, '')
        })
    );

    return new MessageEmbed()
        .setColor(guild?.me?.displayColor || BrandingColors.Primary)
        .setAuthor({
            name: author.user.tag,
            iconURL: author?.displayAvatarURL({ dynamic: true })
        })
        .setTitle(title)
        .setTimestamp(startedAt)
        .setDescription(description.join('\n'));
}

interface RawGiveawayOptions {
    requiredRole?: string | null;
    endsAt: Date;
    minimumWinners?: number;
    authorId: string;
    title: string;
    startedAt?: Date;
}

/**
 * Returns a simplified permissions array from the given entry.
 * @param bits Permission resolvable bitfield or Array of permission keys.
 * @returns {string[]} Simplified Array of permission keys.
 */
export function toPermissionArray(bits: bigint | string[]): string[] {
    if (Array.isArray(bits)) return bits.includes('ADMINISTRATOR') ? ['ADMINISTRATOR'] : bits;

    const bitfield = new Permissions(bits);
    const isAdmin = bitfield.has(PermissionFlagsBits.Administrator);

    return isAdmin ? ['ADMINISTRATOR'] : bitfield.toArray();
}

/**
 * Transforms a Discord APi Error code into a usable error language key.
 * @param error {@link DiscordAPIError} The Discord API error.
 * @returns The i18next key for the error message.
 */
export function handleDiscordAPIError(error: Error): {
    identifier: string;
    message: string;
} {
    if (error instanceof DiscordAPIError) {
        const identifier = '';

        switch (error.code) {
            default:
                return { identifier, message: error.message };
        }
    } else {
        return { identifier: '', message: error.message };
    }
}

/**
 * Cleans a member of {@link PokemonEnum} returning a formatted string.
 * @param pokemon The pokemon enum member to clean.
 * @returns The cleaned pokemon name.
 */
export function cleanPokemonName(pokemon: PokemonEnum): string {
    switch (pokemon.toLowerCase().replace(/[\s-]/g, '')) {
        case PokemonEnum.Pikachustarter:
            return "Pikachu (Let's Go)";
        case PokemonEnum.Eeveestarter:
            return "Eevee (Let's Go)";
        default: {
            return toTitleCase(pokemon);
        }
    }
}

export function colorLink(hex: string): string {
    return `https://imagecolorpicker.com/color-code/${hex.replace(/#/, '')}`;
}

/**
 * Retrieve a cleaned prefix from a given command arg context.
 * @param args The FoxxieCommand args of the command
 * @returns The cleaned prefix used.
 */
export function getCommandPrefix(args: FoxxieCommand.Args): string {
    const { commandContext: context, message } = args;
    return (context.prefix instanceof RegExp && !context.commandPrefix.endsWith(' ')) || UserOrMemberMentionRegex.test(context.commandPrefix)
        ? `${cleanMentions(message.guild!, context.commandPrefix)} `
        : cleanMentions(message.guild!, context.commandPrefix);
}

export function sanitizeInput(input: string): string {
    return [...input]
        .map(c => {
            if (TwemojiRegex.test(c)) return c;

            const code = getCode(c);

            return isLetterOrDigit(code) || isWhiteSpace(code) ? c : '';
        })
        .join('');
}
