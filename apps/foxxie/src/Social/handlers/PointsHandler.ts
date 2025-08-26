import { minutes, random, randomArray } from '@ruffpuff/utilities';
import { RateLimitManager } from '@sapphire/ratelimits';
import { isNullish } from '@sapphire/utilities';
import { Event } from '#Foxxie/Core';
import { LevelingRole, ReadonlyGuildData, readSettings } from '#lib/database';
import { ensureMember, updateMember } from '#lib/database/Models/member';
import { LanguageKeys } from '#lib/i18n';
import { EventArgs, FoxxieEvents, GuildMessage } from '#lib/types';
import { floatPromise, seconds } from '#utils/common';
import { sendTemporaryMessage } from '#utils/functions';
import { xpNeeded } from '#utils/util';
import { Guild, GuildMember, PermissionFlagsBits, Role, roleMention, userMention } from 'discord.js';
import { getFixedT, TFunction } from 'i18next';

export class PointsHandler {
	@Event((listener) => listener.setName(FoxxieEvents.LevelingMessage).setEvent(FoxxieEvents.LevelingMessage))
	public static async Handle(...[message]: EventArgs<FoxxieEvents.UserMessage>) {
		// dont run on edits
		if (message.editedAt) return;
		// if ratelimted, return
		// if (!(await PointsHandler.IsEnabled(message))) return;
		if (Date.now() - message.member.joinedTimestamp! < minutes(5)) return;
		if (PointsHandler.IsRatelimited(message.author.id)) return;

		return PointsHandler.Member(message);
	}

	private static async FetchLevelSettings(guild: Guild) {
		return readSettings(guild, (settings) => {
			const IsEnabled = settings.levelingMessagesEnabled;
			if (!IsEnabled) return { announce: false } as const;

			return {
				announce: true,
				t: getFixedT('en-US')
			};
		});
	}

	private static async FetchRoleSettings(guild: Guild, level: number) {
		return readSettings(guild, (settings) => {
			const role = PointsHandler.GetRole(settings, level);
			if (isNullish(role.latest)) return null;

			if (!settings.levelingMessagesEnabled) return { announce: false, role } as const;

			return {
				announce: true,
				role,
				t: getFixedT('en-US')
			} as const;
		});
	}

	private static GetCacheKey(message: GuildMessage) {
		return `leveling:${message.guild.id}:${message.member.id}:role`;
	}

	private static GetLevelContent(t: TFunction, member: GuildMember, level: number): string {
		const arr = t(LanguageKeys.Listeners.Events.PointsMessages, {
			guild: member.guild.name,
			level,
			mention: userMention(member.id),
			nick: member.displayName,
			user: member.user.username
		});

		return randomArray(arr);
	}

	private static GetRole(settings: ReadonlyGuildData, level: number) {
		let latest: LevelingRole | null = null;
		const extra: LevelingRole[] = [];
		const over: LevelingRole[] = [];

		for (const role of settings.levelingRoles) {
			if (role.level > level) {
				over.push(role);
				continue;
			}

			extra.push(role);
			latest = role;
		}

		return { extra, latest, over } as const;
	}

	private static GetRoleContent(t: TFunction, member: GuildMember, level: number, role: Role): string {
		const arr = t(LanguageKeys.Listeners.Events.PointsRoleMessages, {
			guild: member.guild.name,
			level,
			mention: userMention(member.id),
			nick: member.displayName,
			role: roleMention(role.id),
			user: member.user.username
		});

		return randomArray(arr);
	}

	private static IsRatelimited(userId: string) {
		const rateLimit = PointsHandler.Ratelimits.acquire(userId);
		if (rateLimit.limited) return true;

		rateLimit.consume();
		return false;
	}

	private static async Member(message: GuildMessage) {
		const entity = await ensureMember(message.member.id, message.guild.id);

		const increment = random(4, 9);
		const newPoints = entity.points + increment;

		const newLevel = entity.level + 1;
		const points = xpNeeded(newLevel);
		console.log(`${newPoints} / ${points}`);

		if (newPoints >= points) {
			await updateMember(message.member.id, message.guild.id, {
				level: newLevel,
				points: newPoints - points
			});

			await PointsHandler.Reward(message, newLevel);
		} else {
			await updateMember(message.member.id, message.guild.id, {
				points: newPoints
			});
		}
	}

	private static PickRole(message: GuildMessage, lvlrole: LevelingRole) {
		const { cache } = message.guild.roles;
		const role = cache.get(lvlrole.id);
		if (isNullish(role)) return null;

		return role;
	}

	private static async Reward(message: GuildMessage, level: number) {
		await PointsHandler.RewardRole(message, level);
		await PointsHandler.RewardLevel(message, level);
	}

	private static async RewardLevel(message: GuildMessage, level: number) {
		const settings = await PointsHandler.FetchLevelSettings(message.guild);
		if (!settings.announce) return;

		const isSent = PointsHandler.AnnouncementCache.has(PointsHandler.GetCacheKey(message));
		if (isSent) return;

		const content = PointsHandler.GetLevelContent(settings.t, message.member, level);
		await sendTemporaryMessage(message, content, minutes(3));
	}

	private static async RewardRole(message: GuildMessage, level: number) {
		// If the client cannot give roles, return immediately.
		const clientMember = await message.guild.members.fetch(message.client.user!.id);
		if (!clientMember.permissions.has(PermissionFlagsBits.ManageRoles)) return;

		const settings = await PointsHandler.FetchRoleSettings(message.guild, level);
		if (isNullish(settings)) return;

		const role = PointsHandler.PickRole(message, settings.role.latest!);
		if (isNullish(role) || role.position >= clientMember.roles.highest.position) return;

		await floatPromise(message.member.roles.add(role, `[Leveling] Rank role for level ${level}.`));

		// add any of the extra roles
		for (const lvlRole of settings.role.extra) {
			// filter out already given roles
			if (lvlRole.id === role.id) continue;

			// get the role for this levelrole.
			const _role = message.guild.roles.cache.get(lvlRole.id);
			if (isNullish(_role)) continue;

			// if role is above client, return;
			if (_role.position >= clientMember.roles.highest.position) continue;

			if (message.member.roles.cache.has(_role.id)) continue;

			await floatPromise(message.member.roles.add(_role, `[Leveling] Adding past rank roles.`));
		}

		// remove roles user is ineligible for
		for (const lvlRole of settings.role.over) {
			// get the role for this levelrole.
			const _role = message.guild.roles.cache.get(lvlRole.id);
			if (isNullish(_role)) continue;

			// if the role is above client, return;
			if (_role.position >= clientMember.roles.highest.position) continue;

			if (message.member.roles.cache.has(_role.id)) {
				await floatPromise(message.member.roles.remove(_role, `[Leveling] Removing past rank roles.`));
			}
		}

		if (!settings.announce) return;

		const content = PointsHandler.GetRoleContent(settings.t, message.member, level, role);
		await sendTemporaryMessage(message, content, minutes(3));

		const key = PointsHandler.GetCacheKey(message);
		PointsHandler.AnnouncementCache.add(key);

		setTimeout(() => {
			PointsHandler.AnnouncementCache.delete(key);
		}, seconds(30));
	}

	private static AnnouncementCache = new Set<string>();

	// private static async IsEnabled(message: GuildMessage) {
	//     return !message.author.bot;
	// }

	private static Ratelimits = new RateLimitManager(minutes(1), 1);
}
