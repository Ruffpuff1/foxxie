import { api } from '#external/Api';
import { LanguageKeys } from '#lib/i18n';
import type { CustomFunctionGet, CustomGet, GuildMessage, ScheduleData } from '#lib/types';
import { fetch } from '@foxxie/fetch';
import { isNumber, isThenable, minutes, randomArray, ZeroWidthSpace } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { fetchT } from '@sapphire/plugin-i18next';
import { jaroWinkler } from '@skyra/jaro-winkler';
import { APIUser, RESTJSONErrorCodes } from 'discord-api-types/v9';
import { Collection, CommandInteraction, Guild, Message, MessageActionRow, MessageButton, SnowflakeUtil, User } from 'discord.js';
import type { TFunction, TOptionsBase } from 'i18next';
import type { Job } from 'bull';
import type { Schedules } from './constants';
import { cpus, hostname, loadavg, totalmem } from 'node:os';
import type { AskYesNoOptions } from './Discord/messages';
import { time, TimestampStyles } from '@discordjs/builders';

export function loadT(lang: string) {
    return (key: string, opts?: any) => container.i18n.format(lang, key, opts);
}

export const enUS = loadT('en-US');
export const esMX = loadT('es-MX');

/**
 * Attaches a logging catch method to a promise, "floating it".
 * @param promise The promise to float.
 */
export function floatPromise(promise: Promise<unknown>) {
    if (isThenable(promise))
        promise.catch((error: Error) => {
            container.logger.debug(error);
        });
    return promise;
}

export function idToTimestamp(id: string | number): number | null {
    if (isNumber(id)) return null;
    return SnowflakeUtil.deconstruct(id as string).timestamp;
}

export async function fetchReactionUsers(channelId: string, messageId: string, reaction: string) {
    const users = new Set<string>();
    let rawUsers: APIUser[] = [];

    do {
        rawUsers = await api()
            .channels(channelId)
            .messages(messageId)
            .reactions(reaction)
            .get({
                query: {
                    limit: 100,
                    after: rawUsers.length ? rawUsers[rawUsers.length - 1].id : undefined
                }
            });
        for (const user of rawUsers.filter(user => user.id !== process.env.CLIENT_ID)) users.add(user.id);
    } while (rawUsers.length === 100);

    return users;
}

export function fuzzySearch<T = unknown>(input: string, cache: Collection<string, T>, filterBy: (entry: T) => string, take = 20): T[] {
    const results = new Collection<string, { entry: T; score: number }>();

    let lowerCaseName: string;
    let current: string;
    let similarity: number;
    const threshold = 0.3;

    for (const [id, entry] of cache.entries()) {
        current = filterBy(entry);
        lowerCaseName = current.toLowerCase();

        if (lowerCaseName === input) {
            similarity = 1;
        } else {
            similarity = jaroWinkler(input, lowerCaseName);
        }

        if (similarity < threshold) continue;

        results.set(id, { entry, score: similarity });
    }

    const sorted = results.sort((a, b) => b.score - a.score);

    return sorted.map(s => s.entry).slice(0, take);
}

export async function sendLoadingMessage(
    msg: Message | GuildMessage | CommandInteraction,
    key: CustomGet<string, string[]> | CustomFunctionGet<any, string, string[]> = LanguageKeys.System.MessageLoading,
    args = {},
    ephemeral = false
): Promise<Message> {
    const t = await fetchT(msg.guild!);
    const translated = t<IterableIterator<string>>(key, args as TOptionsBase);
    const content = Array.isArray(translated) ? randomArray(translated) : translated;

    return msg instanceof CommandInteraction
        ? ((await msg.reply({
              content,
              fetchReply: true,
              ephemeral
          })) as Message)
        : send(msg, { content });
}

export function xpNeeded(level: number) {
    // eslint-disable-next-line no-mixed-operators
    const f = (x: number) => 100 + Math.min(Math.max(0, 2 * (10 * ((x - 5) / 10 - Math.floor(1 / 2 + (x - 5) / 10)) ** 2 + 10 * Math.floor(x / 10) + x - 2.5)), 2000);
    return Math.ceil(f(level));
}

export async function canDmUser(user: User): Promise<boolean> {
    if (!user.dmChannel) await user.createDM();

    const data = await fetch(`${container.client.options.http!.api}/v${container.client.options.http!.version}`, 'POST') //
        .path('channels')
        .path(user.dmChannel!.id)
        .path('messages')
        .header('Authorization', `Bot ${container.client.token}`)
        .body(
            {
                content: ''
            },
            'json'
        )
        .json<ApiMessageError>();

    if (data.code! && data.code === RESTJSONErrorCodes.CannotSendMessagesToThisUser) return false;
    return true;
}

interface ApiMessageError {
    message: string;
    code: RESTJSONErrorCodes.CannotSendAnEmptyMessage | RESTJSONErrorCodes.CannotSendMessagesToThisUser;
}

/**
 * Clean all mentions from a body of text
 * @param guild The guild for context
 * @param input The input to clean
 * @returns The input cleaned of mentions
 * @license Apache-2.0
 * @copyright 2019 Antonio Román
 */
