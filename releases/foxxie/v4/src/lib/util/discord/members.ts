import { getMuteRole } from './guilds';
import type { GuildMember } from 'discord.js';
import { handleError } from '.';

export async function mute(member: GuildMember, reason?: string): Promise<undefined | GuildMember | string> {
    const muterole = await getMuteRole(member.guild);
    if (!muterole) return member;
    return member.roles.add(muterole, reason).catch(handleError);
}

export async function unmute(member: GuildMember, reason?: string): Promise<undefined | GuildMember | string> {
    const muterole = await getMuteRole(member.guild);
    if (!muterole) return member;
    return member.roles.remove(muterole, reason).catch(handleError);
}

export function dehoist(member: GuildMember): Promise<undefined | GuildMember | string> {
    return member.setNickname(`⬇${member.displayName.slice(1, 32)}`).catch(handleError);
}