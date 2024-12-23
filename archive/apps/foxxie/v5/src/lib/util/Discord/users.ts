import { UserFlags } from 'discord-api-types/v9';
import { GuildMember, Message, User } from 'discord.js';

export const disboardId = '302050872383242240';
/**
 * Determine weather a User, GuildMember or Message is from the Disboard.org Bot.
 * @param input The input to check.
 * @returns boolean
 * @reference https://disboard.org/
 */
export function isDisboard(input: Message | User | GuildMember): boolean {
    if (input instanceof Message) return input.author.id === disboardId;
    return input.id === disboardId;
}

/**
 * Check if a given user is a Discord Certified Moderator.
 * @param input The user to check.
 * @returns boolean
 */
export function isDiscordModerator(input: User): boolean {
    return input.flags?.has(UserFlags.CertifiedModerator) ?? false;
}

/**
 * Check if a given user is a Discord Staff Member.
 * @param input The user to check.
 * @returns boolean
 */
export function isDiscordStaff(input: User): boolean {
    return Boolean(input.flags?.has(UserFlags.Staff)) ?? false;
}

/**
 * Check if a given user is a Discord Staff Member or Certified Moderator.
 * @param input The user to check.
 * @returns boolean
 */
export function isDiscordStaffOrModerator(input: User): boolean {
    return isDiscordStaff(input) || isDiscordModerator(input);
}
