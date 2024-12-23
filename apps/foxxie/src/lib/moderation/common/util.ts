import type { TFunction } from '@sapphire/plugin-i18next';
import type { ModerationManager } from '#lib/moderation/managers/ModerationManager';

import { resolveToNull } from '@ruffpuff/utilities';
import { LanguageKeys } from '#lib/i18n';
import { getColor, TranslationMappings, UndoTaskNameMappings } from '#lib/moderation/common/constants';
import { TypedT } from '#lib/types';
import { getModeration } from '#utils/functions';
import { TypeVariation } from '#utils/moderationConstants';
import { messageLink } from '#utils/transformers';
import { EmbedBuilder } from 'discord.js';

export function getCaseEditMention() {
	return `.case edit`;
}

export async function getEmbed(t: TFunction, entry: ModerationManager.Entry): Promise<EmbedBuilder> {
	const moderator = await entry.fetchModerator();
	const caseT = t(LanguageKeys.Globals.CaseT);
	const modMember = await resolveToNull(entry.guild.members.fetch(moderator));

	const embed = new EmbedBuilder()
		.setColor(getColor(entry))
		.setAuthor({
			iconURL: modMember?.displayAvatarURL() || moderator.displayAvatarURL(),
			name: `${modMember?.displayName || moderator.username} (${moderator.id})`
		})
		.setDescription(await getEmbedDescription(t, entry))
		.setFooter({
			text: `${caseT} #${t(LanguageKeys.Globals.NumberFormat, {
				value: entry.id
			})}`
		})
		.setTimestamp(entry.createdAt);

	return embed;
}

export function getTitle(t: TFunction, entry: ModerationManager.Entry): string {
	const key = getTranslationKey(entry.type);
	if (entry.isUndo()) return getTitleUndo(t, key);
	if (entry.isTemporary()) return getTitleTemporary(t, key);
	return t(key, Object(entry.extraData)) as string;
}

export function getTitleTemporary(t: TFunction, key: TypedT): string {
	return `${t('moderation:temp')} ${t(key)}`;
}

export function getTitleUndo(t: TFunction, key: TypedT): string {
	switch (key) {
		case TranslationMappings[TypeVariation.Lock]:
			return t(LanguageKeys.Moderation.Unlock);
		default:
			return `${t('moderation:remove')} ${t(key)}`;
	}
}

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

async function fetchEntryChannel(entry: ModerationManager.Entry) {
	const channel = entry.channelId ? await resolveToNull(entry.guild.channels.fetch(entry.channelId)) : null;
	return channel;
}

async function fetchRefrenceCase(entry: ModerationManager.Entry) {
	if (!entry.refrenceId) return null;
	const ref = await getModeration(entry.guild).fetch(entry.refrenceId);
	return ref;
}

async function getEmbedDescription(t: TFunction, entry: ModerationManager.Entry) {
	const command = getCaseEditMention();
	const type = getTitle(t, entry);

	const reason = entry.reason
		? entry.imageURL
			? `${entry.reason} ⎾[Proof](${entry.imageURL})⏌`
			: entry.reason
		: t(LanguageKeys.Moderation.FillReason, { command, count: entry.id });
	const user = await resolveToNull(entry.fetchUser());
	const refrence = await fetchRefrenceCase(entry);
	const refType = refrence ? t(getTranslationKey(refrence.type)) : null;
	const channel = [TypeVariation.Lock, TypeVariation.Prune].includes(entry.type) ? await fetchEntryChannel(entry) : null;

	const userLine = user && user.id !== entry.moderatorId ? t(LanguageKeys.Guilds.Logs.ArgsUser, { user }) : null;
	const actionLine = `**Action**: ${type}`;
	const channelLine = channel ? t(LanguageKeys.Guilds.Logs.ArgsChannel, { channel }) : null;
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
				type: refType,
				url: messageLink(entry.guild.id, refrence.logChannelId!, refrence.logMessageId!)
			})
		: null;

	return [userLine, channelLine, actionLine, durationLine, reasonLine, refrenceLine].filter((a) => Boolean(a)).join('\n');
}