export function cleanMentions(guild: Guild, input: string): string {
    if (!(typeof input === 'string')) return input;
    return input.replace(/@(here|everyone)/g, `@${ZeroWidthSpace}$1`).replace(/<(@[!&]?|#)(\d{17,19})>/g, (match, type, id) => {
        switch (type) {
            case '@':
            case '@!': {
                const tag = guild.client.users.cache.get(id);
                return tag ? `@${tag.username}` : `<${type}${ZeroWidthSpace}${id}>`;
            }
            case '@&': {
                const role = guild.roles.cache.get(id);
                return role ? `@${role.name}` : match;
            }
            case '#': {
                const channel = guild.channels.cache.get(id);
                return channel ? `#${channel.name}` : `<${type}${ZeroWidthSpace}${id}>`;
            }
            default:
                return `<${type}${ZeroWidthSpace}${id}>`;
        }
    });
}

export async function fetchTasks<T extends Schedules = Schedules.PostAnalytics>(type?: T, filter: (j: Job) => boolean = () => true): Promise<MappedJob<T>[]> {
    const cache = (await container.tasks.list({ start: 0 })) as Job[];

    const filtered = cache.filter(a => Boolean(a)).filter(filter);
    const list = type ? filtered.filter(job => job.data.task === type) : filtered;

    return list.map(job => ({
        id: job.id,
        // @ts-expect-error job will always be delayed.
        time: new Date(job.timestamp + job.delay),
        finished: Boolean(job.finishedOn),
        data: job.data.payload,
        name: job.data.task
    }));
}

export interface MappedJob<T extends Schedules> {
    id: string | number;
    time: Date;
    finished: boolean;
    data: ScheduleData<T>;
    name: T;
}

export async function sweepCompletedTasks(type?: Schedules) {
    let cache = (await container.tasks.list({ start: 0 })) as Job[];

    if (type) cache = cache.filter(job => job?.data.task === type);

    const filtered = cache.filter(job => job.finishedOn !== undefined);
    const promises: unknown[] = [];

    for (const job of filtered) {
        promises.push(container.tasks.delete(job.id));
    }

    await Promise.all(promises);
}

export function sortTasksByTime<T extends Schedules = Schedules.PostAnalytics>(tasks: MappedJob<T>[], reverse = false) {
    const sorted = tasks.sort((a, b) => a.time.getTime() - b.time.getTime());
    return reverse ? sorted.reverse() : sorted;
}

export function getServerDetails(): ServerDetails {
    // eslint-disable-next-line @typescript-eslint/no-extra-parens
    const totalmemory = ((totalmem() / 1024 / 1024 / 1024) * 1024).toFixed(0);
    const memoryUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    return {
        totalmemory,
        memoryUsed,
        memoryPercent: (parseInt(memoryUsed, 10) / parseInt(totalmemory, 10) * 100).toFixed(1),
        process: hostname(),
        cpuCount: cpus().length,
        cpuUsage: (loadavg()[0] * 10).toFixed(1),
        cpuSpeed: (cpus()[0].speed / 1000).toFixed(1),
        uptime: Date.now() - container.client.uptime!,
        version: process.env.CLIENT_VERSION!,
        totalShards: container.client.options.shardCount || 1
    };
}

export interface ServerDetails {
    process: string;
    cpuUsage: string;
    totalmemory: string;
    cpuSpeed: string;
    cpuCount: number;
    memoryUsed: string;
    memoryPercent: string;
    uptime: number;
    version: string;
    totalShards: number;
}

export function getGuildIds() {
    const ids = process.env.GUILD_IDS!;

    if (!ids) return [];
    return ids.split(' ');
}

export async function interactionPrompt(interaction: CommandInteraction, options: AskYesNoOptions | string, t: TFunction): Promise<null | boolean> {
    if (typeof options === 'string') options = { content: options };

    const actionRow = new MessageActionRow().setComponents(
        new MessageButton() //
            .setCustomId('prompt|yes')
            .setLabel(t(LanguageKeys.Globals.Yes))
            .setStyle('SUCCESS'),
        new MessageButton() //
            .setCustomId('prompt|no')
            .setLabel(t(LanguageKeys.Globals.No))
            .setStyle('DANGER')
    );

    const response = (
        interaction.replied || interaction.deferred
            ? await interaction.editReply({ ...options, components: [actionRow] })
            : await interaction.reply({ ...options, ephemeral: true, fetchReply: true, components: [actionRow] })
    ) as Message;

    const collected = await interaction.channel?.awaitMessageComponent({
        time: minutes(1),
        filter: cpt => cpt.user.id === interaction.user.id && cpt.message.id === response.id,
        componentType: 'BUTTON'
    });

    if (!collected) return false;

    return collected.customId.endsWith('yes') ? true : false;
}

export const duration = (value: Date) => time(value, TimestampStyles.RelativeTime);

export const longDate = (value: Date) => time(value, TimestampStyles.LongDate);
