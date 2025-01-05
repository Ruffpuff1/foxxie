import { LanguageKeys } from '#lib/I18n';
import type { CustomFunctionGet, CustomGet, GuildMessage } from '#lib/Types';
import { floatPromise } from '#utils/util';
import { cast, minutes, randomArray } from '@ruffpuff/utilities';
import { canReact, canRemoveAllReactions } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/pieces';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message, TextChannel, UserResolvable } from 'discord.js';
import { MessageCreateOptions, MessageType } from 'discord.js';
import { TOptionsBase } from 'i18next';
import { setTimeout as sleep } from 'node:timers/promises';

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
): Promise<Message | GuildMessage> {
    const t = await container.db.guilds.acquire(msg.guild.id!, s => s.getLanguage());
    const translated = t(key, cast<TOptionsBase>(args));
    const content = cast<string>(Array.isArray(translated) ? randomArray(cast<any>(translated)) : translated);

    return send(cast<Message>(msg), { content });
}

export async function sendLoadingMessageInChannel(
    channel: TextChannel,
    key: CustomGet<string, string[]> | CustomFunctionGet<any, string, string[]> = LanguageKeys.System.MessageLoading,
    args = {}
): Promise<Message | GuildMessage> {
    const t = await container.db.guilds.acquire(channel.guild.id!, s => s.getLanguage());
    const translated = t(key, args);
    const content = cast<string>(Array.isArray(translated) ? randomArray(cast<any>(translated)) : translated);

    return channel.send({ content });
}

export const enum YesNo {
    Yes = '🇾',
    No = '🇳'
}

export interface AskYesNoOptions extends MessageCreateOptions {
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

export async function messagePrompt(message: Message | GuildMessage, options: AskYesNoOptions | string): Promise<null | boolean> {
    if (typeof options === 'string') options = { content: options };

    const response = await send(message, options);
    return canReact(response.channel)
        ? askYesOrNo(message, response, options)
        : askConfirmationMessage(message, response, options);
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

/**
 * Sends a temporary editable message and then floats a {@link deleteMessage} with the given `timer`.
 * @param message The message to reply to.
 * @param options The options to be sent to the channel.
 * @param timer The timer in which the message should be deleted, using {@link deleteMessage}.
 * @returns The response message.
 */
export async function sendTemporaryMessage(
    message: Message,
    options: string | MessageCreateOptions,
    timer = minutes(1)
): Promise<Message> {
    if (typeof options === 'string') options = { content: options };

    const response = cast<Message>(await send(message, options));
    await floatPromise(deleteMessage(response, timer));
    return response;
}

export async function promptForMessage(
    message: Message,
    sendOptions: string | MessageCreateOptions,
    time = minutes(1)
): Promise<string | null> {
    await send(message, sendOptions);

    const responses = await message.channel.awaitMessages({ filter: msg => msg.author === message.author, time, max: 1 });
    const content = responses.size === 0 ? null : responses.first()!.content;

    if (content) await floatPromise(deleteMessage(responses.first()!));

    return content;
}

/**
 * Determine whether the sent message is one of the Boost message notification types.
 * @param message The message to check.
 * @returns boolean
 */
export function isBoostMessage(message: Message): boolean {
    const boostMessageTypes = [
        MessageType.GuildBoost,
        MessageType.GuildBoostTier1,
        MessageType.GuildBoostTier2,
        MessageType.GuildBoostTier3
    ];

    return boostMessageTypes.includes(message.type);
}
