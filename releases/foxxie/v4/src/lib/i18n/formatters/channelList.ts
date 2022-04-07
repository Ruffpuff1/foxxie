import { toTitleCase } from '@ruffpuff/utilities';
import type { Collection, GuildChannel } from 'discord.js';
import type { TFunction } from '@sapphire/plugin-i18next';
import { languageKeys } from '..';

export function channelList(value: Collection<string, GuildChannel>, t: TFunction): string {
    const textSize = value.reduce((acc, itm) => {
        if (itm.type === 'GUILD_TEXT') return acc += 1;
        return acc;
    }, 0);
    const stageSize = value.reduce((acc, itm) => {
        if (itm.type === 'GUILD_STAGE_VOICE') return acc += 1;
        return acc;
    }, 0);
    const storeSize = value.reduce((acc, itm) => {
        if (itm.type === 'GUILD_STORE') return acc += 1;
        return acc;
    }, 0);
    const newsSize = value.reduce((acc, itm) => {
        if (itm.type === 'GUILD_NEWS') return acc += 1;
        return acc;
    }, 0);
    const voiceSize = value.reduce((acc, itm) => {
        if (itm.type === 'GUILD_VOICE') return acc += 1;
        return acc;
    }, 0);
    const pubThreadSize = value.reduce((acc, itm) => {
        if (itm.type === 'GUILD_PUBLIC_THREAD') return acc += 1;
        return acc;
    }, 0);

    return [
        textSize ? t(languageKeys.guilds.channels.GUILD_TEXT, { count: textSize, context: 'SHORT' }) : null,
        voiceSize ? t(languageKeys.guilds.channels.GUILD_TEXT, { count: voiceSize, context: 'SHORT' }) : null,
        stageSize ? t(languageKeys.guilds.channels.GUILD_STAGE, { count: stageSize, context: 'SHORT' }) : null,
        newsSize ? t(languageKeys.guilds.channels.GUILD_NEWS, { count: newsSize, context: 'SHORT' }) : null,
        storeSize ? t(languageKeys.guilds.channels.GUILD_STORE, { count: storeSize, context: 'SHORT' }) : null,
        pubThreadSize ? t(languageKeys.guilds.channels.GUILD_PUBLIC_THREAD, { count: pubThreadSize, context: 'SHORT' }) : null
    ].filter(a => !!a).join(', ')
    || toTitleCase(t(languageKeys.globals.unknown));
}