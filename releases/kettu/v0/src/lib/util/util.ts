import type { APIApplicationCommandInteraction, APIUser } from 'discord-api-types/v10';
import { userMention, italic, time, TimestampStyles } from '@discordjs/builders';
import type { UserMention } from 'discord.js';
import { container } from '@sapphire/framework';

export function wrapWithTarget<T extends string>(user: APIUser | undefined,  str: T): T | `_Suggestion for: ${UserMention}_\n\n${T}` {
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
    }
}

export const getId = getProperty('id');
export const getAvatar = getProperty('avatar');

export const getUser = (interaction: APIApplicationCommandInteraction, user: APIUser | undefined) =>
    user ?? interaction.user ?? interaction.member?.user;

export function getGuildIds() {
    const ids = process.env.GUILD_IDS!;

    if (!ids) return [];
    return ids.split(' ');
}

export function loadT(lang: string) {
    return (key: string, opts?: any) => container.i18n.format(lang, key, opts);
}

export const enUS = loadT('en-US');
export const esMX = loadT('es-MX');

export const duration = (value: Date) => time(value, TimestampStyles.RelativeTime);

export const longDate = (value: Date) => time(value, TimestampStyles.LongDate);