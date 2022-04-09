import type { APIApplicationCommandInteraction, APIUser, LocaleString } from 'discord-api-types/v10';
import { userMention, italic, time, TimestampStyles } from '@discordjs/builders';
import type { UserMention } from 'discord.js';
import { EnvParse } from '@foxxie/env';
import { getT } from '@foxxie/i18n';

export function wrapWithTarget<T extends string>(user: APIUser | undefined, str: T): T | `_Suggestion for: ${UserMention}_\n\n${T}` {
    if (!user) return str;
    return `${italic(`Suggestion for: ${userMention(user.id)}`)}\n\n${str}`;
}

export function formatAuthor(user?: APIUser) {
    return `${user?.username}#${user?.discriminator} [${user?.id}]`;
}

export function getProperty<T extends keyof APIUser>(key: T) {
    return (interaction: APIApplicationCommandInteraction, user?: APIUser | undefined) => {
        const target = user ?? interaction.user ?? interaction.member?.user;
        return target?.[key];
    };
}

export const getId = getProperty('id');
export const getAvatar = getProperty('avatar');

export const getUser = (interaction: APIApplicationCommandInteraction, user: APIUser | undefined) => user ?? interaction.user ?? interaction.member?.user;

export function getGuildIds() {
    try {
        return EnvParse.array('GUILD_IDS');
    } catch {
        return [];
    }
}

export const enUS = getT('en-US');
export const esMX = getT('es-MX' as LocaleString);

export const duration = (value: Date) => time(value, TimestampStyles.RelativeTime);

export const longDate = (value: Date) => time(value, TimestampStyles.LongDate);
