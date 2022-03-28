import type { APIUser } from 'discord-api-types/v10';
import { time, TimestampStyles } from '@discordjs/builders';
import type { User } from 'discord.js';
import { container } from '@sapphire/framework';
import { EnvParse } from '@foxxie/env';

export function formatAuthor(user?: APIUser | User) {
    return `${user?.username}#${user?.discriminator} [${user?.id}]`;
}

export function getGuildIds() {
    try {
        return EnvParse.array('GUILD_IDS');
    } catch {
        return [];
    }
}

export function loadT(lang: string) {
    return (key: string, opts?: any) => container.i18n.format(lang, key, opts);
}

export const enUS = loadT('en-US');
export const esMX = loadT('es-MX');

export const duration = (value: Date) => time(value, TimestampStyles.RelativeTime);
export const longDate = (value: Date) => time(value, TimestampStyles.LongDate);
