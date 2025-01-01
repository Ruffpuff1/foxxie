import { GuildMember, Message, User } from 'discord.js';

const disboardId = '302050872383242240';
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

export function getUserDisplayName(user: User): string {
    const discrim = user.discriminator === '0' ? null : user.discriminator;
    return `${user.username}${discrim ? `#${user.discriminator}` : ''}`;
}
