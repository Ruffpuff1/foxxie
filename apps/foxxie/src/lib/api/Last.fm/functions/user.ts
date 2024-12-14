import { UserLastFM } from '@prisma/client';
import { container } from '@sapphire/framework';
import { isNullish, isNullOrUndefinedOrEmpty } from '@sapphire/utilities';
import { seconds } from '#utils/common';
import { User } from 'discord.js';

import { parseLastFmUserResponse } from '../util/cacheParsers.js';

export async function getMultipleUsers(userIds: Set<string>): Promise<Map<string, UserLastFM>> {
	return container.prisma.userLastFM
		.findMany({
			where: {
				userid: {
					in: [...userIds]
				}
			}
		})
		.then((users) => new Map(users.map((user) => [user.userid, user])));
}

export async function getUser(userid: string) {
	const discordUserIdCacheKey = userDiscordIdCacheKey(userid);
	let user = parseLastFmUserResponse(await container.redis?.get(discordUserIdCacheKey));

	if (user) return user;

	user = await container.prisma.userLastFM.findFirst({ where: { userid } });

	if (user) {
		const lastFmCacheKey = userLastFmCacheKey(user.usernameLastFM);

		await container.redis?.pinsertex(lastFmCacheKey, seconds(5), user);
		await container.redis?.pinsertex(discordUserIdCacheKey, seconds(5), user);
	}

	return user;
}

export async function getUserForId(userid: string) {
	return container.prisma.userLastFM.findFirst({ where: { userid } });
}

export async function getUserSettings(user: User) {
	return getUser(user.id);
}

export async function getUserWithDiscogs(userid: string) {
	return container.prisma.userLastFM.findFirst({ include: { discogs: true, discogsReleases: true }, where: { userid } });
}

export function removeUserFromCache(user: UserLastFM) {
	void container.redis?.del(userDiscordIdCacheKey(user.userid));
	void container.redis?.del(userLastFmCacheKey(user.usernameLastFM));
}

export async function updateUserLastUsed(userid: string) {
	const db = container.prisma.userLastFM;
	const user = await db.findFirst({ where: { userid } });

	if (!isNullish(user)) {
		try {
			db.update({
				data: { lastUsed: new Date() },
				where: {
					userid
				}
			});
		} catch (e) {
			container.logger.error(`Something went wrong while attempting to update user`, e);
		}
	}
}

export async function userBlocked(userId: string) {
	const found = await getUser(userId);
	return found?.blocked === true;
}

export function userDiscordIdCacheKey(userId: string) {
	return `user-${userId}`;
}

export async function userHasSession(user: User) {
	const found = await getUserSettings(user);
	return !isNullOrUndefinedOrEmpty(found?.sessionKeyLastFM);
}

export function userLastFmCacheKey(userNameLastFm: string) {
	return `user-${userNameLastFm}`;
}

export async function userRegistered(user: User) {
	const found = await getUser(user.id);

	return found !== null;
}
