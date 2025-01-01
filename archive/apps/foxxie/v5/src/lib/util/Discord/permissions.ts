import { PermissionFlagsBits } from 'discord-api-types/v9';
import { DMChannel, GuildChannel, GuildMember, NewsChannel, PartialDMChannel, PermissionResolvable, Permissions, TextChannel, ThreadChannel } from 'discord.js';
import type { GuildTextBasedChannelTypes } from '@sapphire/discord.js-utilities';

export const viewMessages = new Permissions(['VIEW_CHANNEL']);
export const sendMessage = new Permissions(['VIEW_CHANNEL', 'SEND_MESSAGES']);

export function isModerator(member: GuildMember): boolean {
    if (!member) return false;
    return isGuildOwner(member) || checkModerator(member) || checkAdmin(member);
}

export function isHoisting(member: GuildMember): boolean {
    const kLowestCode = 'A'.charCodeAt(0);
    const [kLowestNumberCode, kHighestNumberCode] = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    const char = member.displayName.codePointAt(0);

    return (char as number) < kLowestCode && ((char as number) < kLowestNumberCode || (char as number) > kHighestNumberCode);
}

export function isAdmin(member: GuildMember): boolean {
    return isGuildOwner(member) || checkAdmin(member);
}

/**
 * Checks if a guild member is the owner of the guild.
 * @param member The guild member to check.
 * @returns If the member if the guild owner.
 */
export function isGuildOwner(member: GuildMember): boolean {
    return member.guild.ownerId === member.id;
}

export function isReadableChannel(channel: GuildChannel): boolean {
    if (!channel) return false;
    if (!channel.guild) return true;
    return hasPermissionsInChannel(channel, viewMessages);
}

export function isSendableChannel(channel: GuildTextBasedChannelTypes): boolean {
    if (!channel) return false;
    if (!channel.guild) return true;
    return hasPermissionsInChannel(channel as GuildChannel, sendMessage);
}

export function hasPermissionsInChannel(channel: GuildChannel, permissions: PermissionResolvable): boolean {
    if (!channel.guild) return true;
    return channel.permissionsFor(channel.guild.me as GuildMember)?.has(permissions);
}

export function checkModerator(member: GuildMember): boolean {
    return member.permissions.has(PermissionFlagsBits.BanMembers) || member.permissions.has(PermissionFlagsBits.ModerateMembers);
}

export function checkAdmin(member: GuildMember): boolean {
    return member.permissions.has(PermissionFlagsBits.ManageChannels);
}

export function canAddReactions(channel: PartialDMChannel | DMChannel | TextChannel | NewsChannel | ThreadChannel): boolean {
    if (channel instanceof DMChannel) return true;
    return (channel as TextChannel).permissionsFor((channel as TextChannel).guild.me!).has(PermissionFlagsBits.AddReactions);
}
