import type { GuildMessage } from "#lib/types";
import { container } from "@sapphire/pieces";
import { send } from "@sapphire/plugin-editable-commands";
import { resolveKey } from "@sapphire/plugin-i18next";
import type { Message, MessageOptions, UserResolvable } from "discord.js";
import {
  canRemoveAllReactions,
  canReact,
} from "@sapphire/discord.js-utilities";
import { floatPromise } from "#utils/util";
import { minutes } from "@ruffpuff/utilities";
import { emojis } from "#utils/constants";
import { setTimeout as sleep } from "node:timers/promises";

export interface AskYesNoOptions extends MessageOptions {
  target?: UserResolvable;
  time?: number;
}

const enum YesNo {
  Yes = "🇾",
  No = "🇳",
}

export async function sendLocalizedMessage(
  msg: GuildMessage,
  key: string
): Promise<Message> {
  const content = await resolveKey(msg, key);
  return send(msg, content);
}

export async function askYesOrNo(
  message: Message,
  response: Message,
  options: AskYesNoOptions
): Promise<boolean | null> {
  await response.react(YesNo.Yes);
  await response.react(YesNo.No);

  const target = container.client.users.resolveId(
    options.target ?? message.author
  )!;
  const reactions = await response.awaitReactions({
    filter: (__, user) => user.id === target,
    time: minutes(1),
    max: 1,
  });

  if (canRemoveAllReactions(response.channel)) {
    await floatPromise(response.reactions.removeAll());
  }

  return reactions.size === 0 ? null : reactions.firstKey() === YesNo.Yes;
}

const promptConfirmationMessageRegExp = /^y|yes?|yeah?$/i;
async function askConfirmationMessage(
  message: Message,
  response: Message,
  options: AskYesNoOptions
) {
  const target = container.client.users.resolveId(
    options.target ?? message.author
  )!;
  const messages = await response.channel.awaitMessages({
    filter: (message) => message.author.id === target,
    time: minutes(1),
    max: 1,
  });

  return messages.size === 0
    ? null
    : promptConfirmationMessageRegExp.test(messages.first()!.content);
}

export async function messagePrompt(
  message: Message,
  options: AskYesNoOptions | string
): Promise<null | boolean> {
  if (typeof options === "string") options = { content: options };

  const response = await send(message, options);
  return canReact(response.channel)
    ? askYesOrNo(message, response, options)
    : askConfirmationMessage(message, response, options);
}

export async function promptWithMessage(
  message: Message,
  options: AskYesNoOptions | string
): Promise<[null | boolean, Message]> {
  if (typeof options === "string") options = { content: options };

  const response = await send(message, options);
  const shouldPrompt = canReact(response.channel)
    ? await askYesOrNo(message, response, options)
    : await askConfirmationMessage(message, response, options);

  return [shouldPrompt, response];
}

export async function reactYes(msg: Message): Promise<unknown> {
  return floatPromise(msg.react(emojis.reactions.yes));
}

export async function promptForMessage(
  message: Message,
  sendOptions: string | MessageOptions,
  time = minutes(1)
): Promise<string | null> {
  const response = await message.channel.send(sendOptions);
  const responses = await message.channel.awaitMessages({
    filter: (msg) => msg.author === message.author,
    time,
    max: 1,
  });
  await floatPromise(deleteMessage(response));

  if (responses.first()) await floatPromise(deleteMessage(responses.first()!));
  return responses.size === 0 ? null : responses.first()!.content;
}

export async function reactNo(msg: Message): Promise<unknown> {
  return floatPromise(msg.react(emojis.reactions.no));
}

export async function deleteMessageImmediately(
  message: Message
): Promise<unknown> {
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
export async function deleteMessage(
  message: Message,
  time = 0
): Promise<Message | void | unknown> {
  if (time === 0) return deleteMessageImmediately(message);

  const lastEditedTimestamp = message.editedTimestamp;
  await sleep(time);

  // If it was deleted or edited, cancel:
  if (message.editedTimestamp !== lastEditedTimestamp) {
    return message;
  }

  return deleteMessageImmediately(message);
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
  options: string | MessageOptions,
  timer = minutes(1)
): Promise<Message> {
  if (typeof options === "string") options = { content: options };

  const response = (await send(message, options)) as Message;
  await floatPromise(deleteMessage(response, timer));
  return response;
}

/**
 * Determine whether the sent message is one of the Boost message notification types.
 * @param message The message to check.
 * @returns boolean
 */
export function isBoostMessage(message: Message): boolean {
  const boostMessageTypes = [
    "USER_PREMIUM_GUILD_SUBSCRIPTION",
    "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_1",
    "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_2",
    "USER_PREMIUM_GUILD_SUBSCRIPTION_TIER_3",
  ];

  return boostMessageTypes.includes(message.type);
}
