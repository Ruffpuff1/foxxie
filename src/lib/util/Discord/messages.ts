import { LanguageKeys } from '#lib/i18n';
import type { GuildMessage } from '#lib/types';
import type { CustomFunctionGet, CustomGet, TOptionsBase } from '@foxxie/i18n';
import { minutes, randomArray } from '@ruffpuff/utilities';
import { container } from '@sapphire/framework';
import type { Message, MessageOptions, UserResolvable } from 'discord.js';
import { send } from '@sapphire/plugin-editable-commands';
import { setTimeout as sleep } from 'timers/promises';
import { floatPromise } from '#utils/util';
import { canReact, canRemoveAllReactions } from '@sapphire/discord.js-utilities';

/**
 * Deletes a message immediately.
 * @param message The message to delete
 * @returns
 */
export function deleteMessageImmediately(message: Message): Promise<unknown> {
    return floatPromise(message.delete());
}

/**
 * Deletes a message, skipping if it was already deleted, and aborting if a non-zero timer was set and the message was
 * either deleted or edited.
 *
 * This also ignores the `UnknownMessage` error code.
 * @param message The message to delete.
 * @param time The amount of time, defaults to 0.
 * @returns The deleted message.
 */
export async function deleteMessage(message: Message, time = 0): Promise<Message | void | unknown> {
    if (time === 0) return deleteMessageImmediately(message);

    const lastEditedTimestamp = message.editedTimestamp;
    await sleep(time);

    // If it was deleted or edited, cancel:
    if (message.editedTimestamp !== lastEditedTimestamp) {
        return message;
    }

    return deleteMessageImmediately(message);
}

export async function sendLoadingMessage(
    msg: GuildMessage,
    key: CustomGet<string, string[]> | CustomFunctionGet<any, string, string[]> = LanguageKeys.System.MessageLoading,
    args = {}
): Promise<Message> {
    const t = await container.db.guilds.acquire(msg.guild.id!, s => s.getLanguage());
    const translated = t<string[]>(key, args as TOptionsBase);
    const content = (Array.isArray(translated) ? randomArray(translated as any) : translated) as string;

    return send(msg, { content });
}

export const enum YesNo {
    Yes = '🇾',
    No = '🇳'
}

export interface AskYesNoOptions extends MessageOptions {
    target?: UserResolvable;
    time?: number;
}

const promptConfirmationMessageRegExp = /^y|yes?|yeah?$/i;
async function askConfirmationMessage(message: Message, response: Message, options: AskYesNoOptions) {
    const target = container.client.users.resolveId(options.target ?? message.author)!;
    const messages = await response.channel.awaitMessages({
        filter: message => message.author.id === target,
        time: minutes(1),
        max: 1
    });

    return messages.size === 0 ? null : promptConfirmationMessageRegExp.test(messages.first()!.content);
}

export async function messagePrompt(message: Message, options: AskYesNoOptions | string): Promise<null | boolean> {
    if (typeof options === 'string') options = { content: options };

    const response = await send(message, options);
    return canReact(response.channel) ? askYesOrNo(message, response, options) : askConfirmationMessage(message, response, options);
}

export async function askYesOrNo(message: Message, response: Message, options: AskYesNoOptions): Promise<boolean | null> {
    await response.react(YesNo.Yes);
    await response.react(YesNo.No);

    const target = container.client.users.resolveId(options.target ?? message.author)!;
    const reactions = await response.awaitReactions({
        filter: (__, user) => user.id === target,
        time: minutes(1),
        max: 1
    });

    if (canRemoveAllReactions(response.channel)) {
        await floatPromise(response.reactions.removeAll());
    }

    return reactions.size === 0 ? null : reactions.firstKey() === YesNo.Yes;
}
