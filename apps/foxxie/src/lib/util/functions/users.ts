import { Emojis } from '#utils/constants';
import { userMention } from '@discordjs/builders';
import { BitField } from '@sapphire/bitfield';
import { GuildMember, Message, User, UserFlags, type Snowflake } from 'discord.js';

const ExtendedUserFlagBits = new BitField({
	Quarantined: getExtendedBits(UserFlags.Quarantined),
	Collaborator: getExtendedBits(UserFlags.Collaborator),
	RestrictedCollaborator: getExtendedBits(UserFlags.RestrictedCollaborator)
});

export function getModerationFlags(bitfield: number) {
	return {
		spammer: (bitfield & UserFlags.Spammer) === UserFlags.Spammer,
		quarantined: ExtendedUserFlagBits.has(getExtendedBits(bitfield), ExtendedUserFlagBits.flags.Quarantined)
	};
}

export function getModerationFlagsString(bitfield: number) {
	const { spammer, quarantined } = getModerationFlags(bitfield);
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
