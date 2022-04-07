import { GuildChannel, GuildMember, PermissionResolvable, Permissions } from 'discord.js';

export const viewMessages = new Permissions(['VIEW_CHANNEL']);
export const sendMessage = new Permissions(['VIEW_CHANNEL', 'SEND_MESSAGES']);

export function isModerator(member: GuildMember): boolean {
    return isGuildOwner(member) || checkModerator(member) || checkAdmin(member);
}

export function isHoisting(member: GuildMember): boolean {
    const kLowestCode = 'A'.charCodeAt(0);
    const [kLowestNumberCode, kHighestNumberCode] = ['0'.charCodeAt(0), '9'.charCodeAt(0)];
    const char = member.displayName.codePointAt(0);

    return char as number < kLowestCode && (char as number < kLowestNumberCode || char as number > kHighestNumberCode);
}

export function isAdmin(member: GuildMember): boolean {
    return isGuildOwner(member) || checkAdmin(member);
}

export function isGuildOwner(member: GuildMember): boolean {
    return member.id === member.guild.ownerId;
}

export function isReadableChannel(channel: GuildChannel): boolean {
    if (!channel) return false;
    if (!channel.guild) return true;
    return hasPermissionsInChannel(channel, viewMessages);
}

export function isSendableChannel(channel: GuildChannel): boolean {
    if (!channel) return false;
    if (!channel.guild) return true;
    return hasPermissionsInChannel(channel, sendMessage);
}

export function hasPermissionsInChannel(channel: GuildChannel, permissions: PermissionResolvable): boolean {
    if (!channel.guild) return true;
    return channel.permissionsFor(channel.guild.me as GuildMember)?.has(permissions);
}

export function checkModerator(member: GuildMember): boolean {
    return member.permissions.has(Permissions.FLAGS.BAN_MEMBERS);
}

export function checkAdmin(member: GuildMember): boolean {
    return member.permissions.has(Permissions.FLAGS.MANAGE_GUILD);
}