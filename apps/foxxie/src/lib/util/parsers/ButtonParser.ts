import { resolveToNull } from '@ruffpuff/utilities';
import { container } from '@sapphire/pieces';
import { FoxxieButtonInteractionHandler } from '#lib/Structures/commands/interactions/FoxxieButtonInteractionHandler';
import { GuildMember, User } from 'discord.js';

export interface ParsedInfoUserAvatar {
	entity: GuildMember | User;
}

export interface ParsedInfoUserBanner {
	showNotes: boolean;
	showWarnings: boolean;
	user: User;
}

export interface ParsedInfoUserNotes {
	member: GuildMember;
	showBanner: boolean;
	showWarnings: boolean;
}

export interface ParsedInfoUserWarnings {
	member: GuildMember;
	showBanner: boolean;
	showNotes: boolean;
}

export class ButtonParser {
	public static async InfoUserAvatar(
		...[interaction, [targetId]]: FoxxieButtonInteractionHandler.HandleArgs
	): Promise<null | ParsedInfoUserAvatar> {
		if (!targetId) {
			return null;
		}

		const resolvedUser = await resolveToNull(container.client.users.fetch(targetId));
		if (!resolvedUser) return null;

		const resolvedMember = await resolveToNull(interaction.guild!.members.fetch(targetId));
		if (!resolvedMember) {
			return { entity: resolvedUser };
		}

		return { entity: resolvedMember };
	}

	public static async InfoUserBanner(
		...[, [targetId, showNotesKey, showWarningsKey]]: FoxxieButtonInteractionHandler.HandleArgs
	): Promise<null | ParsedInfoUserBanner> {
		if (!targetId) {
			return null;
		}

		const showNotes = showNotesKey === 'true';
		const showWarnings = showWarningsKey === 'true';

		const user = await resolveToNull(container.client!.users.fetch(targetId));
		if (!user) {
			return null;
		}

		return { showNotes, showWarnings, user };
	}

	public static async InfoUserNotes(
		...[interaction, [targetId, showBannerKey, showWarningsKey]]: FoxxieButtonInteractionHandler.HandleArgs
	): Promise<null | ParsedInfoUserNotes> {
		if (!targetId) {
			return null;
		}

		const showBanner = showBannerKey === 'true';
		const showWarnings = showWarningsKey === 'true';

		const member = await resolveToNull(interaction.guild!.members.fetch(targetId));
		if (!member) {
			return null;
		}

		return { member, showBanner, showWarnings };
	}

	public static async InfoUserReset(...[, [targetId]]: FoxxieButtonInteractionHandler.HandleArgs): Promise<null | User> {
		if (!targetId) {
			return null;
		}

		const resolvedUser = await resolveToNull(container.client.users.fetch(targetId));
		if (!resolvedUser) return null;

		return resolvedUser;
	}

	public static async InfoUserWarnings(
		...[interaction, [targetId, showBannerKey, showNotesKey]]: FoxxieButtonInteractionHandler.HandleArgs
	): Promise<null | ParsedInfoUserWarnings> {
		if (!targetId) {
			return null;
		}

		const showBanner = showBannerKey === 'true';
		const showNotes = showNotesKey === 'true';

		const member = await resolveToNull(interaction.guild!.members.fetch(targetId));
		if (!member) {
			return null;
		}

		return { member, showBanner, showNotes };
	}

	public static async LastFMProfileHistory(...[interaction, [targetId]]: FoxxieButtonInteractionHandler.HandleArgs) {
		console.log(interaction);
		return targetId;
	}
}
