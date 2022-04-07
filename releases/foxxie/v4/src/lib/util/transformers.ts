import type { TFunction } from '@sapphire/plugin-i18next';
import type { GuildMember } from 'discord.js';
import type { FoxxieEmbed } from 'lib/discord';
import { languageKeys } from 'lib/i18n';
import { BrandingColors } from './constants';

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
 * Format an emoji url link.
 * @param emojiId The id of the emoji to steal.
 * @param animated Whether the emoji is animated or not.
 * @returns string - The Emoji link.
 */
export function emojiLink<I extends string>(emojiId: I, animated: boolean): string {
    return `https://cdn.discordapp.com/emojis/${emojiId}.${animated ? 'gif' : 'png'}`;
}

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

/**
 * Transforms a pronoun integer into a string, or vice versa.
 * @param key Pronoun string, integer, or null.
 * @returns Pronoun string, integer, or null.
 */
export function pronouns(key: Pronouns | null): string | null | number {
    if (key === null) return null;
    return Pronouns[key];
}

export function colorLink(hex: string): string {
    return `https://imagecolorpicker.com/color-code/${hex.replace(/#/, '')}`;
}

const enum AutomationMatches {
    Mention = '{MENTION}',
    Name = '{NAME}',
    Tag = '{TAG}',
    Discrim = '{DISCRIM}',
    Guild = '{GUILD}',
    Count = '{COUNT}',
    Position = '{POSITION}',
    CreatedAt = '{CREATEDAT}',
    JoinedAt = '{JOINEDAT}',
    Splash = '{SPLASH}'
}

const automationMessageRegex = /{MENTION}|{NAME}|{TAG}|{DISCRIM}|{GUILD}|{COUNT}|{POSITION}|{CREATEDAT}|{JOINEDAT}|{SPLASH}/g;
/**
 * Transforms a automation message with variables.
 * @param message String - the message to transform.
 * @param member GuildMember - The guildmember of whom the message is assigned to.
 * @param t TFunction - The TFunction of the member's guild.
 * @returns string - The transformed message.
 */
export function transformAutomationMessage(message: string, member: GuildMember, t: TFunction): string {
    return message.replace(automationMessageRegex, match => {
        switch (match) {
        case AutomationMatches.Mention:
            return member.toString();
        case AutomationMatches.Name:
            return member.displayName;
        case AutomationMatches.Tag:
            return member.user.tag;
        case AutomationMatches.Discrim:
            return member.user.discriminator;
        case AutomationMatches.Guild:
            return member.guild.name;
        case AutomationMatches.Count:
            return t(languageKeys.globals.numberFormat, { value: member.guild.memberCount });
        case AutomationMatches.Position:
            return t(languageKeys.globals.numberOrdinal, { value: member.guild.memberCount });
        case AutomationMatches.CreatedAt:
            return t(languageKeys.globals.fullDateTime, { date: member.user.createdAt });
        case AutomationMatches.JoinedAt:
            return t(languageKeys.globals.fullDateTime, { date: member.joinedAt });
        case AutomationMatches.Splash:
            return member.guild.splashURL({ size: 2048 });
        default:
            return '';
        }
    });
}
/**
 * Prepares the automation embed by injecting in variables.
 * @param embed FoxxieEmbed - The automation embed to be sent.
 * @param member GuildMember - The member to whom the embed belongs.
 * @param t TFunction - The TFunction of the member's guild.
 * @returns FoxxieEmbed - The transformed automation embed.
 */
export function prepareAutomationEmbed(embed: FoxxieEmbed, member: GuildMember, t: TFunction): FoxxieEmbed {
    embed
        .setThumbnail(member.displayAvatarURL({ dynamic: true }))
        .setDescription(transformAutomationMessage(embed.description, member, t))
        .setTitle(transformAutomationMessage(embed.title, member, t))
        .setTimestamp()
        .setColor(embed.color || member.guild.me?.displayColor || BrandingColors.Primary);

    if (embed.footer) embed.setFooter(transformAutomationMessage(embed.footer.text, member, t), embed.footer.iconURL);

    for (const field of embed.fields) {
        transformAutomationMessage(field.name, member, t);
        transformAutomationMessage(field.value, member, t);
    }

    return embed;
}