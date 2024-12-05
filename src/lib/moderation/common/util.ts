import { TypeVariation } from '#utils/moderation';
import { TFunction } from '@sapphire/plugin-i18next';
import { getColor, TranslationMappings, UndoTaskNameMappings } from './constants';
import { TypedT } from '#lib/types';
import { LanguageKeys } from '#lib/i18n';
import { ModerationManager } from '../managers';
import { resolveToNull } from '@ruffpuff/utilities';
import { chatInputApplicationCommandMention, EmbedBuilder, messageLink, Snowflake, User } from 'discord.js';
import { container } from '@sapphire/framework';
import { FoxxieCommand } from '#lib/structures';
import { getModeration } from '#utils/functions';

export function getTranslationKey<const Type extends TypeVariation>(type: Type): (typeof TranslationMappings)[Type] {
	return TranslationMappings[type];
}

/**
 * Retrieves the task name for the scheduled undo action based on the provided type.
 *
 * @param type - The type of the variation.
 * @returns The undo task name associated with the provided type, or `null` if not found.
 */
export function getUndoTaskName(type: TypeVariation) {
	return type in UndoTaskNameMappings ? UndoTaskNameMappings[type as keyof typeof UndoTaskNameMappings] : null;
}

export function getTitleUndo(t: TFunction, key: TypedT) {
	switch (key) {
		case TranslationMappings[TypeVariation.Ban]:
			return t(LanguageKeys.Moderation.Unban);
		case TranslationMappings[TypeVariation.Mute]:
			return t(LanguageKeys.Moderation.Unmute);
		case TranslationMappings[TypeVariation.Warning]:
			return t(LanguageKeys.Moderation.Unwarn);
		case TranslationMappings[TypeVariation.Lock]:
			return t(LanguageKeys.Moderation.Unlock);
		default:
			return t(key);
	}
}

export function getTitleTemporary(t: TFunction, key: TypedT) {
	switch (key) {
		case TranslationMappings[TypeVariation.Ban]:
			return t(LanguageKeys.Moderation.TempBan);
		case TranslationMappings[TypeVariation.Mute]:
			return t(LanguageKeys.Moderation.TempMute);
		default:
			return t(key);
	}
}

export function getTitle(t: TFunction, entry: ModerationManager.Entry) {
	const key = getTranslationKey(entry.type);
	if (entry.isUndo()) return getTitleUndo(t, key);
	if (entry.isTemporary()) return getTitleTemporary(t, key);
	return t(key, Object(entry.extraData)) as string;
}

export async function getEmbed(t: TFunction, entry: ModerationManager.Entry) {
	const moderator = await entry.fetchModerator();
	const caseT = t(LanguageKeys.Globals.CaseT);
	const type = getTitle(t, entry);
	const modMember = await resolveToNull(entry.guild.members.fetch(moderator));

	const embed = new EmbedBuilder()
		.setColor(getColor(entry))
		.setAuthor({
			name: type,
			iconURL: modMember?.displayAvatarURL() || moderator.displayAvatarURL()
		})
		.setDescription(await getEmbedDescription(t, entry, moderator))
		.setFooter({
			text: `${caseT} #${t(LanguageKeys.Globals.NumberFormat, {
				value: entry.id
			})}`
		})
		.setTimestamp(entry.createdAt);

	return embed;
}

async function fetchRefrenceCase(entry: ModerationManager.Entry) {
	if (!entry.refrenceId) return null;
	const ref = await getModeration(entry.guild).fetch(entry.refrenceId);
	return ref;
}

async function fetchEntryChannel(entry: ModerationManager.Entry) {
	const channel = entry.channelId ? await resolveToNull(entry.guild.channels.fetch(entry.channelId)) : null;
	return channel;
}

async function getEmbedDescription(t: TFunction, entry: ModerationManager.Entry, moderator: User) {
	const command = chatInputApplicationCommandMention('case', 'view');

	const reason = entry.reason
		? entry.imageURL
			? `${entry.reason} ⎾[Proof](${entry.imageURL})⏌`
			: entry.reason
		: t(LanguageKeys.Moderation.FillReason, { command, count: entry.id });
	const user = await resolveToNull(entry.fetchUser());
	const refrence = await fetchRefrenceCase(entry);
	const channel = await fetchEntryChannel(entry);

	const userLine = user ? t(LanguageKeys.Guilds.Logs.ArgsUser, { user }) : null;
	const channelLine = channel ? t(LanguageKeys.Guilds.Logs.ArgsChannel, { channel }) : null;
	const modLine = moderator ? t(LanguageKeys.Guilds.Logs.ArgsModerator, { mod: moderator }) : null;
	const durationLine = entry.duration
		? entry.createdAt + entry.duration < Date.now()
			? t(LanguageKeys.Guilds.Logs.ArgsDurationPast, { duration: entry.createdAt + entry.duration })
			: t(LanguageKeys.Guilds.Logs.ArgsDuration, {
					duration: entry.createdAt + entry.duration
				})
		: null;
	const reasonLine = t(LanguageKeys.Guilds.Logs.ArgsReason, { reason });
	const refrenceLine = refrence
		? t(LanguageKeys.Guilds.Logs.ArgsRefrence, {
				id: refrence.id,
				url: messageLink(refrence.logChannelId!, refrence.logMessageId!, entry.guild.id)
			})
		: null;

	return [userLine, modLine, channelLine, durationLine, reasonLine, refrenceLine].filter((a) => Boolean(a)).join('\n');
}

let caseCommandId: Snowflake | null = null;
export function getCaseEditMention() {
	caseCommandId ??= (container.stores.get('commands').get('case') as FoxxieCommand).getGlobalCommandId();
	return chatInputApplicationCommandMention('case', 'edit', caseCommandId);
}
