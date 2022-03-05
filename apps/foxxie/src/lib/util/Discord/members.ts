import type { GuildMember } from 'discord.js';
/**
 * Check if a certain guildMember is boosting it's guild.
 * @param input The GuildMember to check.
 * @returns boolean
 */
export function isBooster(input: GuildMember): boolean {
    return Boolean(input.premiumSinceTimestamp);
}
