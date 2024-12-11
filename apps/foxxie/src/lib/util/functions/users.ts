import { userMention } from '@discordjs/builders';
import { BitField } from '@sapphire/bitfield';
import { Emojis } from '#utils/constants';
import { GuildMember, Message, type Snowflake, User, UserFlags } from 'discord.js';

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
