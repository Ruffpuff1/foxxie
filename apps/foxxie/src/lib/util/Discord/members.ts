import { container } from '@sapphire/framework';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import type { GuildMember, GuildResolvable } from 'discord.js';

export function isGuildOwner(member: GuildMember): boolean {
    return member.id === member.guild.ownerId;
}

export function isModerator(member: GuildMember | undefined): boolean {
    if (!member) return false;
    return (
        isGuildOwner(member) ||
        member.permissions.has(PermissionFlagsBits.BanMembers) ||
        member.permissions.has(PermissionFlagsBits.ModerateMembers)
    );
}

export function isAdmin(member: GuildMember | undefined): boolean {
    if (!member) return false;
    return isGuildOwner(member) || member.permissions.has(PermissionFlagsBits.ManageGuild);
}

export function maybeMe(resolvable: GuildResolvable): GuildMember | null {
    const guild = container.client.guilds.resolve(resolvable);
    if (!guild) return null;

    return guild.members.cache.get(process.env.CLIENT_ID!) ?? null;
}
