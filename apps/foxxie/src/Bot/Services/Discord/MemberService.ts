import { GuildMember, PermissionFlagsBits } from 'discord.js';

export class MemberService {
	public static IsAdmin(member: GuildMember | undefined): boolean {
		if (!member) return false;
		return MemberService.IsGuildOwner(member) || member.permissions.has(PermissionFlagsBits.ManageGuild);
	}

	public static IsGuildOwner(member: GuildMember): boolean {
		return member.id === member.guild.ownerId;
	}

	public static IsModerator(member: GuildMember | undefined): boolean {
		if (!member) return false;
		return (
			MemberService.IsGuildOwner(member) ||
			member.permissions.has(PermissionFlagsBits.BanMembers) ||
			member.permissions.has(PermissionFlagsBits.ModerateMembers)
		);
	}
}
