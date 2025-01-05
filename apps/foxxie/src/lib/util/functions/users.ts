import { userMention } from '@discordjs/builders';
import { resolveToNull } from '@ruffpuff/utilities';
import { BitField } from '@sapphire/bitfield';
import { container } from '@sapphire/pieces';
import { Emojis } from '#utils/constants';
import { GuildMember, GuildResolvable, Message, type Snowflake, User, UserFlags, UserResolvable } from 'discord.js';

const ExtendedUserFlagBits = new BitField({
	Collaborator: getExtendedBits(UserFlags.Collaborator),
	Quarantined: getExtendedBits(UserFlags.Quarantined),
	RestrictedCollaborator: getExtendedBits(UserFlags.RestrictedCollaborator)
});

export function getModerationFlags(bitfield: number) {
	return {
		quarantined: ExtendedUserFlagBits.has(getExtendedBits(bitfield), ExtendedUserFlagBits.flags.Quarantined),
		spammer: (bitfield & UserFlags.Spammer) === UserFlags.Spammer
	};
}

export function getModerationFlagsString(bitfield: number) {
	const { quarantined, spammer } = getModerationFlags(bitfield);
	if (spammer && quarantined) return Emojis.SpammerIcon + Emojis.QuarantinedIcon;
	if (spammer) return Emojis.SpammerIcon;
	if (quarantined) return Emojis.QuarantinedIcon;
	return '';
}

export function getUserMentionWithFlagsString(bitfield: number, userId: Snowflake) {
	const flags = getModerationFlagsString(bitfield);
	const mention = userMention(userId);
	return flags ? `${mention} ${flags}` : mention;
}

function getExtendedBits(bitfield: number) {
	return (bitfield / (1 << 30)) | 0;
}

const disboardId = '302050872383242240';

export class UserUtil {
	public static AreDifferent(user1: UserResolvable, user2: UserResolvable) {
		const id1 = container.client.users.resolveId(user1);
		const id2 = container.client.users.resolveId(user2);

		return id1 !== id2;
	}

	public static async Fetch(userId: UserResolvable) {
		const user = container.client.users.resolveId(userId);
		const fetched = user ? await resolveToNull(container.client.users.fetch(user)) : null;
		return fetched;
	}

	public static async ResolveDisplayName(userId: Snowflake, guild?: GuildResolvable): Promise<string> {
		const user = await resolveToNull(container.client.users.fetch(userId));
		if (!user) return 'Unknown';

		if (!guild) return user.username;
		const resolved = container.client.guilds.resolve(guild);
		if (!resolved) return user.username;

		const member = await resolveToNull(resolved.members.fetch(userId));
		if (member) return member.displayName;

		return user.username;
	}
}

/**
 * Determine weather a User, GuildMember or Message is from the Disboard.org Bot.
 * @param input The input to check.
 * @returns boolean
 * @reference https://disboard.org/
 */
export function isDisboard(input: GuildMember | Message | User): boolean {
	if (input instanceof Message) return input.author.id === disboardId;
	return input.id === disboardId;
}
